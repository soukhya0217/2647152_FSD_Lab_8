import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import models
import Dairy from "./models/Dairy.js";
import Farmer from "./models/Farmer.js";
import Collection from "./models/Collection.js";
import Location from "./models/Location.js";
import Registration from "./models/Registration.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dairy_management";

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully at:", MONGO_URI);
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// ==================== DAIRY REST CRUD API ====================

// 1. GET ALL DAIRY RECORDS (Read from MongoDB)
app.get("/api/dairy", async (req, res) => {
    try {
        const dairyRecords = await Dairy.find();
        res.json(dairyRecords);
    } catch (error) {
        res.status(500).json({ error: "Failed to read dairy records from database." });
    }
});

// 2. GET ONE DAIRY RECORD BY ID (Read from MongoDB)
app.get("/api/dairy/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const record = await Dairy.findById(id);

        if (!record) {
            return res.status(404).json({ error: `Dairy record with ID ${id} not found.` });
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: "Failed to read dairy record from database." });
    }
});

// 3. POST A NEW DAIRY RECORD (Write to MongoDB)
app.post("/api/dairy", async (req, res) => {
    try {
        const { name, quantity, price } = req.body;

        if (!name || quantity === undefined || price === undefined) {
            return res.status(400).json({ error: "Name, quantity, and price are required." });
        }

        const newRecord = new Dairy({
            name,
            quantity: Number(quantity),
            price: Number(price)
        });

        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: "Failed to write dairy record to database." });
    }
});

// 4. PUT/UPDATE AN EXISTING DAIRY RECORD (Write to MongoDB)
app.put("/api/dairy/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, quantity, price } = req.body;

        if (!name || quantity === undefined || price === undefined) {
            return res.status(400).json({ error: "Name, quantity, and price are required." });
        }

        const updatedRecord = await Dairy.findByIdAndUpdate(
            id,
            {
                name,
                quantity: Number(quantity),
                price: Number(price)
            },
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ error: `Dairy record with ID ${id} not found.` });
        }

        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: "Failed to update dairy record in database." });
    }
});

// 5. DELETE A DAIRY RECORD BY ID (Write to MongoDB)
app.delete("/api/dairy/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRecord = await Dairy.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ error: `Dairy record with ID ${id} not found.` });
        }

        res.json({ message: "Dairy record deleted successfully.", id });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete dairy record from database." });
    }
});


// ==================== OTHER LAB DASHBOARD APIs ====================

// GET DASHBOARD STATUS (Read counts from MongoDB)
app.get("/api/dashboard", async (req, res) => {
    try {
        const farmerCount = await Farmer.countDocuments();
        const collectionCount = await Collection.countDocuments();
        const productCount = await Dairy.countDocuments();
        const locObj = await Location.findOne();

        res.json({
            farmerCount,
            collectionCount,
            productCount,
            locationStatus: locObj ? locObj.location : "Not Set"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve dashboard statistics." });
    }
});

// POST FARMER DETAILS (Write to MongoDB)
app.post("/api/farmers", async (req, res) => {
    try {
        const { name, phone, email, city } = req.body;
        if (!name || !phone || !city) {
            return res.status(400).json({ error: "Name, phone and city are required." });
        }

        const newFarmer = new Farmer({ name, phone, email, city });
        await newFarmer.save();

        res.status(201).json(newFarmer);
    } catch (error) {
        res.status(500).json({ error: "Failed to write farmer data to database." });
    }
});

// POST COLLECTION DETAILS (Write to MongoDB)
app.post("/api/collections", async (req, res) => {
    try {
        const { farmerId, milkType, quantity, date } = req.body;
        if (!farmerId || !milkType || !quantity || !date) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newEntry = new Collection({
            farmerId: parseInt(farmerId),
            milkType,
            quantity: parseFloat(quantity),
            date
        });
        await newEntry.save();

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: "Failed to write collection data to database." });
    }
});

// POST GEOLOCATION DATA (Upsert in MongoDB)
app.post("/api/location", async (req, res) => {
    try {
        const { location } = req.body;
        if (!location) {
            return res.status(400).json({ error: "Location coordinates required." });
        }

        const savedLoc = await Location.findOneAndUpdate(
            {},
            { location },
            { upsert: true, new: true }
        );
        res.json({ message: "Location saved successfully.", location: savedLoc.location });
    } catch (error) {
        res.status(500).json({ error: "Failed to write geolocation to database." });
    }
});

// GET USER REGISTRATIONS (Read from MongoDB)
app.get("/api/registrations", async (req, res) => {
    try {
        const registrations = await Registration.find();
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Failed to read registrations from database." });
    }
});

// POST USER REGISTRATION (Write to MongoDB)
app.post("/api/registrations", async (req, res) => {
    try {
        const user = req.body;
        if (!user.name || !user.username || !user.email || !user.dob || !user.gender || !user.role || !user.city) {
            return res.status(400).json({ error: "Missing required registration fields." });
        }

        // Prevent duplicate usernames (case-insensitive check)
        const existingUser = await Registration.findOne({
            username: { $regex: new RegExp("^" + user.username + "$", "i") }
        });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken." });
        }

        const newRegistration = new Registration(user);
        await newRegistration.save();

        res.status(201).json(newRegistration);
    } catch (error) {
        res.status(500).json({ error: "Failed to save registration to database." });
    }
});

// Serve frontend fallback to home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Dairy Management Server is running on port ${PORT}`);
    console.log(`Access the application: http://localhost:${PORT}`);
});
