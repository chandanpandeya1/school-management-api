const SchoolModel = require('../models/schoolModel');

// Calculate geographical distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Add School
exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const data = { name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    SchoolModel.addSchool(data, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'School added successfully.' });
    });
};

// List Schools
exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and Longitude are required.' });
    }

    SchoolModel.getAllSchools((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const userLatitude = parseFloat(latitude);
        const userLongitude = parseFloat(longitude);

        const sortedSchools = results.map((school) => {
            const distance = calculateDistance(
                userLatitude,
                userLongitude,
                school.latitude,
                school.longitude
            );
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
};
