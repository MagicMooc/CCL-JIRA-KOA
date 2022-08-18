const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const kanbanSchema = new Schema({
  __v: { type: Number, select: false },
  id: { type: Number },
  ownerId: { type: Number },
  created: { type: Number },
  projectId: { type: Number, require: true },
  name: { type: String, required: true },
  kPriority: { type: Number },
});

module.exports = model("Kanban", kanbanSchema);
