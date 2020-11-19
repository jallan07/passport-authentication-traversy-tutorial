const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// init the app variable with expresss
const app = express();

// ejs middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

// routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on http://localhost:${PORT}`));
