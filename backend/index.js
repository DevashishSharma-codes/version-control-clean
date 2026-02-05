const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mainRouter = require('./routes/main.router');

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors({ origin: '*' }));
  app.use('/', mainRouter);

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(port, () => {
        console.log(`Server is running on PORT ${port}`);
      });
    })
    .catch(err => {
      console.error("MongoDB connection error:", err);
    });
}

startServer();
