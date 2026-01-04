const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

require("dotenv").config();
const mongoose = require("mongoose");
const key = process.env.RENDER_API_KEY;
const passport = require("passport");
var cors = require('cors')


app.use(cors())
app.use(express.json());

// async function main() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected successfully");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//   }
// }

// main();
let MONGOURL = 'mongodb://127.0.0.1:27017/test20';
main()
.then(() => {
console.log("connection successful");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGOURL);
}

app.use(passport.initialize());
require("./confing/passport");
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/noteRoutes"));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
