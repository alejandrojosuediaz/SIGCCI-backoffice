'use strict';

const adminRoutes = require('./admin');
const contentApi = require('./content-api');

module.exports = {
  admin: {
    type: 'admin',
    routes: adminRoutes,
  },
  'content-api': {
    type: 'content-api',
    routes: contentApi,
  },
};