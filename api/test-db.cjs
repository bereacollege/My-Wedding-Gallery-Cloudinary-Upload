require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    const Test = mongoose.model('Test', testSchema);

    async function runTest() {
      const doc = new Test({ name: 'Wedding Test' });
      await doc.save();

      console.log('✅ Document saved:', doc);

      const docs = await Test.find();
      console.log('📂 All documents:', docs);
    }

    return runTest().then(() => mongoose.connection.close());
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
