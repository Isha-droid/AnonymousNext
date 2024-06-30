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

        try {
            const userMessages =await UserModel.findById(userId, { message: 1 }).lean();


            
            console.log(userMessages)

            if (!userMessages) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "No messages found for the user",
                    }),
                    { status: 404 }
                );
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    messages: userMessages,
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
    } catch (error) {
        console.error("Error authenticating user:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error: Not authenticated",
            }),
            { status: 401 }
        );
    }
}
