/* eslint-disable no-console */
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const MongoDB = require('./src/db/mongoDB');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥💥💥 Shutting down...');
  console.log(err.name, err.message, err, err.stack);
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 9090;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Connect Mongo
MongoDB();

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥💥💥 Shutting down...');
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});

//SIGTERM is a signal that is used to cause a program to stop running
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully.');
  server.close(() => {
    console.log('💥💥💥 Process terminated!');
  });
});
console.log(process.env.NODE_ENV);
