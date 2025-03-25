import mongoose from "mongoose";
import { Artist } from "../models/artist.model.js";
import { config } from "dotenv";

config();

const artists = [
    {
        fullName: "Sarah Mitchell",
        imageUrl: "/artists/sarah-mitchell.jpg",
        bio: "Pop singer-songwriter from Los Angeles"
    },
    {
        fullName: "The Wanderers",
        imageUrl: "/artists/the-wanderers.jpg",
        bio: "Indie rock band from Portland"
    },
    {
        fullName: "Electric Dreams",
        imageUrl: "/artists/electric-dreams.jpg",
        bio: "Electronic music producer duo"
    },
    // Add more artists as needed
];

const seedArtists = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Artist.deleteMany({});
        await Artist.insertMany(artists);
        console.log("Artists seeded successfully!");
    } catch (error) {
        console.error("Error seeding artists:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedArtists();
