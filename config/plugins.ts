import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        accessTokenLifespan: 600,
        maxRefreshTokenLifespan: 2592000,
        idleRefreshTokenLifespan: 1209600,
        maxSessionLifespan: 86400,
        idleSessionLifespan: 7200,
        httpOnly: false,
        cookie: {
          name: 'strapi_up_refresh',
          sameSite: 'lax',
          path: '/',
          secure: false, // fuerza no-secure aunque NODE_ENV sea production
        },
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
  'visual-tags-content': {
    enabled: true,
    resolve: './src/plugins/visual-tags-content',
  },
  'seniority-calculator': {
    enabled: true,
    resolve: './src/plugins/seniority-calculator',
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'NOTE Soporte <soporte.notehn@gmail.com>',
        defaultReplyTo: 'NOTE Soporte <soporte.notehn@gmail.com>',
      },
    },
  },
  "audit-logs": {
    enabled: true,
    resolve: './src/plugins/audit-logs',
    config: {
      enabled: true,
      deletion: {
        enabled: true,
        frequency: "logAge", // 'logAge' or 'logCount'
        options: {
          value: 7, // Keep logs for 7 years
          interval: "year", // 'day', 'week', 'month', 'year'
        },
      },
      excludeContentTypes: [
        //"plugin::any-custom-type.any-custom-type",
      ],
      excludeEndpoints: [
        "/admin/renew-token",
        "/api/upload",
        // "/api/any-custom-type/any-custom-route",
      ],
      redactedValues: [
        "password",
        "token",
        "jwt",
        "authorization",
        "secret",
        "key",
        "private",
      ],
      events: {
        track: [
          "entry.create",
          "entry.update",
          "entry.delete",
          "entry.publish",
          "entry.unpublish",
          "media.create",
          "media.update",
          "media.delete",
          "media-folder.create",
          "media-folder.update",
          "media-folder.delete",
          "user.create",
          "user.update",
          "user.delete",
          "role.create",
          "role.update",
          "role.delete",
          "admin.auth.success",
          "admin.auth.failure",
          "admin.logout",
        ],
      },
      adminPanel: {
        indexTableColumns: [
          "action",
          "date",
          "user",
          "method",
          "status",
          "ipAddress",
          "entry",
        ],
      },
    },
  },
});

export default config;
