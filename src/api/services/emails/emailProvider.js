const nodemailer = require('nodemailer');
const { emailConfig } = require('../../../config/vars');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password
  }
});

const categoryMap = new Map([
  ["Stu1", "Experience-related matters"],
  ["Stu2", "Arrangements for teaching/assessments"],
  ["Stu3", "Student Village matters (non-tenancy)"],
  ["Stu4", "International student matters"], // High
  ["Sta1", "Code of Ethics and Code of Conduct"],
  ["Sta2", "Violence, aggression and bullying in the workplace"], // High
  ["Sta3", "Unlawful discrimination and harassment"], // High
  ["Sta4", "Personal relationships between staff members"],
  ["Sta5", "Responsible conduct of research"],
  ["Sta6", "General grievances"],
  ["Sta7", "Dispute settlement"],
  ["Sta8", "Equal opportunity grievance management"],
  ["Sta9", "Resolving workplace health and safety issues"],
  ["Sta10", "Research misconduct"] // High
]);

//verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log('error with email connection');
  }
});

  exports.sendSubmitConfirm = async(ticketObject)=>{
    const content = `Dear ${
      ticketObject.firstName
      },<br/><p>Thank you for your submission. Your complaint will be acknowledged and dealt with as quickly as possible.<br/> At the University, the complaint handling process is based on the principles of effective complaints handling, and the International Standard on <b>Complaints Handling ISO:10002.</b></p><br/><p>Your ticket details are as follows:</p><ul><li>Ticket ID: ${
      ticketObject._id
      } </li><li>Title: ${
      ticketObject.title
      }</li><li>Category: ${categoryMap.get(
      ticketObject.category
      )} </li><li>Content: ${ticketObject.content}</li><li>Severity level: ${
      ticketObject.severityLevel
      } </li><li>Suggestion: ${
      ticketObject.suggestion
      }</li></ul><p>Please reply to this email should you need more information.<br/><br/>Thanks,<br/><b>The Murdoch Complaint Support Team</b></p>`;

    let mailOptions = {
      from: "murdoch.Ticketportal@gmail.com",
      to: ticketObject.email,
      subject: "[Murdoch] Complaint Ticket Confirmation",
      html: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email error: " + error);
        //res.sendStatus(400);
        return;
      } else {
        console.log("Email sent: " + mailOptions + "\nEnd Submit Ticket");
        //res.sendStatus(200);
        return;
      }
    });
  }

  exports.sendDashboardLogin = async(loginObject) => {
    let mailOptions = {
      from: "murdoch.Ticketportal@gmail.com",
      to: loginObject.email,
      subject: "[Murdoch] OTP Verification Code",
      html: `Dear User,<br/><br/><p>Your Complaint Portal Verification Code is: <b>${loginObject.otp}</b><br/><br/>Thanks,<br/><b>The Murdoch Complaint Support Team</b></p>`
    };     
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email error: " + error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });  
  }