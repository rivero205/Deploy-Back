const express = require('express'); 
const router = express.Router();
const DatosPanel = require('./models/DatosPanel');

// Endpoint de bienvenida
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del panel solar' });
});

// Obtener todos los datos de todas las estaciones
router.get('/datos', async (req, res) => {
    try {
        const data = await DatosPanel.findAll({
            order: [['fecha_registro', 'DESC']]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener datos de una estación específica
router.get('/datos/:id_estacion', async (req, res) => {
    const { id_estacion } = req.params;
    try {
        const data = await DatosPanel.findAll({
            where: { id_estacion },
            order: [['fecha_registro', 'DESC']]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Insertar datos
router.post('/datos', async (req, res) => {
    const { 
        id_estacion,
        voltaje_panel, 
        voltaje_bateria, 
        estado_carga, 
        luz_solar, 
        potencia_almacenada,
        usuarios_totales
    } = req.body;

    // Validación de campos
    if (!id_estacion || !voltaje_panel || !voltaje_bateria || 
        estado_carga === undefined || luz_solar === undefined || 
        !potencia_almacenada || usuarios_totales === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const nuevoDato = await DatosPanel.create({
            id_estacion,
            voltaje_panel,
            voltaje_bateria,
            estado_carga,
            luz_solar,
            potencia_almacenada,
            usuarios_totales
        });
        res.json({ 
            message: 'Datos insertados con éxito',
            id_estacion: nuevoDato.id_estacion
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener últimas lecturas de todas las estaciones
router.get('/ultimas-lecturas', async (req, res) => {
    try {
        const datos = await DatosPanel.findAll();
        const ultimas = Object.values(
            datos.reduce((acc, item) => {
                const key = item.id_estacion;
                if (!acc[key] || new Date(item.fecha_registro) > new Date(acc[key].fecha_registro)) {
                    acc[key] = item;
                }
                return acc;
            }, {})
        );
        res.json(ultimas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
