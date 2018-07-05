'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const cors = require('cors');

const logger = require('./loggers');
const config = require('./config');


const env = process.env.NODE_ENV || 'development';



module.exports = function (app) {

  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512,
  }));

  // Configure corse
  app.use(cors());

  // Static files middleware
  app.use(express.static(config.root + '/public'));

  // Don't log during tests
  // Logging middleware
  if (env !== 'test') {
    app.use(morgan('combined', logger));
  }

  // bodyParser should be above methodOverride
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(methodOverride())

  if (env === 'development') {
    app.locals.pretty = true;
  }
};
