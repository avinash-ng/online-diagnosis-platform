const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const diagnosticCenterSchema = new Schema({
  name: String,
  tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
  technician: String,
  phone: String,
  street: String,
  landmark: String,
  state: String,
  country: String,
  location: {
    type: {
      type: String,
      required: true,
      enum: ["Point"]
    },
    coordinates: {
      required: true,
      type: [Number]
    }
  }
});

diagnosticCenterSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("DiagnosticCenter", diagnosticCenterSchema);
