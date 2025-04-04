const express = require('express'); 
const router = express.Router();
const DatosPanel = require('./models/DatosPanel');
const { Op } = require('sequelize');

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

// Insertar datos (múltiples o individual)
router.post('/datos', async (req, res) => {
    try {
        // Verificar si es un array o un objeto individual
        const datos = Array.isArray(req.body) ? req.body : [req.body];
        
        // Validar cada objeto en el array
        for (const dato of datos) {
            const { 
                id_estacion,
                voltaje_panel, 
                voltaje_bateria, 
                estado_carga, 
                luz_solar, 
                potencia_almacenada,
                usuarios_totales
            } = dato;

            if (!id_estacion || !voltaje_panel || !voltaje_bateria || 
                estado_carga === undefined || luz_solar === undefined || 
                !potencia_almacenada || usuarios_totales === undefined) {
                return res.status(400).json({ 
                    error: 'Todos los campos son obligatorios',
                    dato_invalido: dato 
                });
            }
        }

        // Crear todos los registros
        const nuevosRegistros = await DatosPanel.bulkCreate(datos);
        
        res.json({ 
            message: 'Datos insertados con éxito',
            registros_creados: nuevosRegistros.length
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

// Borrar datos
router.delete('/datos/:id_estacion', async (req, res) => {
    const { id_estacion } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;

    try {
        let whereClause = { id_estacion };

        // Si se proporcionan fechas, agregar al filtro
        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_registro = {
                [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
            };
        } else if (fecha_inicio) {
            whereClause.fecha_registro = {
                [Op.gte]: new Date(fecha_inicio)
            };
        } else if (fecha_fin) {
            whereClause.fecha_registro = {
                [Op.lte]: new Date(fecha_fin)
            };
        }

        const registrosBorrados = await DatosPanel.destroy({
            where: whereClause
        });

        if (registrosBorrados === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron registros para borrar con los criterios especificados' 
            });
        }

        res.json({ 
            message: 'Registros borrados exitosamente',
            registros_borrados: registrosBorrados
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
