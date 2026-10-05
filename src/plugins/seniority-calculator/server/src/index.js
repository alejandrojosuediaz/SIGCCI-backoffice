'use strict';

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: 'duration',
      plugin: 'seniority-calculator',
      type: 'string',
    });
  },

  async bootstrap({ strapi }) {
    const { calculateDuration, MODES } = await import(
      '../../shared/calculate-duration.mjs'
    );

    strapi.db.lifecycles.subscribe({
      async beforeCreate(event) {
        updateCalculatedFields(strapi, event, calculateDuration, MODES);
      },
      async beforeUpdate(event) {
        updateCalculatedFields(strapi, event, calculateDuration, MODES);
      },
    });
  },
};

function updateCalculatedFields(strapi, event, calculateDuration, MODES) {
  const uid = event.model?.uid;
  const data = event.params?.data;

  if (!uid || !data || typeof data !== 'object') {
    return;
  }

  const attributes = strapi.getModel(uid)?.attributes || {};

  Object.entries(attributes).forEach(([field, attribute]) => {
    if (attribute.customField !== 'plugin::seniority-calculator.duration') {
      return;
    }

    const { sourceField, mode = 'years' } = attribute.options || {};
    const sourceAttribute = attributes[sourceField];

    if (
      !sourceField ||
      !MODES.has(mode) ||
      !['date', 'datetime'].includes(sourceAttribute?.type)
    ) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(data, sourceField)) {
      data[field] = calculateDuration(data[sourceField], mode);
    }
  });
}
