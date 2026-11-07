const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide event description']
    },
    category: {
      type: String,
      required: [true, 'Please provide event category'],
      enum: ['Tech Talk', 'Workshop', 'Conference', 'Cultural', 'Sports', 'Hackathon', 'Webinar'],
      default: 'Workshop'
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date']
    },
    location: {
      type: String,
      required: [true, 'Please provide event location or meeting URL'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide capacity'],
      default: 100
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);

