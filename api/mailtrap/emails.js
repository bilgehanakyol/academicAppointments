import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
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