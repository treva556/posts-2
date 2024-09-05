
// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true, // Remove this if using driver version >= 4.0.0
  useUnifiedTopology: true // Remove this if using driver version >= 4.0.0
});

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use the global variable to prevent multiple connections
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }
} else {
  // In production mode, use a single instance of the client
  clientPromise = client.connect();
}

export default clientPromise;
