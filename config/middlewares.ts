import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  // 'strapi::session',
  {
    name: 'strapi::session',
    config: {
      secure: false, // evita exigir HTTPS
    },
  },
  'strapi::favicon',
  'strapi::public',
];

export default config;
