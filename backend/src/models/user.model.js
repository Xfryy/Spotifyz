import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
		isPro: {
			type: Boolean,
			default: false
		},
		stripeCustomerId: {
			type: String,
			sparse: true
		},
		stripeSubscriptionId: {
			type: String,
			sparse: true
		},
		subscriptionStatus: {
			type: String,
			enum: ['active', 'canceled', 'past_due', null],
			default: null
		}
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
