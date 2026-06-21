
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });

async function main() {
    console.log("--- Email Configuration Test ---");
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log("User:", user);
    console.log("Password Length:", pass ? pass.length : 0);

    if (!user || !pass) {
        console.error("❌ Error: Missing EMAIL_USER or EMAIL_PASS in .env file");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user,
            pass: pass,
        },
    });

    try {
        console.log("Attempting to verify connection...");
        await transporter.verify();
        console.log("✅ Connection Successful! Credentials are correct.");

        console.log("Attempting to send test email...");
        await transporter.sendMail({
            from: user,
            to: user, // Send to self
            subject: "Test Email from Chronicles Script",
            text: "If you see this, your email configuration is working perfectly!",
        });
        console.log("✅ Test Email Sent Successfully!");
    } catch (error) {
        console.error("❌ Connection Failed:");
        console.error(error.message);
        if (error.code === 'EAUTH') {
            console.log("\n💡 Tip: This is an Authentication Error.");
            console.log("1. Ensure you are using an APP PASSWORD, not your login password.");
            console.log("2. Check for spaces in the .env file.");
            console.log("3. Ensure 2-Step Verification is ON for your Google Account.");
        }
    }
}

main();
