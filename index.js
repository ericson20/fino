const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require('path');
// set up express

const app = express();
app.use(express.json());
app.use(cors());
var whitelist = ['https://facturavirtual.pe'] 
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.all('/', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    );
}

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

console.log(process.env.MONGODB_CONNECTION_STRING);

// set up mongoose
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

// set up routes

app.use("/users", require("./routes/userRouter"));
app.use("/trans", require("./routes/transRouter"));
app.use("/customers", require("./routes/customerRouter"));
