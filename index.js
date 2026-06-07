const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log(error);
});


app.get("/", (req, res) => {
    res.send("API Running");
});


// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;