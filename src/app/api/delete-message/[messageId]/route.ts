import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
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
    message?: string;
}

export async function DELETE(request: Request, { params }: { params: { messageId: string } }): Promise<Response> {
    const { messageId } = params;
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

        // Delete the message from the user's messages array
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } },
            { new: true }
        );

        // Check if the message was successfully deleted
        if (!updatedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Message not found or already deleted",
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message deleted successfully",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting message:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error deleting message",
            }),
            { status: 500 }
        );
    }
}
