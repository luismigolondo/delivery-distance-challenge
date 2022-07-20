const mongoose = require('mongoose');
const axios = require('axios').default;

// @desc 'Schema' de mongoose para definir un registro con todas las condiciones y campos de la NonRDB
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
    },
    creacion: {
        type: Date,
        default: Date.now
    }
});

// @desc Se calculan las coordenadas y la direccion formal con Nominatim, ademas se calcula la distancia.
// Hacemos la funcion pre porque queremos editar el schema antes de publicarlo en la base de datos.
RegistroSchema.pre('save', async function (next) {

    //--------- Direccion 1 ---------
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
    //-------------------------------

    //--------- Direccion 2 ---------
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
    //-------------------------------
    //--------- Calcular distancia ---------
    this.distancia = distance(dir1.lat, dir1.lon, dir2.lat, dir2.lon, 'K').toFixed(2).toString()

    next();
})

// @desc Funcion de distancia tomada literal de https://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}

module.exports = mongoose.model('Registro', RegistroSchema);