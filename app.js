const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

// init the app variable with expresss
const app = express();

// DB config
const db = require("./config/keys").MongoURI;

// connect to mongo
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log("MongoDB connected..."))
	.catch((err) => console.log(err));

// ejs middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

// body parser middleware
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on http://localhost:${PORT}`));
