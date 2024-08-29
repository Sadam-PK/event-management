const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

// db connection
mongoose.connect("mongodb://localhost:27017", {
  dbName: "event-management",
});

app.listen(3000, () => console.log("Server running on port 3000"));


