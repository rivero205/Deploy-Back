const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// Endpoint de bienvenida
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del panel solar' });
});

// Obtener todos los datos de todas las estaciones
router.get('/datos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('datos_panel')
            .select('*')
            .order('fecha_registro', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener datos de una estación específica
router.get('/datos/:id_estacion', async (req, res) => {
    const { id_estacion } = req.params;
    try {
        const { data, error } = await supabase
            .from('datos_panel')
            .select('*')
            .eq('id_estacion', id_estacion)
            .order('fecha_registro', { ascending: false });

        if (error) throw error;
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
        const { data, error } = await supabase
            .from('datos_panel')
            .insert([{
                id_estacion,
                voltaje_panel, 
                voltaje_bateria, 
                estado_carga, 
                luz_solar,
                potencia_almacenada,
                usuarios_totales
            }]);

        if (error) throw error;
        res.json({ 
            message: 'Datos insertados con éxito',
            id_estacion: id_estacion
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener últimas lecturas de todas las estaciones
router.get('/ultimas-lecturas', async (req, res) => {
    try {
        // Traer todos los datos
        const { data, error } = await supabase
            .from('datos_panel')
            .select('*');

        if (error) throw error;

        // Agrupar y quedarnos con el más reciente por estación
        const ultimas = Object.values(
            data.reduce((acc, item) => {
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