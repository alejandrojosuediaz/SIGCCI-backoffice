'use strict';

const schema = require('./content-types/schema.json');
const controller = require('./controllers/visual-tags-content');
const service = require('./services/visual-tags-content');
const routes = require('./routes');

module.exports = {
  register() {},

  bootstrap() {},

  contentTypes: {
    config: {
      schema,
    },
  },

  controllers: {
    'visual-tags-content': controller,
  },

  services: {
    'visual-tags-content': service,
  },

  routes,
};