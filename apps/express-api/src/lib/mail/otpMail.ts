import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.

// Wrap in an async IIFE so we can use await.
export const sendOtpMail = async ({
	to,
	token,
	otp,
}: {
	to: string;
	token: string;
	otp?: string;
}) => {
	console.log("Sending token to:", to);
	console.log(
		"process.env.EMAIL:",
		process.env.EMAIL,
		" ",
		process.env.EMAIL_PASS
	);
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		auth: {
			user: process.env.EMAIL, // generated ethereal user
			pass: process.env.EMAIL_PASS, // generated ethereal password
		},
	});
	const info = await transporter.sendMail({
		from: '"Super 30 Exness" <harunath04@gmail.com>',
		to: to,
		subject: "OTP for Super 30 Exness ✔",
		html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; font-family: Arial, sans-serif; color: #333333; border: 1px solid #dddddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #d32f2f; margin: 0; font-size: 28px;">Super 30 Exness</h1>
        </div>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">

        <h2 style="color: #111111;">Your OTP Code</h2>
        <p style="font-size: 16px;">Use the following URL to verify and login your email with <strong>Super 30 Exness</strong>:</p>
        <div style="text-align: center; margin: 30px 0;">
   				<span style="display: inline-block; background-color: #ffffff; color: #1976d2; padding: 15px 30px; font-size: 24px; border-radius: 6px; letter-spacing: 2px;">
     				${otp}
   				</span>
 				</div>


        <p style="font-size: 14px; color: #888;">This code is valid for <strong>60 minutes</strong>. If you didn’t request this, please ignore this email.</p>

        <div style="margin-top: 40px; font-size: 12px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} Super 30 Expness. All rights reserved.
        </div>
      </div>
      `,
	});

	console.log("Message sent:", info.messageId);
};

// <div style="text-align: center; margin: 30px 0;">
//   <span style="display: inline-block; background-color: #ffffff; color: #1976d2; padding: 15px 30px; font-size: 24px; border-radius: 6px; letter-spacing: 2px;">
//     <a href="${
// 			process.env.NODE_URI + "/v1/signin/post?token=" + token
// 		}">${process.env.NODE_URI + "/v1/signin/post?token=" + token}</a>
//   </span>
// </div>
