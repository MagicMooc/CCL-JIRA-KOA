const User = require("../models/users");
const Task = require("../models/task");
const { gen_id } = require("../utils/uuid");

class TaskCtl {
  async addTask(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      projectId: { type: "number", required: true },
      kanbanId: { type: "number", required: true },
    });
    const id = gen_id();
    const created = new Date().getTime();
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const l = await Task.find({ ownerId });
    const tPriority = l.length + 1;
    const t = { ...ctx.request.body, id, ownerId, created, tPriority };
    const task = await new Task(t).save();
    ctx.body = task;
  }

  async getTasklist(ctx) {
    let obj = {};
    for (let item in ctx.query) {
      if (ctx.query[item] !== "") {
        if (item === "name") {
          obj[item] = new RegExp(ctx.query[item], "i");
        } else {
          obj[item] = ctx.query[item];
        }
      }
    }
    const u = await User.findById(ctx.state.user._id).sort("tPriority");
    const ownerId = u.id;
    const task = await Task.find({ ownerId, ...obj });
    ctx.body = task;
  }
  async getTaskDetail(ctx) {
    const task = await Task.findOne({ id: ctx.params.id });
    if (!task) {
      ctx.throw(404, "任务不存在");
    }
    ctx.body = task;
  }
  async changeTask(ctx) {
    const { _id } = await Task.findOne({ id: ctx.params.id });
    let task = await Task.findByIdAndUpdate(_id, ctx.request.body, {
      new: true,
    });
    if (!task) {
      ctx.throw(404, "任务不存在");
    }
    ctx.body = task; //返回修改前的值
  }
  async deleteTask(ctx) {
    const { _id, tPriority } = await Task.findOne({ id: ctx.params.id });

    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const l = await Task.find({ ownerId });
    const len = l.length;
    for (let t = tPriority + 1; t <= len; t++) {
      const { _id, tPriority: tp } = await Task.findOne({
        ownerId,
        tPriority: t,
      });
      await Task.findByIdAndUpdate(_id, { tPriority: tp - 1 });
    }

    const task = await Task.findByIdAndRemove(_id);
    if (!task) {
      ctx.throw(404, "任务不存在");
    }
    ctx.body = {
      success: true,
    };
  }
  async reorder(ctx) {
    const { fromId, referenceId, fromKanbanId, toKanbanId, type } =
      ctx.request.body;
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const { _id: f_id, tPriority: f_tp } = await Task.findOne({
      ownerId,
      id: fromId,
    });

    if (fromKanbanId !== toKanbanId) {
      const fl = await Task.find({ ownerId, kanbanId: fromKanbanId });
      const tl = await Task.find({ ownerId, kanbanId: toKanbanId });
      const flen = fl.length;
      const tlen = tl.length;
      for (let i = f_tp + 1; i <= flen; i++) {
        const { _id, tPriority: tp } = await Task.findOne({
          ownerId,
          kanbanId: fromKanbanId,
          tPriority: i,
        });
        await Task.findByIdAndUpdate(_id, { tPriority: tp - 1 });
      }
      if (referenceId === undefined) {
        await Task.findByIdAndUpdate(f_id, {
          tPriority: tlen + 1,
          kanbanId: toKanbanId,
        });
      } else {
        const { _id: t_id, tPriority: t_tp } = await Task.findOne({
          ownerId,
          id: referenceId,
        });
        if (type === "before") {
          for (let i = tlen; i >= t_tp; i--) {
            const { _id, tPriority: tp } = await Task.findOne({
              ownerId,
              kanbanId: toKanbanId,
              tPriority: i,
            });
            await Task.findByIdAndUpdate(_id, { tPriority: tp + 1 });
          }
          await Task.findByIdAndUpdate(f_id, {
            tPriority: t_tp,
            kanbanId: toKanbanId,
          });
        } else if (type === "after") {
          for (let i = tlen; i >= t_tp + 1; i--) {
            const { _id, tPriority: tp } = await Task.findOne({
              ownerId,
              kanbanId: toKanbanId,
              tPriority: i,
            });
            await Task.findByIdAndUpdate(_id, { tPriority: tp + 1 });
          }
          await Task.findByIdAndUpdate(f_id, {
            tPriority: t_tp + 1,
            kanbanId: toKanbanId,
          });
        }
      }
    } else {
      const fl = await Task.find({ ownerId, kanbanId: fromKanbanId });
      const flen = fl.length;
      await Task.findByIdAndUpdate(f_id, {
        tPriority: -1,
      });
      for (let i = f_tp + 1; i <= flen; i++) {
        const { _id, tPriority: tp } = await Task.findOne({
          ownerId,
          kanbanId: fromKanbanId,
          tPriority: i,
        });
        await Task.findByIdAndUpdate(_id, { tPriority: tp - 1 });
      }

      if (referenceId === undefined) {
        await Task.findByIdAndUpdate(f_id, {
          tPriority: flen,
        });
      } else {
        const { _id: t_id, tPriority: t_tp } = await Task.findOne({
          ownerId,
          id: referenceId,
        });
        if (type === "before") {
          for (let i = flen - 1; i >= t_tp; i--) {
            const { _id, tPriority: tp } = await Task.findOne({
              ownerId,
              kanbanId: toKanbanId,
              tPriority: i,
            });
            await Task.findByIdAndUpdate(_id, { tPriority: tp + 1 });
          }
          await Task.findByIdAndUpdate(f_id, {
            tPriority: t_tp,
          });
        } else if (type === "after") {
          for (let i = flen - 1; i >= t_tp + 1; i--) {
            const { _id, tPriority: tp } = await Task.findOne({
              ownerId,
              kanbanId: toKanbanId,
              tPriority: i,
            });
            await Task.findByIdAndUpdate(_id, { tPriority: tp + 1 });
          }
          await Task.findByIdAndUpdate(f_id, {
            tPriority: t_tp + 1,
          });
        }
      }
    }
    ctx.body = {};
  }
}

module.exports = new TaskCtl();
