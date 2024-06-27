import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

interface VerifyRequestBody {
    username: string;
    code: string;
}

interface JsonResponse {
    success: boolean;
    message: string;
}

export async function POST(request: Request): Promise<Response> {
    await dbConnect();

    try {
        const { username, code }: VerifyRequestBody = await request.json();
        const decodedUsername = decodeURIComponent(username);
        console.log(username)
        console.log(code)


        // Find the user with the given username
        const user = await UserModel.findOne({ username: decodedUsername });
        console.log(user)

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                } as JsonResponse),
                { status: 404 }
            );
        }

        // Check if the verification code matches and if it is not expired
        const currentDateTime = new Date();
        if (user.verifyCode !== code) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid verification code",
                } as JsonResponse),
                { status: 400 }
            );
        }

        if (new Date(user.verifyCodeExpiry) < currentDateTime) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification code has expired",
                } as JsonResponse),
                { status: 400 }
            );
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verifyCode = ""; // Optionally clear the verification code
        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "User verified successfully",
            } as JsonResponse),
            { status: 200 }
        );
    } catch (error) {
        console.error(error, "error verifying user");
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error verifying user",
            } as JsonResponse),
            { status: 500 }
        );
    }
}
