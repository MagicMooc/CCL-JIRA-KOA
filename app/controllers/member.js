const User = require("../models/users");
const Member = require("../models/member");
const { gen_id } = require("../utils/uuid");

class MemberCtl {
  async addMember(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      organization: { type: "string", required: true },
    });
    const id = gen_id();
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const t = { ...ctx.request.body, id, ownerId };
    const member = await new Member(t).save();
    ctx.body = { member };
  }

  async getMemberlist(ctx) {
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const member = await Member.find({ ownerId });
    ctx.body = member;
  }
}

module.exports = new MemberCtl();
