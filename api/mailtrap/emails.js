import { 
    PASSWORD_RESET_REQUEST_TEMPLATE, 
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })
        console.log("Email send succesfully", response)
    } catch (error) {
        throw new Error(`Error sending verification email: ${error}`)
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
    console.log("recipient", recipient);
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "e96a7a1f-02de-4309-842d-2dfe5bc4c185",
            template_variables: {
                 company_info_name: "İskenderun Teknik Üniversitesi",
                 name: name,
            }
        })
        console.log("Welcome email send succesfully.", response);
    } catch (error) {
        console.error(`error sending welcome email, ${error}`);
        throw new Error(`Error sending welcome email ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`; // Tam URL'yi oluştur
    const recipient = [{ email }];

    try { 
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password.",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL), // URL'yi gönder
            category: "Password Reset",
        });
    } catch (error) {
        console.log("Error sending password reset email", error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};
export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful.",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        })  
    } catch (error) {
        console.log("error sending password reset success email", error);
        throw new Error(`error sending password reset success email: ${error}`);
    }
}