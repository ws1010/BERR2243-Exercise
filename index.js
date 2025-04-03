const { MongoClient } = require('mongodb');

// Sample driver data
const drivers = [
    { name: "John Doe", vehicleType: "Sedan", isAvailable: true, rating: 4.8 },
    { name: "Alice Smith", vehicleType: "SUV", isAvailable: false, rating: 4.5 },
    { name: "Charlie Brown", vehicleType: "Hatchback", isAvailable: true, rating: 4.9 }
];

// MongoDB connection details
const uri = "mongodb://localhost:27017"; // Ensure MongoDB is running
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Select database and collection
        const db = client.db("TaxiService");
        const driversCollection = db.collection("Drivers");

        // Insert drivers into the collection
        const insertResults = await driversCollection.insertMany(drivers);
        console.log(` Inserted ${insertResults.insertedCount} drivers`);

        // Find all available drivers with rating ≥ 4.5
        const highRatedDrivers = await driversCollection.find({
            isAvailable: true,
            rating: { $gte: 4.5 }
        }).toArray();
        console.log("Available High-Rated Drivers:", highRatedDrivers);

        // Increase John Doe's rating by 0.1 using `$inc`
        const updateResult = await driversCollection.updateOne(
            { name: "John Doe" },  
            { $inc: { rating: 0.1 } } 
        );

        if (updateResult.modifiedCount > 0) {
            console.log("John Doe's rating increased by 0.1");
        } else {
            console.log("John Doe not found or no update needed.");
        }

        // Remove unavailable drivers
        const deleteResult = await driversCollection.deleteMany({ isAvailable: false });

        console.log(` Removed ${deleteResult.deletedCount} unavailable drivers`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Close the connection
        await client.close();
        console.log(" MongoDB connection closed.");
    }
}

// Run the function
run();
