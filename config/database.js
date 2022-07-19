const mongoose = require('mongoose');

const conectarBD = async () => {
    try {
        const conexion = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connected: ${conexion.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = conectarBD;