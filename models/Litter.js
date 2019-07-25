const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const litter = new Schema({
    buck: {
        type: Schema.Types.ObjectId,
        ref: "animal"
    },
    dateOfMating: Date,
    dateOfRemating: Date,
    dateOfKindle: Date,
    litterSize: Number
});

const LitterSchema = new Schema({
    doe: {
        type: Schema.Types.ObjectId,
        ref: "animal"
    },
    litters: [litter]
});

module.exports = Litter = mongoose.model("Litter", LitterSchema);