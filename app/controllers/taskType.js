const User = require("../models/users");
const TaskType = require("../models/taskType");
const { gen_id } = require("../utils/uuid");

class TaskTypeCtl {
  async addTaskType(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
    });
    const id = gen_id();
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const t = { ...ctx.request.body, id, ownerId };
    const taskType = await new TaskType(t).save();
    ctx.body = taskType ;
  }

  async getTaskTypelist(ctx) {
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const taskType = await TaskType.find({ ownerId });
    ctx.body = taskType;
  }
}

module.exports = new TaskTypeCtl();
