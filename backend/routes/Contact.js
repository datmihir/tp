const express = require('express');
const router = express.Router();

const {getContacts, addContact, updateContact, deleteContact} = require('../controllers/contactController');
const {auth} = require('../middleware/auth');

router.get('/getContacts', auth, getContacts);
router.post('/addContact', auth, addContact);
router.put('/updateContact/:id', auth, updateContact);
router.delete('/deleteContact/:id', auth, deleteContact);

module.exports = router;
