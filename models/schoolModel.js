const db = require('../config/db');

class SchoolModel {
    static addSchool(data, callback) {
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        db.query(query, [data.name, data.address, data.latitude, data.longitude], callback);
    }

    static getAllSchools(callback) {
        const query = 'SELECT * FROM schools';
        db.query(query, callback);
    }
}

module.exports = SchoolModel;
