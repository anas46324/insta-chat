// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'email-smtp.eu-north-1.amazonaws.com', 
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.PASSWORD 
//     }
// });

// // Function to send an email
// const sendEmail = async (email, token) => {
//     const mailOptions = {
//         from: "anasahmed3531@gmail.com",
//         to: email,
//         subject: 'Sign Up Confirmation',
//         text: `Click on the following link to confirm your account: 
//                http://localhost:5173/auth?token=${token}`,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Email sending failed');
//     }

//     return transporter.sendMail(mailOptions);
// };

// module.exports = { sendEmail };
