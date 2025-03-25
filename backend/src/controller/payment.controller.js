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
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    const payload = req.rawBody;

    console.log('🔄 Processing webhook:', {
      hasSignature: !!sig,
      payloadSize: payload?.length,
      secret: process.env.STRIPE_WEBHOOK_SECRET?.slice(0,4) + '...'
    });

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Webhook verification failed:', {
        error: err.message,
        signature: sig?.slice(0,10) + '...',
        payloadPreview: payload?.slice(0,20) + '...'
      });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('🎉 Webhook received:', event.type);

    // Get the object from the event
    const object = event.data.object;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'checkout.session.completed':
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        // Get the subscription and customer details
        const subscriptionId = object.subscription || object.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = object.customer;
        
        // Get clerkId from metadata
        const clerkId = subscription.metadata.clerkId || 
                       object.metadata?.clerkId;

        if (!clerkId) {
          console.error('No clerkId found in metadata:', object);
          return res.status(400).json({ error: 'No clerkId found' });
        }

        // Update user status
        const updateResult = await User.findOneAndUpdate(
          { clerkId },
          {
            isPro: true,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: subscription.status,
            updatedAt: new Date()
          },
          { new: true }
        );

        console.log('✅ User updated:', {
          clerkId,
          isPro: updateResult?.isPro,
          event: event.type
        });
        break;
      }

      case 'invoice.created':
      case 'invoice.finalized':
      case 'invoice.updated':
        // Log these events but no action needed
        console.log(`📋 Invoice event: ${event.type}`);
        break;

      case 'payment_intent.created':
      case 'payment_intent.succeeded':
        // Log payment events
        console.log(`💰 Payment event: ${event.type}`);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.json({
      received: true,
      type: event.type,
      object: object.object
    });
  } catch (err) {
    console.error('❌ Webhook processing error:', err);
    res.status(400).json({ error: err.message });
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
