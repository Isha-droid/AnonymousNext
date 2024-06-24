import { z } from "zod";

// Define individual field validations
export const userNameValidation = z.string().min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters");
const emailValidation = z.string().email("Invalid email format");
const passwordValidation = z.string().min(6, "Password must be at least 6 characters long");


// Combine all field validations into a sign-up schema
export const signUpSchema = z.object({
    username: userNameValidation,
    email: emailValidation,
    password: passwordValidation,
    
});


