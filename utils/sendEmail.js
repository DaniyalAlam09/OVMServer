const nodemailer = require("nodemailer");
const config = require("config");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.get("HOST"),
      service: config.get("SERVICE"),
      port: config.get("EMAIL_PORT"),
      secure: config.get("SECURE"),
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: config.get("USER"),
        pass: config.get("PASS"),
      },
    });

    await transporter.sendMail({
      from: config.get("USER"),
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
