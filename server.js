//Cargar dependencias
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarBD = require('./config/database');

//Primero cargamos las variables de entorno por buenas practicas y seguridad.
dotenv.config({
    path: './config/config.env'
});

// Conexion Base de Datos
conectarBD();

const app = express();
//Hacemos el setup de express de una vez en json para que sea mas facil enviar la data requerida a MongoDB por Mongoose
app.use(express.json());
//Activamos el uso de CORS.
app.use(cors());

//Definimos la carpeta estatica para el front
app.use(express.static(path.join(__dirname, 'public')));

//Rutas
app.use('/api/historial', require('./routes/historial'))

//Definimos las variables conectadas a las de entorno.
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

//Por informacion denotamos la informacion de ejecucion. Debug....
app.listen(PORT, () => console.log(`Servidor ejecutandose en modo ${ENV} en el puerto ${PORT}`));