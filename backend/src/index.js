import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import paymentRoutes from "./routes/payment.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import { handleWebhook } from "./controller/payment.controller.js"; // Fix path from "controllers" to "controller"

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

// Configure CORS options first
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CLIENT_URL,
        'https://frontend-tau-one-96.vercel.app',
        'https://backend-silk-xi.vercel.app'
      ]
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'clerk-token', 'stripe-signature']
};

// Add this before any other middleware
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Move CORS after the raw body parser
app.use(cors(corsOptions));

// Configure webhook route first, before any other middleware
app.post('/webhook', 
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    console.log('📥 Webhook received:', {
      contentType: req.headers['content-type'],
      hasSignature: !!sig,
      bodySize: req.body?.length,
      path: req.path,
      method: req.method
    });

    if (!sig) {
      console.error('❌ No Stripe signature found');
      return res.status(400).send('No Stripe signature');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('❌ No webhook secret configured');
      return res.status(500).send('Webhook secret not configured');
    }

    try {
      await handleWebhook(req, res);
    } catch (err) {
      console.error('❌ Webhook handler error:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// Regular middlewares after webhook
app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB  max file size
		},
	})
);

// Add this before your routes
// Serve static files from the public directory
app.use('/songs', express.static(path.join(__dirname, 'public/songs')));
app.use('/cover-images', express.static(path.join(__dirname, 'public/cover-images')));

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use((req, res, next) => {
  console.log("Request URL:", req.url);
  next();
});

// Update route mappings without /api prefix
app.use("/songs", songRoutes);
app.use("/albums", albumRoutes);
app.use("/playlists", playlistRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/stats", statRoutes);
app.use("/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// error handler
app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

httpServer.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	connectDB();
});
