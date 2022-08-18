const User = require("../models/users");
const Epic = require("../models/epic");
const { gen_id } = require("../utils/uuid");
class EpicCtl {
  async addEpic(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      projectId: { type: "number", required: true },
    });
    const id = gen_id();
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const created = new Date().getTime();
    const t = { ...ctx.request.body, id, ownerId, created };
    const epic = await new Epic(t).save();
    ctx.body = epic;
  }

  async getEpiclist(ctx) {
    let obj = {};
    for (let item in ctx.query) {
      if (ctx.query[item] !== "") {
        obj[item] = ctx.query[item];
      }
    }
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const epic = await Epic.find({ ownerId, ...obj });
    ctx.body = epic;
  }

  async deleteEpic(ctx) {
    const { _id } = await Epic.findOne({ id: ctx.params.id });

    const epic = await Epic.findByIdAndRemove(_id);
    if (!epic) {
      ctx.throw(404, "任务组不存在");
    }
    ctx.body = {
      success: true,
    };
  }
}

module.exports = new EpicCtl();
