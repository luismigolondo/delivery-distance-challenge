const mongoose = require('mongoose');
const axios = require('axios').default;

const RegistroSchema = new mongoose.Schema({
    // Esta especificacion es tomada directamente de https://mongoosejs.com/docs/geojson.html
    direccion1: {
        type: String,
        required: [true, 'Debe agregar la primera direccion']
    },
    direccion1GEO: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere' // Para calculos mas exactos https://www.mongodb.com/docs/manual/core/2dsphere/
        },
        direccionFormateada: {
            type: String,
        }
    },
    direccion2: {
        type: String,
        required: [true, 'Debe agregar una segunda direccion']
    },
    direccion2GEO: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere' // Para calculos mas exactos https://www.mongodb.com/docs/manual/core/2dsphere/
        },
        direccionFormateada: {
            type: String
        }
    },
    distancia: {
        type: String,
        required: [true, 'Se necesita hacer el registro con una distancia calculada.']
    },
    creacion: {
        type: Date,
        default: Date.now
    }
});

//Generamos la direccion del API
//Hacemos la funcion pre porque queremos editar el schema antes de publicarlo en la base de datos.
RegistroSchema.pre('save', async function (next) {

    const reqDir1 = await axios.get(`https://nominatim.openstreetmap.org/search?q=${this.direccion1}&format=json`);
    const jsonDir1 = await JSON.stringify(reqDir1.data);
    const dir1 = await JSON.parse(jsonDir1)[0];
    this.direccion1GEO = {
        type: 'Point',
        coordinates: [parseFloat(dir1.lat), parseFloat(dir1.lon)],
        direccionFormateada: dir1.display_name
    };
    // Reformulamos las direcciones ingresadas por el usuario.
    this.direccion1 = dir1.display_name;

    const reqDir2 = await axios.get(`https://nominatim.openstreetmap.org/search?q=${this.direccion2}&format=json`);
    const jsonDir2 = await JSON.stringify(reqDir2.data);
    const dir2 = await JSON.parse(jsonDir2)[0];
    this.direccion2GEO = {
        type: 'Point',
        coordinates: [parseFloat(dir2.lat), parseFloat(dir2.lon)],
        direccionFormateada: dir2.display_name
    };
    // Reformulamos las direcciones ingresadas por el usuario.
    this.direccion2 = dir2.display_name;

    next();
})


module.exports = mongoose.model('Registro', RegistroSchema);