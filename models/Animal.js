const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    name: String,
    sex: {
        type: String,
        enum: ["0,1", "1,0"]
    },
    race: String,
    color: String,
    dateOfBirth: Date,
    dateOfDeath: Date,
    dateOfSlaughter: Date,
    father: {
        type: Schema.Types.ObjectId,
        ref: "animal"
    },
    mother: {
        type: Schema.Types.ObjectId,
        ref: "animal"
    },
    tattoo: {
        right: String,
        left: Number
    },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = Animal = mongoose.model("animal", AnimalSchema);