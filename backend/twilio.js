require("dotenv").config({ path: "./.env" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Number verification function
const NumberVerification = ({ phoneNumber, code }) => {
  client.messages
    .create({
      from: `${process.env.TWILIO_PHONE_NUMBER}`, // note the format
      contentSid: `${process.env.TWILIO_CONTENT_SID}`,           // template SID
      contentVariables: JSON.stringify({ "1": code }),      // convert object to JSON string
      to: `whatsapp:${phoneNumber}`,
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
};

module.exports = { NumberVerification };
