const Event = require('../models/Event');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public / Authenticated
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email role')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('getEvents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message
    });
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email role');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Protected (User or Admin)
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location, capacity } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, date, and location'
      });
    }

    const event = await Event.create({
      title,
      description,
      category: category || 'Workshop',
      date,
      location,
      capacity: capacity || 100,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('createEvent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Protected (Admin or Event Creator)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Allow deletion if user is admin OR creator of the event
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent
};

