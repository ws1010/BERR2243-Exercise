// controllers/rideController.js
const Ride = require('../models/Ride');

exports.createRide = async (req, res) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can create rides' });
  }

  const { from, to, price, date } = req.body;

  try {
    const ride = new Ride({
      driver: req.user.id,
      from,
      to,
      price,
      date
    });

    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ride' });
  }
};

exports.getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'available' }).populate('driver', 'name');
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
};

exports.bookRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'available') {
      return res.status(400).json({ error: 'Ride not available' });
    }

    ride.passenger = req.user.id;
    ride.status = 'booked';
    await ride.save();

    res.status(200).json({ message: 'Ride booked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed' });
  }
};
