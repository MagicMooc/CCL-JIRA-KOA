const User = require("../models/users");
const Kanban = require("../models/kanban");
const { gen_id } = require("../utils/uuid");
class KanbanCtl {
  async addKanban(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      projectId: { type: "number", required: true },
    });
    const id = gen_id();
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const l = await Kanban.find({ ownerId });
    const kPriority = l.length + 1;
    const t = { ...ctx.request.body, id, ownerId, kPriority };
    const kanban = await new Kanban(t).save();
    ctx.body = kanban;
  }

  async getKanbanlist(ctx) {
    let obj = {};
    for (let item in ctx.query) {
      if (ctx.query[item] !== "") {
        obj[item] = ctx.query[item];
      }
    }
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const kanban = await Kanban.find({ ownerId, ...obj }).sort("kPriority");
    ctx.body = kanban;
  }

  async deleteKanban(ctx) {
    const { _id, kPriority } = await Kanban.findOne({ id: ctx.params.id });
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const l = await Kanban.find({ ownerId });
    const len = l.length;
    for (let k = kPriority + 1; k <= len; k++) {
      const { _id, kPriority: kp } = await Kanban.findOne({
        ownerId,
        kPriority: k,
      });
      await Kanban.findByIdAndUpdate(_id, { kPriority: kp - 1 });
    }

    const kanban = await Kanban.findByIdAndRemove(_id);
    if (!kanban) {
      ctx.throw(404, "看板不存在");
    }
    ctx.body = {
      success: true,
    };
  }

  async reorder(ctx) {
    const { fromId, referenceId, type } = ctx.request.body;
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const l = await Kanban.find({ ownerId });
    const { kPriority: fp, _id: f_id } = await Kanban.findOne({
      ownerId,
      id: fromId,
    });

    await Kanban.findByIdAndUpdate(f_id, { kPriority: -1 });
    const len = l.length;
    for (let i = fp + 1; i <= len; i++) {
      const { _id, kPriority: kp } = await Kanban.findOne({
        ownerId,
        kPriority: i,
      });
      await Kanban.findByIdAndUpdate(_id, { kPriority: kp - 1 });
    }

    const { kPriority: rp } = await Kanban.findOne({
      ownerId,
      id: referenceId,
    });
    const temp = rp;

    if (type === "before") {
      for (let i = len - 1; i >= rp; i--) {
        const {
          _id,
          kPriority: kp,
        } = await Kanban.findOne({
          ownerId,
          kPriority: i,
        });
        await Kanban.findByIdAndUpdate(_id, { kPriority: kp + 1 });
      }
      await Kanban.findByIdAndUpdate(f_id, { kPriority: temp });
    } else if (type === "after") {
      for (let i = len - 1; i >= rp + 1; i--) {
        const { _id, kPriority: kp } = await Kanban.findOne({
          ownerId,
          kPriority: i,
        });
        await Kanban.findByIdAndUpdate(_id, { kPriority: kp + 1 });
      }
      await Kanban.findByIdAndUpdate(f_id, { kPriority: temp + 1 });
    }

    ctx.body = {};
  }
}

module.exports = new KanbanCtl();
