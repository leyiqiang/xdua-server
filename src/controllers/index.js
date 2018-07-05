'use strict';
module.exports = function (app) {
  const express = require('express');

  const apiRouter = express.Router();
  app.use('/api', apiRouter);
  const asyncErrorWrapper = function (fn) {
    return (req, res, next) => {
      fn(req, res, next)
        .catch(e => {
          next(e)
        })
    }
  }

  async function test() {
    return new Promise(function(resolve, reject) {
      setTimeout(reject, 100, new Error('foo'));
    });
  }

  apiRouter.get('/hi', async function(req, res) {
    await test()
    res.send('Hello World');
  });

  apiRouter.get('/hello', asyncErrorWrapper(async function(req, res) {
    await test()
    res.send('Hello World');
  }));
  const usersRouter = require('./users');
  apiRouter.use('/users', usersRouter)

  // const formsRouter = require('./forms');
  // apiRouter.use('/forms', formsRouter);
  //
  // const orders = require('./orders');
  // apiRouter.use('/orders', orders);
  //
  // const drivers = require('./drivers');
  // apiRouter.use('/drivers', drivers);
  //
  // Private routes
  // const admin_drivers = require('./admin/drivers');
  // const admin_orders = require('./admin/orders')
  // const admin_students = require('./admin/students')
  // apiRouter.use('/admin/drivers', admin_drivers)
  // apiRouter.use('/admin/orders', admin_orders)
  // apiRouter.use('/admin/students', admin_students)
  //


};