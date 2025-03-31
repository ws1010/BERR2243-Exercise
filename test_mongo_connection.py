import time
from pymongo import MongoClient

start_time = time.time()  # Start timer

try:
    client = MongoClient("mongodb://localhost:27017/")
    print("Connected to MongoDB!")
except Exception as e:
    print("Connection failed:", e)

end_time = time.time()  # End timer

duration = (end_time - start_time) * 1000  # Convert to milliseconds
print(f"Connection Time: {duration:.2f} ms")
