const User = require("../models/users");
const Project = require("../models/project");
const { gen_id } = require("../utils/uuid");
class ProjectCtl {
  async addProject(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      organization: { type: "string", required: true },
    });
    const id = gen_id();
    const created = new Date().getTime();
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const t = { ...ctx.request.body, id, ownerId, created };
    const project = await new Project(t).save();
    ctx.body = project;
  }

  async getProjectlist(ctx) {
    let obj = {};
    for (let item in ctx.query) {
      if (item === "name") {
        obj[item] = new RegExp(ctx.query[item], "i");
      } else {
        obj[item] = ctx.query[item];
      }
    }
    const u = await User.findById(ctx.state.user._id);
    const ownerId = u.id;
    const project = await Project.find({ ownerId, ...obj });
    ctx.body = project;
  }
  async changeProject(ctx) {
    const { _id } = await Project.findOne({ id: ctx.params.id });
    let project = await Project.findByIdAndUpdate(_id, ctx.request.body, {
      new: true,
    });
    if (!project) {
      ctx.throw(404, "项目不存在");
    }
    ctx.body = project; //返回修改前的值
  }
  async deleteProject(ctx) {
    const { _id } = await Project.findOne({ id: ctx.params.id });
    const project = await Project.findByIdAndRemove(_id);
    if (!project) {
      ctx.throw(404, "项目不存在");
    }
    ctx.body = {
      success: true,
    };
  }
  async getProjectDetail(ctx) {
    const project = await Project.findOne({ id: ctx.params.id });
    if (!project) {
      ctx.throw(404, "项目不存在");
    }
    ctx.body = project;
  }
}

module.exports = new ProjectCtl();
