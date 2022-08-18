const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const memberSchema = new Schema({
  __v: { type: Number, select: false },
  id: { type: Number },
  ownerId: { type: Number },
  name: { type: String, required: true },
  organization: { type: String, required: true},
});

module.exports = model("Member", memberSchema);
