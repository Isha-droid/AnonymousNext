import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
    
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    // Validate the query parameter
    const validationResult = UsernameQuerySchema.safeParse(queryParam);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid username format",
        }),
        { status: 400 }
      );
    }

    const { username } = validationResult.data;

    // Check if the username already exists in the database
    const user = await UserModel.findOne({ username, isVerified:true });

    if (user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is available",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error checking username");
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      { status: 500 }
    );
  }
}
