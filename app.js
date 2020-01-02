#!/usr/bin/env node

const Koa = require('koa');

//实例koa
const app = new Koa()

const static = require('koa-static');

//路由插件
const router = require('koa-router')();

const path = require('path');

//接受抛出的query
const query = require('./db')

//处理post 前端传递的参数，ctx.request.body
const bodyparser = require('koa-bodyparser');

//使用 前端参数插件
app.use(bodyparser());

//路由插件
app.use(router.routes());

app.use(router.allowedMethods());

app.use(static(path.join(process.cwd(), './public')))

//查看数据
router.get('/api/userlist', async (ctx) => {
  //分页请求
  let { pagenum=1,limit=2 } = ctx.query;
  let startIndex = (pagenum-1) * limit
  //获取到query 的值
  let data = await query(`select * from userlist  where sex=? limit ${startIndex},${limit} `,['男']);
  //返回到桌面信息
  ctx.body = {
    //成功code 1
    code: 1,
    //数据
    data
  }
})

//添加数据
router.post('/api/add', async (ctx) => {
  let { name, age, phone, sex } = ctx.request.body;
  if (name && age && phone && sex) {
    //查找内容
    let data = await query('select * from userlist where name=?', [name])
    console.log(data)

    if (data.length) {
      //用户名存在
      ctx.body = {
        code: 2,
        msg: '此用户存在'
      }
    } else {
      //错误处理机制
      try {
        await query('insert into userlist (name,age,phone,sex) values (?,?,?,?)', [name, age, phone, sex])
        ctx.body = {
          code: 1,
          msg: "添加成功"
        }
        //返回错误信息
      } catch (e) {
        ctx.body = {
          code: 0,
          msg: e
        }
      }
    }
    //其他情况
  } else {
    ctx.body = {
      code: 2,
      msg: '数据丢失'
    }
  }
  console.log(ctx.request.body);
})

//删除
router.delete('/api/del', async (ctx) => {
  let { id } = ctx.query;
  if (id) {
    //错误处理机制
    try {
      await query('delete from userlist where id=?', [id]);
      ctx.body = {
        code: 1,
        msg: '删除成功'
      }
    } catch (e) {
      ctx.body = {
        code: 0,
        msg: e
      }
    }
    //其他情况
  } else {
    ctx.body = {
      code: 2,
      msg: '数据丢失'
    }
  }
})

//更新
router.put('/api/update', async (ctx) => {
  let { name, age, phone, sex ,id} = ctx.request.body
  if (name && age && phone && sex) {
    try {
      await query('update userlist set name=?,age=?,phone=?,sex=? where id = ? ', [name, age, phone, sex,id])
      ctx.body={
        code:1,
        msg:"更新成功"
      }
    } catch (e) {
      ctx.body = {
        code: 0,
        msg: e
      }
    }
  } else {
    ctx.body = {
      code: 2,
      msg: '数据丢失'
    }
  }

})

app.listen(3000, () => {
  console.log("服务成功!")
})