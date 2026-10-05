import React, { useEffect } from 'react';
import { useForm } from '@strapi/strapi/admin';
import { Field, TextInput } from '@strapi/design-system';
import { calculateDuration } from '../../../shared/calculate-duration.mjs';

const getValueAtPath = (values, path) =>
  path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), values);

const DurationInput = ({ name, value, onChange, disabled, label, hint, error, attribute }) => {
  const values = useForm('SeniorityCalculatorDurationInput', (state) => state.values);
  const { sourceField, mode = 'years' } = attribute?.options || {};
  const mapping = sourceField ? { sourceField, mode } : null;

  const sourceDate = mapping ? getValueAtPath(values, mapping.sourceField) : undefined;
  const hasSourceValue =
    mapping && Object.prototype.hasOwnProperty.call(values, mapping.sourceField);
  const calculatedValue = hasSourceValue
    ? calculateDuration(sourceDate, mapping.mode)
    : value || '';

  useEffect(() => {
    if (!mapping || !hasSourceValue) {
      return;
    }

    const nextValue = calculateDuration(sourceDate, mapping.mode);
    const currentValue = value == null ? '' : String(value);

    if (currentValue !== nextValue) {
      onChange(name, nextValue);
    }
  }, [mapping, hasSourceValue, sourceDate, value, onChange, name]);

  return (
    <Field.Root error={error}>
      <Field.Label htmlFor={name}>{label || 'Antigüedad calculada'}</Field.Label>
      <TextInput
        id={name}
        name={name}
        value={calculatedValue}
        readOnly
        disabled={disabled}
      />
      <Field.Hint>
        {mapping
          ? hint
          : 'Selecciona el campo fecha de origen en la configuración de este campo.'}
      </Field.Hint>
      {error && <Field.Error />}
    </Field.Root>
  );
};

export default DurationInput;
