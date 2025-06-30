import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

if (!MONGODB_URI) {
	throw new Error("Missing MONGODB_URI env variable");
}

if (!DB_NAME) {
	throw new Error("Missing DB_NAME env variable");
}

async function dbConnect() {
	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(MONGODB_URI, {
			dbName: DB_NAME,
		});
	}
}

export default dbConnect;
