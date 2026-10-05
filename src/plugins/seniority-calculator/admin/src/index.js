import { Calendar } from '@strapi/icons';
import { DateFieldSelect } from './components/DateFieldSelect';

export default {
  register(app) {
    const contentTypeBuilder = app.getPlugin('content-type-builder');

    const components = contentTypeBuilder?.apis?.forms?.components;

    if (typeof components?.add !== 'function') {
      throw new Error(
        '[seniority-calculator] Content-Type Builder forms API is unavailable.'
      );
    }

    components.add({
      id: 'seniority-date-field-select',
      component: DateFieldSelect,
    });

    app.customFields.register({
      name: 'duration',
      pluginId: 'seniority-calculator',
      type: 'string',
      intlLabel: {
        id: 'seniority-calculator.duration.label',
        defaultMessage: 'Antigüedad calculada',
      },
      intlDescription: {
        id: 'seniority-calculator.duration.description',
        defaultMessage: 'Calcula edad o antigüedad a partir de un campo de fecha.',
      },
      icon: Calendar,
      components: {
        Input: async () => import('./components/DurationInput').then((module) => ({
          default: module.default,
        })),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'seniority-calculator.duration.options.section',
              defaultMessage: 'Configuración del cálculo',
            },
            items: [
              {
                name: 'options.sourceField',
                type: 'seniority-date-field-select',
                intlLabel: {
                  id: 'seniority-calculator.duration.options.sourceField',
                  defaultMessage: 'Campo fecha de origen',
                },
                description: {
                  id: 'seniority-calculator.duration.options.sourceField.description',
                  defaultMessage: 'Selecciona una fecha del mismo tipo de contenido.',
                },
              },
              {
                name: 'options.mode',
                type: 'select',
                value: 'years',
                intlLabel: {
                  id: 'seniority-calculator.duration.options.mode',
                  defaultMessage: 'Formato del resultado',
                },
                options: [
                  {
                    key: 'years',
                    defaultValue: 'years',
                    value: 'years',
                    metadatas: {
                      intlLabel: {
                        id: 'seniority-calculator.duration.options.mode.years',
                        defaultMessage: 'Años cumplidos',
                      },
                    },
                  },
                  {
                    key: 'breakdown',
                    value: 'breakdown',
                    metadatas: {
                      intlLabel: {
                        id: 'seniority-calculator.duration.options.mode.breakdown',
                        defaultMessage: 'Años, meses y días',
                      },
                    },
                  },
                  {
                    key: 'totalDays',
                    value: 'totalDays',
                    metadatas: {
                      intlLabel: {
                        id: 'seniority-calculator.duration.options.mode.totalDays',
                        defaultMessage: 'Días totales',
                      },
                    },
                  },
                  {
                    key: 'decimalYears',
                    value: 'decimalYears',
                    metadatas: {
                      intlLabel: {
                        id: 'seniority-calculator.duration.options.mode.decimalYears',
                        defaultMessage: 'Años decimales (2 decimales)',
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  },
};
