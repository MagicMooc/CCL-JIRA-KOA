const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const taskTypeSchema = new Schema({
  __v: { type: Number, select: false },
  id: { type: Number },
  ownerId: { type: Number },
  name: { type: String, required: true },
});

module.exports = model("TaskType", taskTypeSchema);
