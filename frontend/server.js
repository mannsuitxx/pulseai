const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Check if index.html exists
const indexPath = path.join(__dirname, 'build', 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('index.html found at', indexPath);
} else {
  console.error('index.html not found at', indexPath);
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});