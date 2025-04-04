const express = require('express');
const router = express.Router();


// Endpoint de bienvenida
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del panel solar' });
});


module.exports = router;