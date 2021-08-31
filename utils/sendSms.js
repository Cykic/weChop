/* eslint-disable no-console */
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const AppError = require('../src/error/appError');

module.exports = async function(to, message) {
  const msg = await client.messages
    .create({
      body: message,
      to: to,
      from: process.env.TWILO_NUMBER
    })
    .catch(() => {
      throw new AppError(`Could not send message to ${to}, Try Again`, 500);
    });

  if (process.env.NODE_ENV === 'development') {
    console.log(msg.body);
  }
  // Else
  return msg;
};
