'use strict';

module.exports = ({ strapi }) => ({
  async getConfig(uid) {
    const result = await strapi.db
      .query('plugin::visual-tags-content.config')
      .findOne({
        where: {
          uid,
        },
      });

    if (!result) {
      return {
        uid,
        tags: [],
      };
    }

    return {
      uid: result.uid,
      tags: result.tags || [],
    };
  },

  async saveConfig(uid, tags) {
    const existing = await strapi.db
      .query('plugin::visual-tags-content.config')
      .findOne({
        where: {
          uid,
        },
      });

    if (existing) {
      const updated = await strapi.db
        .query('plugin::visual-tags-content.config')
        .update({
          where: {
            id: existing.id,
          },
          data: {
            tags,
          },
        });

      return {
        uid: updated.uid,
        tags: updated.tags || [],
      };
    }

    const created = await strapi.db
      .query('plugin::visual-tags-content.config')
      .create({
        data: {
          uid,
          tags,
        },
      });

    return {
      uid: created.uid,
      tags: created.tags || [],
    };
  },
});