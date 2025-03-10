require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/submit", upload.single("file"), (req, res) => {
    const { rating, feedback } = req.body;
    const file = req.file;

    // Email configuration
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "adinasaridewi2006@gmail.com",
        subject: "New Rating Received",
        text: `⭐ Rating: ${rating}\n\n📝 Feedback: ${feedback || "No feedback provided."}`,
        attachments: file ? [{ path: file.path }] : []
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error(err);
            res.send("Error sending email.");
        } else {
            res.send("Thank you for your feedback!");
            if (file) fs.unlinkSync(file.path);
        }
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));