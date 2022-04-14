const express = require("express");
const testRoutes = require("./endpoints/test/TestRoutes");
const userRoutes = require("./endpoints/user/UserRoute");
const app = express();

// Adding the Routes

app.use("/", testRoutes);
app.use("/user", userRoutes);

const port = 7080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
