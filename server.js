// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g., CSS, JS)

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle form submission
app.post('/submit-contact-form', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required');
  }

  // Create message object
  const newMessage = {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString()
  };

  // Save the message to a file (messages.json)
  fs.readFile(path.join(__dirname, 'messages.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading messages file:', err);
      return res.status(500).send('Internal server error');
    }

    const messages = data ? JSON.parse(data) : [];
    messages.push(newMessage);

    fs.writeFile(path.join(__dirname, 'messages.json'), JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        console.error('Error writing to messages file:', err);
        return res.status(500).send('Internal server error');
      }

      // Respond back to the user
      res.status(200).send('Your message has been sent successfully!');
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
