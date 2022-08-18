function gen_id() {
  let date = new Date().valueOf(); //获取时间戳
  let txt = "73"; //生成的随机机器码
  let len = 5; //机器码有多少位
  let pwd = ""; //定义空变量用来接收机器码
  for (let i = 0; i < len; i++) {
    pwd += txt.charAt(Math.floor(Math.random() * txt.length)).slice(2, 7); //循环机器码位数随机填充
  }
  const uuid = Number.parseInt((date + pwd).slice(-13, -1));
  return uuid;
}
module.exports = {
  gen_id,
};
