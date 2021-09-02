const mongoose = require('mongoose');

const menuSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide Name']
    },
    images: [
      {
        type: String
      }
    ],
    description: {
      type: String,
      required: [true, 'Please provide Description']
    },
    category: {
      type: String,
      required: [true, 'Please provide Category']
    },
    price: {
      type: Number,
      required: [true, 'Please provide Price']
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Please provide Admin ']
    },
    uploadedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { versionKey: false }
);

menuSchema.pre(/^find/, function(next) {
  this.populate({ path: 'uploadedBy', select: 'name phone' });
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
