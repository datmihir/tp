const db = require('../config/db');

exports.getContacts = (req, res) => {
    const user_id = req.user.id;
    db.query('SELECT * FROM contacts WHERE user_id = ?', [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(results);
    });
};

exports.addContact = (req, res) => {
    const { name, phone, email, address } = req.body;
    const user_id = req.user.id;
    db.query('INSERT INTO contacts SET ?', { name, phone, email, address, user_id }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Contact added successfully' });
    });
};

exports.updateContact = (req, res) => {
    const id = req.params.id;
    const { name, phone, email, address } = req.body;
    const user_id = req.user.id;
    db.query('UPDATE contacts SET ? WHERE id = ? AND user_id = ?', [{ name, phone, email, address }, id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact updated successfully' });
    });
};

exports.deleteContact = (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    db.query('DELETE FROM contacts WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    });
};