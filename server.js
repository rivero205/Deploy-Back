// server.js
require('dotenv').config(); // Añadimos esto al inicio
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

// Iniciar servidor
const PORT = process.env.PORT || 4500; // Podemos usar una variable de entorno para el puerto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}`);
    console.log('Conexión a Supabase:', process.env.SUPABASE_URL ? 'Configurada' : 'No configurada');
});