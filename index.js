const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db("rideHailingDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
connectToMongoDB();

// Customer Registration
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).send("Missing fields");

  try {
    const result = await db.collection("users").insertOne({ name, email, password, role: 'customer' });
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

// Customer Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email, password });
    if (user) res.status(200).send("Login successful");
    else res.status(401).send("Unauthorized");
  } catch (error) {
    res.status(500).send("Login error");
  }
});

// Update Driver Status
app.patch('/drivers/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.collection("drivers").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) return res.status(404).send("Driver not found");
    res.status(200).send("Status updated");
  } catch (error) {
    res.status(500).send("Error updating status");
  }
});

// Block User (Admin)
app.delete('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  // You can add an admin check here
  try {
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(403).send("User not found or forbidden");
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
