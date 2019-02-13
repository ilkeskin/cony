const mongoose = require("mongoose");
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const WeightSchema = new Schema({
  animal: {
    type: Schema.Types.ObjectId,
    ref: "animal"
  },
  timestamp_month: {
    type: Date
  },
  days: [SchemaTypes.Double]
});

module.exports = Weight = mongoose.model("weight", WeightSchema);