// models/Counter.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Esquema para el contador atómico.
 * Almacenará un documento por cada secuencia que necesites.
 * Por ejemplo: { _id: 'practiceId', seq: 10 }
 */
const CounterSchema = new Schema({
  _id: { type: String, required: true }, // El nombre de la secuencia (ej: 'practiceId')
  seq: { type: Number, default: 0 }    // El valor actual de la secuencia
});

module.exports = mongoose.model('Counter', CounterSchema);