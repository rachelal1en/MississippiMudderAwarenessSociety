// Importing Express
const express = require('express');
const app = express();

const { pool } = require('./dbConfig');

const path = require('path');

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse form-data

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Mississippi Mudder Society!');
});

app.get('/about', (req, res) => {
    res.json({
        title: 'Mississippi Mudder Awareness Society',
        description: 'We raise awareness about the Mississippi Mudder since 1969.'
    });
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'FinalProject.html'));
});

app.get('/contact-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ContactUs.html'));
});

app.post('/submit-report', async (req, res) => {
    const { name, location, description } = req.body;

    try {
        // Insert the new sighting report into the database
        const [result] = await pool.execute(
            'INSERT INTO sightings (name, location, description, created_at) VALUES (?, ?, ?, NOW())',
            [name, location, description]
        );
        console.log('New Sighting Report Added:', result);

        res.status(200).json({
            message: 'Report submitted successfully!',
            reportId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Database error. Could not save the report.'
        });
    }
});

app.get('/recent-sightings', async (req, res) => {
    try {
        // Fetch data from the sightings table
        const [rows] = await pool.query('SELECT * FROM sightings ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Database error. Could not fetch sightings.'
        });
    }
});


// Start the server
const PORT = 3000; // You can use any other port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});