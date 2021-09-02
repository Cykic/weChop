const mongoose = require('mongoose');

const menuSchema = mongoose.Schema(
  {
    name: { type: String },
    images: [
      {
        type: String
      }
    ],
    description: { type: String },
    category: { type: String },
    price: { type: Number }
  },
  { versionKey: false }
);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
