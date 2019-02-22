const mongoose = require("mongoose");
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const day = new Schema({
    index: Number,
    weight: SchemaTypes.Double
})

const WeightSchema = new Schema({
    animal: {
        type: Schema.Types.ObjectId,
        ref: "animal"
    },
    timestamp_month: Date,
    days: [day]
});

module.exports = Weight = mongoose.model("weight", WeightSchema);