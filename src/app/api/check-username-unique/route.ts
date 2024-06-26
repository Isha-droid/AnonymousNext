import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

// Define the schema for validating the username query parameter
const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    console.log("calling function")
    // Parse the URL to get the query parameters
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    console.log(queryParam)
    // If username is available
    // If username is available
    

    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

if (queryParam.username) {
  const match = queryParam.username.match(emailRegex);
  if (match) {
    const email = match[0];
    console.log(email); // Output: kishori@gmail.com
  } else {
    console.log("No email found in the input string.");
  }
} else {
  console.log("Username is null.");
}



    // Validate the query parameter using Zod schema
    const username = queryParam.username;
    console.log(username)
    // if (!validationResult.success) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "Invalid username format",
    //     }),
    //     { status: 400 }
    //   );
    // }

    console.log(username)
    // Check if the username already exists in the database and is verified
    const user = await UserModel.findOne({ username, isVerified: true });

    if (user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        { status: 409 }
      );
      console.log("username taken")
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is available",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      { status: 500 }
    );
  }
}
