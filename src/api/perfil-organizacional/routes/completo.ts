/**
 * Complete organizational profile route
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/perfil-organizacional/completo',
      handler: 'api::perfil-organizacional.perfil-organizacional.findComplete',
    },
  ],
};