const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  __v: { type: Number, select: false },
  id: { type: Number },
  kanbanId: { type: Number },
  epicId: { type: Number },
  ownerId: { type: Number },
  processorId: { type: Number },
  projectId: { type: Number },
  reporterId: { type: Number },
  typeId: { type: Number, default: 11 },
  created: { type: Number },
  name: { type: String, required: true },
  tPriority: {type: Number}
});

module.exports = model("Task", taskSchema);
