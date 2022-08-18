const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/users");

const { secret } = require("../config");
const { gen_id } = require("../utils/uuid");
class UsersCtl {
  async register(ctx) {
    ctx.verifyParams({
      username: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const { username } = ctx.request.body;
    const repeatedUser = await User.findOne({ username });
    if (repeatedUser) {
      ctx.throw(409, "用户已经占用");
    }
    const id = gen_id();
    const t = { ...ctx.request.body, id: id };
    const u = await new User(t).save();
    const { _id } = u;
    const token = jsonwebtoken.sign({ _id, username }, secret, {
      expiresIn: "1d",
    });
    const user = { id, name: username, token };
    ctx.body = { user };
  }
  async login(ctx) {
    ctx.verifyParams({
      username: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const u = await User.findOne(ctx.request.body);
    if (!u) {
      ctx.throw(401, "用户名或密码不正确");
    }
    const { _id, id, username } = u;
    const token = jsonwebtoken.sign({ _id, username }, secret, {
      expiresIn: "1d",
    });
    const user = { id, name: username, token };
    ctx.body = { user };
  }
  async me(ctx) {
    const m = await User.findById(ctx.state.user._id);
    if (!m) {
      ctx.throw(401, "token失效");
    }
    const { authorization } = ctx.request.header;
    const { id, username } = m;
    const token = authorization.replace("Bearer ", "");
    const user = { id, name: username, token };
    ctx.body = { user };
  }
}

module.exports = new UsersCtl();
