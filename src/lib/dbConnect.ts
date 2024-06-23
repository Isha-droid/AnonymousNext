import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    const mongoDbUrl = process.env.MONGO_DB_URL;

    if (!mongoDbUrl) {
        throw new Error("MONGO_DB_URL is not defined in environment variables");
    }

    try {
        const db = await mongoose.connect(mongoDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database: ", error);
        throw new Error("Database connection failed");
    }
}

export default dbConnect;
