'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/config/:uid',
    handler: 'visual-tags-content.getConfig',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/config/:uid',
    handler: 'visual-tags-content.saveConfig',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];
