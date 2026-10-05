import React from 'react';
import { Field, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { useIntl } from 'react-intl';

export const DateFieldSelect = ({
  contentTypeSchema,
  description,
  disabled,
  error,
  intlLabel,
  name,
  onChange,
  value,
}) => {
  const { formatMessage } = useIntl();
  const label = intlLabel?.id
    ? formatMessage(intlLabel)
    : intlLabel?.defaultMessage || 'Campo fecha de origen';
  const hint = description?.id
    ? formatMessage(description)
    : description?.defaultMessage || description || '';
  const attributes = contentTypeSchema?.attributes || {};
  const dateFields = (Array.isArray(attributes)
    ? attributes.map((attribute) => [attribute.name, attribute])
    : Object.entries(attributes)
  ).filter(
    ([, attribute]) =>
      ['date', 'datetime'].includes(attribute?.type) &&
      attribute.customField !== 'plugin::seniority-calculator.duration'
  );
  const helperText =
    dateFields.length === 0
      ? [hint, 'No hay campos date o datetime en este tipo de contenido.']
          .filter(Boolean)
          .join(' ')
      : hint;

  return (
    <Field.Root error={error} hint={helperText}>
      <Field.Label>{label}</Field.Label>
      <SingleSelect
        name={name}
        value={value || undefined}
        placeholder="Seleccionar campo fecha"
        onChange={(nextValue) =>
          onChange({
            target: {
              name,
              value: nextValue,
            },
          })
        }
        disabled={disabled}
        aria-label={label}
      >
        {dateFields.map(([fieldName, attribute]) => (
          <SingleSelectOption key={fieldName} value={fieldName}>
            {fieldName} ({attribute.type})
          </SingleSelectOption>
        ))}
      </SingleSelect>
      <Field.Hint />
      {error && <Field.Error />}
    </Field.Root>
  );
};
