const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-populate members and creator on every find
teamSchema.pre(/^find/, function () {
  this.populate({ path: 'members',    select: 'name email role photo' })
      .populate({ path: 'created_by', select: 'name email role' });
});

module.exports = mongoose.model('Team', teamSchema);
