import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User"; // Assuming Message is defined in UserModel
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request: Request): Promise<Response> {
    await dbConnect();

    try {
        // Parse the request body to get username and message content
        const { username, content }: { username: string; content: string } = await request.json();

        // Ensure authenticated session
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!session || !user) {
            return new Response(
                JSON.stringify({ success: false, message: "Error: Not authenticated" }),
                { status: 401 }
            );
        }
        console.log(username)
        console.log(content)

        // Find the user in the database by username
        const existingUser = await UserModel.findOne({ username });

        if (!existingUser) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }
        if (!existingUser.isAcceptingMessage) {
            return new Response(
                JSON.stringify({ success: false, message: "User is not accepting messages" }),
                { status: 403 }
            );
        }
        console.log(existingUser)
        // Construct the new message object
        const newMessage = {
            content,
            createdAt: new Date(),
        };

        // Push the new message to the user's messages array
        existingUser.message.push(newMessage as Message);

        // Save the updated user document
        await existingUser.save();

        return new Response(
            JSON.stringify({ success: true, message: "Message sent successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding message:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error adding message" }),
            { status: 500 }
        );
    }
}
