import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
    sessions: {
      accessTokenLifespan: 1800, // 30 minutos (podés aumentarlo)
      maxRefreshTokenLifespan: 2592000, // 30 días
      idleRefreshTokenLifespan: 604800, // 7 días
      maxSessionLifespan: 604800, // 7 días
      idleSessionLifespan: 3600, // 1 hora
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
    docLinks: env.bool('FLAG_DOC_LINKS', false),
  },
});

export default config;