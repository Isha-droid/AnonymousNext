import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'mahajanisha508@gmail.com',
            to: email,
            subject: 'Anonymous app Verification Code ',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        

        return {
            success:true,
            message:"user registered successfully"
        }
        
    } catch (emailError) {
        console.log(emailError)
        return {
            success:false,
            message:" failed to send verification email"
        }
    }
}