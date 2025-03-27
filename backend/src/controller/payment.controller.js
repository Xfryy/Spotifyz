import Stripe from "stripe";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    // Get user and create if doesn't exist
    let user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      // Create new user if somehow not created in auth callback
      user = await User.create({
        clerkId: req.auth.userId,
        email: req.auth.sessionClaims?.email,
        fullName: req.auth.sessionClaims?.name || `User_${req.auth.userId.slice(-6)}`,
        imageUrl: req.auth.sessionClaims?.image || '/default-avatar.png',
        isPro: false
      });
    }

    let customerId = user.stripeCustomerId;
    
    // Create or get Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.auth.sessionClaims?.email,
        name: user.fullName,
        metadata: {
          clerkId: req.auth.userId,
        },
      });
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      user = await User.findByIdAndUpdate(
        user._id,
        { stripeCustomerId: customerId },
        { new: true }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      metadata: {
        clerkId: req.auth.userId,
      },
      subscription_data: {
        metadata: {
          clerkId: req.auth.userId,
        }
      },
      client_reference_id: user._id.toString()
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    console.log('🔍 Constructing webhook event...');
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('✅ Event constructed successfully:', {
      type: event.type,
      id: event.id
    });

    // Get event data
    const data = event.data.object;
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = data;
        console.log('💳 Checkout completed:', {
          customerId: session.customer,
          sessionId: session.id,
          subscriptionId: session.subscription
        });
        
        // Get user from metadata
        const clerkId = session.metadata?.clerkId;
        if (!clerkId) {
          throw new Error('No clerkId found in session metadata');
        }

        // Update user with retries
        let retries = 3;
        while (retries > 0) {
          try {
            const user = await User.findOneAndUpdate(
              { clerkId },
              { 
                isPro: true,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                subscriptionStatus: 'active'
              },
              { new: true }
            );

            console.log('👤 User updated:', {
              clerkId,
              isPro: user.isPro,
              customerId: user.stripeCustomerId
            });
            break;
          } catch (err) {
            retries--;
            if (retries === 0) throw err;
            await new Promise(r => setTimeout(r, 1000));
          }
        }
        break;
      }

      // Handle other events...
      default:
        console.log(`🤔 Unhandled event type: ${event.type}`);
    }

    // Return success
    res.json({ received: true, type: event.type });
  } catch (err) {
    console.error('💥 Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const checkProStatus = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({ isPro: false });
    }

    // If user has a subscription, verify with Stripe
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const isActive = subscription.status === 'active';
        
        if (user.isPro !== isActive) {
          await User.findByIdAndUpdate(user._id, { 
            isPro: isActive,
            subscriptionStatus: subscription.status
          });
        }
        
        return res.json({ isPro: isActive });
      } catch (err) {
        console.error('Failed to verify subscription with Stripe:', err);
      }
    }

    return res.json({ isPro: Boolean(user.isPro) });
  } catch (error) {
    console.error('Check pro status error:', error);
    res.status(500).json({ error: error.message });
  }
};
