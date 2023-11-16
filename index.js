require('dotenv').config();
const path = require('path');
const database = require('./databases/dbConnect');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());


// Import controllers and routes
const apiv1Route = require('./routes/api-v1-Route');

// Body Parser and Static Path
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Define Routes
app.use('/api/v1', apiv1Route);

// Login Route for the Root Path
app.get('/',(req, res) => {
  res.status(200).send({'Success':'Your API working fine'});
});

// 404 Error Handling Middleware
app.use((req, res) => {
  res.status(404).send({'Error':'Page Not Found'});
});

const port = process.env.PORT || 3000; // Use the specified port or default to 3000
app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
});
