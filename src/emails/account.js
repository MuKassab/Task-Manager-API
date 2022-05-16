"use strict";
const nodemailer = require("nodemailer")

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.ACCOUNT_USERNAME, 
      pass: process.env.ACCOUNT_PASSWORD 
    }
})


const sendWelcomeEmail = async (name, email) => {
  // send mail with defined transport object
  const info = transporter.sendMail({
    from: '"Task Manager" ' + process.env.ACCOUNT_USERNAME, // sender address
    to: email, // list of receivers
    subject: "Welcome to Task Manager ✔", // Subject line
    text: `Welcome ${name},\n\nWe are glad you decided to try our task manager and hopefully it will help you better manage your time` // plain text body
  });
  //return ("Message sent: %s", info.messageId)
}

const sendCancelationEmail =  (name, email) => {
  // send mail with defined transport object
  const info = transporter.sendMail({
    from: '"Task Manager" ' + process.env.ACCOUNT_USERNAME, // sender address
    to: email, // list of receivers
    subject: "Task Manager Canceled ❌", // Subject line
    text: `Hello ${name},\n\n\nWe are very sorry that you canceled out service if you want you can reach out to us with what we could have done better.\n\nThanks,\nTask Manager Team.` // plain text body
  });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

//Doing the same job using sendgrid module
/*const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (name, email) => {
    console.log("Bye")
    sgMail.send({
        to: email,
        from: "mohammadkassab933@gmail.com",
        subject: "Welcome to Task Manager",
        text: `Welcome ${name},\n\nWe are glad you decided to try our task manager and hopefully it will help you better manage your time`
    })
}

const sendCancelationEmail =  (name, email) => {
    sgMail.send({
        to: email,
        from: "mohammadkassab933@gmail.com",
        subject: "Task Manager Canceled",
        text: `Hello ${name},\n\n\nWe are very sorry that you canceled out service if you want you can reach out to us with what we could have done better.\n\nThanks,\nTask Manager Team.`
    })
}*/
