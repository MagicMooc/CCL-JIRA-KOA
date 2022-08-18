const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const epicSchema = new Schema({
  __v: { type: Number, select: false },
  id: { type: Number },
  ownerId: { type: Number },
  projectId: { type: Number, require: true },
  start: { type: Number },
  end: { type: Number },
  created: { type: Number },
  name: { type: String, required: true },
});

module.exports = model("Epic", epicSchema);
