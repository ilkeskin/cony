const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
  name: {
    type: String,
  },
  sex: {
    type: String,
    enum: ['0,1', '1,0']
  },
  race: {
    type: String
  },
  color: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  dateOfDeath: {
    type: Date
  },
  dateOfSlaughter: {
    type: Date
  },
  // TODO: Schema for weight, maybe use postgres/graphite, time series data -> weight: {},
  father: {
    type: Schema.Types.ObjectId,
    ref: "animal"
  },
  mother: {
    type: Schema.Types.ObjectId,
    ref: "animal"
  },
  tattoo: {
    right: {
      type: String
    },
    left: {
      type: String
    }
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Animal = mongoose.model("animal", AnimalSchema);