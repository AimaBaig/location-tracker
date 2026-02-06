const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const LOCATIONS_FILE = 'locations.json';

// Initialize file
if (!fs.existsSync(LOCATIONS_FILE)) {
  fs.writeFileSync(LOCATIONS_FILE, '[]');
}

// Receive location
app.post('/api/location', (req, res) => {
  const locations = JSON.parse(fs.readFileSync(LOCATIONS_FILE));
  locations.push(req.body);
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(locations, null, 2));
  console.log('Location received:', req.body);
  res.json({success: true});
});

// Dashboard
app.get('/', (req, res) => {
  const locations = JSON.parse(fs.readFileSync(LOCATIONS_FILE));
  let html = '<h1>Locations</h1>';
  locations.forEach(loc => {
    const mapUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
    html += `<p>${loc.timestamp}: <a href="${mapUrl}" target="_blank">${loc.latitude}, ${loc.longitude}</a></p>`;
  });
  res.send(html);
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
