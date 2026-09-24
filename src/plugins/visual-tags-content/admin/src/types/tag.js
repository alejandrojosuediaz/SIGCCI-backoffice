export const TAG_COLORS = {
  mustard: {
    name: 'Amarillo mostaza',
    value: '#D4A017',
    soft: '#FEF3C7',
    text: '#7A5A00',
  },

  'dark-green': {
    name: 'Verde oscuro',
    value: '#166534',
    soft: '#DCFCE7',
    text: '#14532D',
  },

  'electric-blue': {
    name: 'Azul eléctrico',
    value: '#2563EB',
    soft: '#DBEAFE',
    text: '#1D4ED8',
  },

  'light-blue': {
    name: 'Azul claro',
    value: '#3B82F6',
    soft: '#E0F2FE',
    text: '#1D4ED8',
  },

  red: {
    name: 'Rojo',
    value: '#DC2626',
    soft: '#FEE2E2',
    text: '#991B1B',
  },
};

export const DEFAULT_TAG = {
  text: '',
  color: 'mustard',
  logic: 'AND',
  conditions: [
    {
      field: '',
      operator: '=',
      value: '',
      valueType: 'fixed',
    },
  ],
};
