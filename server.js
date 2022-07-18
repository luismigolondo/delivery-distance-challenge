//Cargar dependencias
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

//Primero cargamos las variables de entorno por buenas practicas y seguridad.
dotenv.config({ path: './config/config.env' });

const app = express();

//Definimos las variables conectadas a las de entorno.
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

//Por informacion denotamos la informacion de ejecucion. Debug....
app.listen(PORT, () => console.log(`Servidor ejecutandose en modo ${ENV} en el puerto ${PORT}`));