import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

interface UpdateAcceptMessagesRequest {
    acceptMessages: boolean;
}

interface JsonResponse {
    success: boolean;
    message: string;
}

export async function POST(request: Request): Promise<Response> {
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
                } as JsonResponse),
                { status: 401 }
            );
        }

        // Extract user ID and acceptMessages status from request body
        const userId = user._id;
        const { acceptMessages }: UpdateAcceptMessagesRequest = await request.json();

        // Update user's acceptMessages status
        const updatedUser: User| null = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                } as JsonResponse),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Accept messages status updated successfully",
                updatedUser
            } as JsonResponse),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating accept messages status:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error updating accept messages status",
            } as JsonResponse),
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect()
    const session= await getServerSession(authOptions)
    const user: User= session?.user as User
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

        // Fetch user data from the database
        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                { status: 404 }
            );
        }

        // Return user data in the response
        return new Response(
            JSON.stringify({
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error fetching user data",
            }),
            { status: 500 }
        );
    }

    
}
