const database = require("./conection_DB");
const server = require("./server"); 


database
  .sync({ force: false, logging: false })
  .then(() => {
    server.listen(4500, () => {
      console.log("Servidor levantado exitosamente");
      console.log("Base de Datos Conectada");
    });
  })

  .catch((error) => console.error(error));