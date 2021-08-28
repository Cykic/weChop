const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// const DB = process.env.LOCAL_DATABASE;

const Mongodb = function() {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => console.log('Database connection successful!'))
    .catch(err => console.log('Database connection failed', err));
};

module.exports = Mongodb;
