// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createRide,
  getAvailableRides,
  bookRide
} = require('../controllers/rideController');

router.post('/', auth, createRide);             // /api/rides
router.get('/', getAvailableRides);             // /api/rides
router.put('/:id/book', auth, bookRide);        // /api/rides/:id/book

module.exports = router;
