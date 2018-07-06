'use strict';
module.exports = function (app) {
  const express = require('express');
  const { asyncErrorWrapper } = require('../utils')

  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  apiRouter.get('/hello', asyncErrorWrapper(async function(req, res) {
    res.send('Hello World');
  }));

  const authenticationRouter = require('./authentications');
  apiRouter.use('/authentications', authenticationRouter)

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