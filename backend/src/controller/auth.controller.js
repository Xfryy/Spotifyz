import { User } from "../models/user.model.js";
import { clerkClient } from "@clerk/express";

export const authCallback = async (req, res, next) => {
	try {
		// Get the Clerk user ID from request
		const { id, firstName, lastName, imageUrl, email } = req.body;

		// Ensure we have a valid Clerk ID
		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Invalid user data. Missing Clerk ID."
			});
		}

		// Verify if this user exists in Clerk
		try {
			// This will throw an error if user doesn't exist
			const clerkUser = await clerkClient.users.getUser(id);
			
			// Check if email is verified for email logins
			if (email && clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
				const primaryEmail = clerkUser.emailAddresses.find(
					emailObj => emailObj.emailAddress === email
				);
				
				if (!primaryEmail || primaryEmail.verification.status !== "verified") {
					return res.status(400).json({
						success: false,
						message: "Email address not verified. Please verify your email first."
					});
				}
			}
		} catch (error) {
			console.log("Error verifying Clerk user:", error);
			return res.status(401).json({
				success: false,
				message: "User verification failed."
			});
		}
		
		// Extract data with fallbacks
		const fName = firstName || "";
		const lName = lastName || "";
		const img = imageUrl || "/default-avatar.png";
		
		// Check if user already exists in our database
		let user = await User.findOne({ clerkId: id });

		if (!user) {
			// New user signup
			user = await User.create({
				clerkId: id,
				fullName: `${fName} ${lName}`.trim(),
				imageUrl: img,
				isPro: false,
				email: email // Store email if available
			});
		} else {
			// Update existing user info if needed
			user.fullName = `${fName} ${lName}`.trim();
			user.imageUrl = img;
			if (email && !user.email) {
				user.email = email;
			}
			await user.save();
		}

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				clerkId: user.clerkId,
				fullName: user.fullName,
				imageUrl: user.imageUrl,
				isPro: user.isPro,
				createdAt: user.createdAt,
				email: user.email
			}
		});
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};