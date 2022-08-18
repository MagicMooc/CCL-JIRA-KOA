const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const projectSchema = new Schema({
  __v: { type: Number, select: false },
  id: { type: Number },
  ownerId: { type: Number },
  created: { type: Number },
  personId: { type: Number },
  name: { type: String, required: true },
  pin: { type: Boolean, default: false },
  organization: { type: String, required: true },
});

module.exports = model("Project", projectSchema);
