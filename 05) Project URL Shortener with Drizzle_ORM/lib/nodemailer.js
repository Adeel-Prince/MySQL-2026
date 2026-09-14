import nodemailer from "nodemailer";


const testAccount = await nodemailer.createTestAccount();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export const sendEmail = async({to, subject, html}) => {
 const info =  await transporter.sendMail({
        from: `'URL SHORTENER' < ${testAccount.user} >`,
        to, 
        subject, 
        html,
    });
    const testEmailURL=  nodemailer.getTestMessageUrl(info);
    console.log("Verify Email: ", testEmailURL);
}

