const express = require('express');
const cors = require('cors'); 
const { MongoClient, ObjectId } = require('mongodb'); 
const port = 3000;

const app = express();

app.use(cors());

app.use(express.json());

let db;

async function connectToMongoDB() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    db = client.db("testDB");
  } catch (err) {
    console.error("Error:", err);
  }
}
connectToMongoDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//
// 🚗 POST - Register (Passenger)
//
app.post('/users', async (req, res) => {
  const { name, email, role, phone } = req.body;
  if (!name || !email || !role || !phone) return res.status(400).send("Missing fields");

  const result = await db.collection('users').insertOne({ name, email, role, phone });
  res.status(201).json(result);
});

//
// 🔐 POST - Login (Any role)
//
app.post('/auth/login', async (req, res) => {
  const { email } = req.body;
  const user = await db.collection('users').findOne({ email });
  if (user) res.status(200).json(user);
  else res.status(401).send("Unauthorized");
});

//
// 📥 POST - Book Ride (Passenger)
//
app.post('/rides', async (req, res) => {
  const { passengerId, destination } = req.body;
  if (!passengerId || !destination) return res.status(400).send("Missing info");
  const ride = await db.collection('rides').insertOne({ passengerId, destination, status: 'pending' });
  res.status(201).json(ride);
});

//
// 📤 POST - Set Driver Availability
//
app.post('/drivers/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;
  await db.collection('users').updateOne(
    { _id: new ObjectId(id), role: 'driver' },
    { $set: { available } }
  );
  res.status(200).send("Driver availability updated");
});

//
// 🧾 GET - View Ride History (Passenger)
//
app.get('/rides/:passengerId/history', async (req, res) => {
  const rides = await db.collection('rides').find({ passengerId: req.params.passengerId }).toArray();
  res.status(200).json(rides);
});

//
// 📋 GET - View All Users (Admin)
//
app.get('/admin/users', async (req, res) => {
  const users = await db.collection('users').find().toArray();
  res.status(200).json(users);
});

//
// ✅ PATCH - Accept Ride (Driver)
//
app.patch('/rides/:rideId/accept', async (req, res) => {
  const { rideId } = req.params;
  const { driverId } = req.body;

  await db.collection('rides').updateOne(
    { _id: new ObjectId(rideId) },
    { $set: { status: 'accepted', driverId } }
  );

  res.status(200).send("Ride accepted");
});

//
// 🔒 DELETE - Block User (Admin)
//
app.delete('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  res.status(204).send();
});

