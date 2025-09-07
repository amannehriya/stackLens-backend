const express = require('express');
const nodemailer = require('nodemailer');
const upload = require('../config/multer-config');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

router.post('/send-resume', isLoggedIn, upload.single('resume'), async (req, res) => {
    try {
        const { companyEmail, applicantEmail, applicantName } = req.body;
        // console.log("hit",companyEmail,applicantEmail)
        // Configure nodemailer transport (use Gmail, Outlook, or SMTP service)
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, //with the help of this all user are able to send thier resume with only one email address which we are configured in our .env file
                pass: process.env.EMAIL_PASS  //but the recipient will accept the resume on thier own gmail inbox and wher we are mentioning who can send this mail(applicant email) but actually all mails are send  with our single app-email
            }
        })

        // Send email with resume attachment
        await transport.sendMail({
            from: `"${applicantName}" <${applicantEmail}>`,
            to: companyEmail,
            subject: `New Resume from ${applicantName}`,
            text: `Hi, please find attached resume of ${applicantName}`,
            attachments: [
                {
                    filename: req.file.originalname,
                    content: req.file.buffer,
                },
            ],
        });
        res.json({ status: true, message: "Resume sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Failed to send resume." });
    }
})

module.exports = router;