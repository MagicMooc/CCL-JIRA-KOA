const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const path = require("path");
const routing = require("./routes");
const { connectionStr } = require("./config");

const app = new Koa();
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  ctx.set(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  if (ctx.method === "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});
mongoose.connect(connectionStr, { useNewUrlParser: true }, () =>
  console.log("MongoDB 连接成功了！")
);
mongoose.connection.on("error", console.error);
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);
app.use(bodyParser());
app.use(parameter(app));
routing(app);

app.listen(4000, () => console.log("程序启动在 4000 端口了"));
