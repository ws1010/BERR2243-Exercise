const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// --- The aggregation pipeline you exported from Compass ---
const pipeline = [
  {
    '$lookup': {
      'from': 'rides', 
      'localField': '_id', 
      'foreignField': 'userId', 
      'as': 'userRides'
    }
  }, {
    '$unwind': {
      'path': '$userRides'
    }
  }, {
    '$group': {
      '_id': '$name', 
      'totalRides': {
        '$sum': 1
      }, 
      'totalFare': {
        '$sum': '$userRides.fare'
      }, 
      'avgDistance': {
        '$avg': '$userRides.distance'
      }
    }
  }, {
    '$project': {
      '_id': 0, 
      'name': '$_id', 
      'totalRides': 1, 
      'totalFare': 1, 
      'avgDistance': 1
    }
  }
];


// --- API Endpoint: GET /analytics/passengers --- 
app.get('/analytics/passengers', async (req, res) => {
  try {
    const database = client.db('eHailingDB'); // Use the correct database name
    const users = database.collection('users'); // Start aggregation from the 'users' collection

    // Execute the aggregation pipeline
    const result = await users.aggregate(pipeline).toArray();
    
    // Send the result as a JSON response
    res.json(result);

  } catch (error) {
    console.error("Failed to perform aggregation:", error);
    res.status(500).send({ message: "Error performing aggregation", error });
  }
});


// --- Function to connect to DB and start the server ---
async function startServer() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Start listening for requests
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1); // Exit if cannot connect to DB
  }
}

// Run the server
startServer();