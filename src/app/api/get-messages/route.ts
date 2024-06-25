import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

interface Message {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    // Define other message properties as needed
}

interface JsonResponse {
    success: boolean;
    messages?: Message[];
    message?: string;
}

export async function GET(request: Request): Promise<Response> {
    await dbConnect();

    try {
        // Get the user session
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        // Check if user session is valid
        if (!session || !user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Error: Not authenticated",
                }),
                { status: 401 }
            );
        }

        // Convert user._id to a mongoose ObjectId
        const userId = new mongoose.Types.ObjectId(user._id);

        // Perform MongoDB aggregation to fetch user's messages
        const userData = await UserModel.aggregate([
            { $match: { _id: userId } }, // Match user by ObjectId
            { $unwind: "$messages" }, // Unwind messages array
            { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt descending
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group messages back into array
        ]);

        // Check if user data or messages exist
        if (!userData || userData.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No messages found for the user",
                }),
                { status: 404 }
            );
        }

        // Extract messages from the aggregation result
        const messages: Message[] = userData[0].messages;

        // Return messages in the response
        return new Response(
            JSON.stringify({
                success: true,
                messages,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user messages:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error fetching user messages",
            }),
            { status: 500 }
        );
    }
}
