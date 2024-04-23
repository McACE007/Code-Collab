const express = require('express');  // Import Express.js

const app = express();  // Create an instance of an Express application

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello, Express World!');  // Send a response
});

const PORT = 3002;

app.listen(PORT, () => {  // Listen on port 3000
  console.log(`Server is running at http://localhost:${PORT}`);
});

