const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming database connection is set up

// POST /addSchool
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate inputs
    if (!name || !address || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'All fields are required and must be valid.' });
    }

    // Insert school into the database
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add school.' });
        }

        res.status(201).json({
            message: 'School added successfully!',
            data: { id: result.insertId, name, address, latitude, longitude }
        });
    });
});

// GET /listSchools
router.get('/listSchools', (req, res) => {
    const userLatitude = parseFloat(req.query.latitude);
    const userLongitude = parseFloat(req.query.longitude);

    if (!userLatitude || !userLongitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const query = 'SELECT *, ( 3959 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance FROM schools ORDER BY distance';

    db.query(query, [userLatitude, userLongitude, userLatitude], (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
