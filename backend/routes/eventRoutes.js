const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public route to view events
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes to create and delete events
router.post('/', protect, createEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;

