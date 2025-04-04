const { DataTypes } = require("sequelize");
const sequelize = require("./conection_DB"); // ajusta si el archivo se llama distinto

const DatosPanel = sequelize.define("datos_panel", {
  id_estacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  voltaje_panel: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  voltaje_bateria: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estado_carga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  luz_solar: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  potencia_almacenada: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  usuarios_totales: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = DatosPanel;
