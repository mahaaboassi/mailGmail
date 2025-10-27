const express = require("express")
const cors = require("cors")
require('dotenv').config();
const nodemailer = require("nodemailer");
const { isValidDomain } = require("./utils/checkMail");

const app = express();
app.use(cors());
app.use(express.json());

const sendEmail = async (email,subject,body) => {
    try {
      // Set up the email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // Or your preferred email service
        auth: {
          user:process.env.EMAIL, // Replace with your email
          pass: process.env.APP_PASSWORD, // Replace with your email password or app password
        },
          tls: {
                rejectUnauthorized: false, // ⛔ Not secure for production
            },
      });
   // Admin Email
      const adminEmailOptions = {
        from: process.env.EMAIL, // Replace with your email
        to: email, // Replace with admin's email
        subject: subject,
        html:  body
      };



      const info = await transporter.sendMail(adminEmailOptions);
      console.log("Email sent:", info.response);

    return { success: true, response: info.response };
    } catch (error) {
    
        console.error("Error sending email:", error);
        return {
            success: false,
            error: error.message,
        };
    }
  };
const sendEmailForOutLook = async (email,subject,body) => {
    try {
      // Set up the email transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com", // Or your preferred email service
        port: 587,
        secure: false,
        auth: {
          user:process.env.EMAIL_TRN, // Replace with your email
          pass: process.env.APP_PASSWORD_TRN, // Replace with your email password or app password
        },
          tls: {
                ciphers: "SSLv3",
            },
      });
   // Admin Email
      const adminEmailOptions = {
        from: process.env.EMAIL, // Replace with your email
        to: email, // Replace with admin's email
        subject: subject,
        html:  body
      };



      const info = await transporter.sendMail(adminEmailOptions);
      console.log("Email sent:", info.response);

    return { success: true, response: info.response };
    } catch (error) {
    
        console.error("Error sending email:", error);
        return {
            success: false,
            error: error.message,
        };
    }
  };
app.post("/api/mail", async (req, res) => {
  try {
    const { body ,userEmail, subject , adminEmail } = req.body;

         // Email validation (simple regex for format)
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(adminEmail)) {
             return res.status(422).json({
                 success: false,
                 data: [],
                 details: "",
                 message: "Please provide a valid Admin Email address.",
                 status: 422
             });
         }
        const emailExists = await isValidDomain(adminEmail);
        if (!emailExists) {
            return res.status(422).json({
                success: false,
                data: [],
                details: "",
                message: "The domain of this admin email address is not valid or doesn't exist.",
                status: 422,
            });
        }
        // validation For user email
         if (!emailRegex.test(userEmail)) {
             return res.status(422).json({
                 success: false,
                 data: [],
                 details: "",
                 message: "Please provide a valid Email address.",
                 status: 422
             });
         }
        const emailExistsUser = await isValidDomain(userEmail);
        if (!emailExistsUser) {
            return res.status(422).json({
                success: false,
                data: [],
                message: "The domain of this email address is not valid or doesn't exist.",
                status: 422,
            });
        }
        if( !subject){
            return res.status(422).json({
                success: false,
                data: [],
                details: "",
                message: "The Subject field is required.",
                status: 422,
            }); 
        }
        const result = await sendEmail(adminEmail,subject,body);
        console.log(result);
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            data: [],
            message: "Oops, Failed to send email",
            details: result.error,
            status :500
          });
        }

        res.status(200).json({
          success: true,
          data: [],
          message: "Email sent successfully",
          details: "",
          status :500
        });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success : false,
        data: [],
        message: "Failed to send email",
        details: err.message,
        status :500 });
  }
});
app.post("/api/mail/outlook", async (req, res) => {
  try {
    const { body ,userEmail, subject , adminEmail } = req.body;

         // Email validation (simple regex for format)
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(adminEmail)) {
             return res.status(422).json({
                 success: false,
                 data: [],
                 details: "",
                 message: "Please provide a valid Admin Email address.",
                 status: 422
             });
         }
        const emailExists = await isValidDomain(adminEmail);
        if (!emailExists) {
            return res.status(422).json({
                success: false,
                data: [],
                details: "",
                message: "The domain of this admin email address is not valid or doesn't exist.",
                status: 422,
            });
        }
        // validation For user email
         if (!emailRegex.test(userEmail)) {
             return res.status(422).json({
                 success: false,
                 data: [],
                 details: "",
                 message: "Please provide a valid Email address.",
                 status: 422
             });
         }
        const emailExistsUser = await isValidDomain(userEmail);
        if (!emailExistsUser) {
            return res.status(422).json({
                success: false,
                data: [],
                message: "The domain of this email address is not valid or doesn't exist.",
                status: 422,
            });
        }
        if( !subject){
            return res.status(422).json({
                success: false,
                data: [],
                details: "",
                message: "The Subject field is required.",
                status: 422,
            }); 
        }
        const result = await sendEmailForOutLook(adminEmail,subject,body);
        console.log(result);
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            data: [],
            message: "Oops, Failed to send email",
            details: result.error,
            status :500
          });
        }

        res.status(200).json({
          success: true,
          data: [],
          message: "Email sent successfully",
          details: "",
          status :500
        });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success : false,
        data: [],
        message: "Failed to send email",
        details: err.message,
        status :500 });
  }
});
app.listen(5100, () => console.log("Server running on port 5100"));