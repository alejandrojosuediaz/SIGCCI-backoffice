'use strict';

module.exports = ({ strapi }) => ({
  async getConfig(ctx) {
    const { uid } = ctx.params;

    if (!uid) {
      return ctx.badRequest('El UID de la colección es requerido.');
    }

    try {
      const config = await strapi
        .plugin('visual-tags-content')
        .service('visual-tags-content')
        .getConfig(uid);

      ctx.body = {
        data: config,
      };
    } catch (error) {
      strapi.log.error(
        '[visual-tags-content] Error obteniendo configuración:',
        error
      );

      return ctx.internalServerError(
        'No fue posible obtener la configuración.'
      );
    }
  },

  async saveConfig(ctx) {
    const { uid } = ctx.params;
    const { tags } = ctx.request.body || {};

    if (!uid) {
      return ctx.badRequest('El UID de la colección es requerido.');
    }

    if (!Array.isArray(tags)) {
      return ctx.badRequest(
        'La propiedad "tags" debe ser un arreglo.'
      );
    }

    try {
      const config = await strapi
        .plugin('visual-tags-content')
        .service('visual-tags-content')
        .saveConfig(uid, tags);

      ctx.body = {
        data: config,
      };
    } catch (error) {
      strapi.log.error(
        '[visual-tags-content] Error guardando configuración:',
        error
      );

      return ctx.internalServerError(
        'No fue posible guardar la configuración.'
      );
    }
  },
});