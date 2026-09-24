import React, { useEffect, useMemo, useState } from 'react';
import { getFetchClient, useNotification } from '@strapi/strapi/admin';
import { ArrowLeft, Plus, Search, Trash } from '@strapi/icons';
import { TAG_COLORS } from '../types/tag';

const appStyles = `
  .visual-tags-shell {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding: 24px;
    color: #32324d;
    background: #f6f6f9;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .visual-tags-shell * {
    box-sizing: border-box;
  }

  .visual-tags-panel {
    width: min(1200px, 100%);
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #dcdfe4;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 0 rgba(16, 24, 40, 0.02);
  }

  .visual-tags-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #eaeaea;
    background: #f6f6f9;
  }

  .visual-tags-header h1 {
    margin: 8px 0 0;
    font-size: clamp(1.7rem, 2vw, 2.2rem);
    line-height: 1.2;
    color: #32324d;
  }

  .visual-tags-eyebrow {
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666687;
    font-weight: 700;
  }

  .visual-tags-layout {
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr);
    min-height: 620px;
  }

  .visual-tags-sidebar {
    background: #fafafb;
    border-right: 1px solid #eaeaea;
  }

  .visual-tags-sidebar-header {
    padding: 20px 16px 12px;
  }

  .visual-tags-sidebar-header h2 {
    margin: 0;
    font-size: 1rem;
    color: #32324d;
  }

  .visual-tags-search {
    padding: 0 16px 14px;
  }

  .visual-tags-search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    border: 1px solid #dcdfe4;
    background: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    color: #666687;
  }

  .visual-tags-search-box input {
    border: none;
    background: transparent;
    width: 100%;
    color: #32324d;
    font-size: 0.9rem;
    outline: none;
  }

  .visual-tags-collection-list {
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 68vh;
    overflow: auto;
  }

  .visual-tags-collection-card {
    border: 1px solid #eaeaea;
    border-radius: 10px;
    background: #fff;
    padding: 16px 14px;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }

  .visual-tags-collection-card.is-selected {
    border-color: #4945ff;
    background: #eef0ff;
  }

  .visual-tags-collection-card:hover {
    border-color: #c0c4ff;
  }

  .visual-tags-collection-card .uid {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    line-height: 1.4;
    color: #666687;
  }

  .visual-tags-collection-card .name {
    display: block;
    margin-bottom: 12px;
    font-weight: 600;
    color: #32324d;
    line-height: 1.4;
    word-break: break-word;
  }

  .visual-tags-main {
    background: #fff;
    padding: 28px 28px 32px;
  }

  .visual-tags-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: 48px 24px;
  }

  .visual-tags-empty-box {
    max-width: 420px;
  }

  .visual-tags-empty-box .emoji {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .visual-tags-empty-box h3 {
    margin: 0 0 8px;
    color: #32324d;
  }

  .visual-tags-empty-box p {
    margin: 0;
    color: #666687;
    line-height: 1.6;
  }

  .visual-tags-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }

  .visual-tags-toolbar h2 {
    margin: 0;
    color: #32324d;
    font-size: clamp(1.4rem, 2vw, 2rem);
    line-height: 1.3;
  }

  .visual-tags-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .visual-tags-meta {
    margin-bottom: 20px;
    color: #666687;
    font-size: 13px;
    word-break: break-all;
  }

  .visual-tags-meta strong {
    color: #32324d;
  }

  .visual-tags-fields {
    padding: 16px;
    margin-bottom: 20px;
    border: 1px solid #eaeaea;
    border-radius: 12px;
    background: #f6f6f9;
  }

  .visual-tags-fields h3 {
    margin: 0 0 12px;
    color: #32324d;
    font-size: 1rem;
  }

  .visual-tags-field-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .visual-tags-field-pill {
    display: inline-flex;
    align-items: center;
    border: 1px solid #eaeaea;
    border-radius: 999px;
    background: #fff;
    padding: 6px 10px;
    color: #32324d;
    font-size: 12px;
    line-height: 1.3;
  }

  .visual-tags-field-pill span {
    color: #666687;
    margin-left: 6px;
  }

  .visual-tags-headline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .visual-tags-headline h3 {
    margin: 0;
    color: #32324d;
    font-size: 1.1rem;
  }

  .visual-tags-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .visual-tags-tag-card {
    padding: 20px;
    border: 1px solid #eaeaea;
    border-radius: 12px;
    background: #fafafb;
  }

  .visual-tags-tag-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
  }

  .visual-tags-tag-label {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex-wrap: wrap;
  }

  .visual-tags-tag-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .visual-tags-tag-index {
    color: #666687;
    font-size: 13px;
  }

  .visual-tags-section {
    margin-bottom: 20px;
  }

  .visual-tags-section:last-child {
    margin-bottom: 0;
  }

  .visual-tags-label {
    display: block;
    margin-bottom: 6px;
    color: #32324d;
    font-size: 13px;
    font-weight: 600;
  }

  .visual-tags-input,
  .visual-tags-select {
    display: block;
    width: 100%;
    border: 1px solid #dcdfe4;
    border-radius: 8px;
    background: #fff;
    color: #32324d;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px 12px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .visual-tags-input:focus,
  .visual-tags-select:focus {
    border-color: #4945ff;
    box-shadow: 0 0 0 3px rgba(73, 69, 255, 0.15);
  }

  .visual-tags-condition-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .visual-tags-condition {
    border: 1px solid #eaeaea;
    border-radius: 10px;
    background: #fff;
    padding: 16px;
  }

  .visual-tags-condition-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  }

  .visual-tags-condition-head strong {
    color: #32324d;
  }

  .visual-tags-condition-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .visual-tags-empty-operator {
    margin-top: 8px;
    color: #666687;
    font-size: 13px;
  }

  .visual-tags-presenter {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #eaeaea;
  }

  .visual-tags-presenter h4 {
    margin: 0 0 16px;
    color: #32324d;
  }

  .visual-tags-preview {
    margin-top: 16px;
  }

  .visual-tags-preview label {
    display: block;
    margin-bottom: 8px;
    color: #32324d;
    font-weight: 600;
  }

  .visual-tags-button,
  .visual-tags-button-secondary,
  .visual-tags-button-ghost,
  .visual-tags-button-danger,
  .visual-tags-button-text {
    border: 1px solid transparent;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 12px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .visual-tags-button:hover,
  .visual-tags-button-secondary:hover,
  .visual-tags-button-ghost:hover,
  .visual-tags-button-danger:hover,
  .visual-tags-button-text:hover {
    opacity: 0.96;
  }

  .visual-tags-button {
    background: #4945ff;
    border-color: #4945ff;
    color: #fff;
  }

  .visual-tags-button-secondary {
    background: #fff;
    border-color: #dcdfe4;
    color: #32324d;
  }

  .visual-tags-button-ghost {
    background: #fff;
    border-color: #dcdfe4;
    color: #32324d;
  }

  .visual-tags-button-danger {
    background: #fff1f2;
    border-color: #f3d4d4;
    color: #b42318;
  }

  .visual-tags-button-text {
    background: transparent;
    border-color: transparent;
    color: #d92d20;
    padding-left: 0;
    padding-right: 0;
  }

  .visual-tags-button:disabled,
  .visual-tags-button-secondary:disabled,
  .visual-tags-button-ghost:disabled,
  .visual-tags-button-danger:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  @media (max-width: 980px) {
    .visual-tags-shell {
      padding: 16px;
    }

    .visual-tags-layout {
      grid-template-columns: 1fr;
    }

    .visual-tags-sidebar {
      border-right: none;
      border-bottom: 1px solid #eaeaea;
    }

    .visual-tags-collection-list {
      max-height: 36vh;
    }

    .visual-tags-main {
      padding: 20px 16px 24px;
    }

    .visual-tags-condition-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .visual-tags-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .visual-tags-toolbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .visual-tags-actions {
      width: 100%;
    }

    .visual-tags-actions > * {
      flex: 1 1 auto;
    }

    .visual-tags-tag-top {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

const SYSTEM_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  'documentId',
]);

const createStableId = (prefix = 'id') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeTag = (tag = {}) => ({
  id: tag.id || createStableId('tag'),
  text: tag.text || '',
  color: Object.prototype.hasOwnProperty.call(TAG_COLORS, tag.color) ? tag.color : 'mustard',
  logic: tag.logic || 'AND',
  conditions:
    Array.isArray(tag.conditions) && tag.conditions.length
      ? tag.conditions
          .filter((condition) => condition && !SYSTEM_FIELDS.has(condition.field))
          .map((condition, index) => ({
            ...condition,
            id: condition.id || createStableId(`condition-${index}`),
          }))
      : [
          {
            id: createStableId('condition'),
            field: '',
            operator: '=',
            value: '',
            valueType: 'fixed',
          },
        ],
});

const getTagTheme = (colorKey) => {
  const safeKey = Object.prototype.hasOwnProperty.call(TAG_COLORS, colorKey) ? colorKey : 'mustard';
  const theme = TAG_COLORS[safeKey] || TAG_COLORS.mustard;

  return {
    backgroundColor: theme.soft || '#F3F4F6',
    color: theme.text || theme.value || '#111827',
    border: `1px solid ${theme.value || '#D1D5DB'}33`,
  };
};

const App = () => {
  const { toggleNotification } = useNotification();
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [rules, setRules] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [collectionQuery, setCollectionQuery] = useState('');

  useEffect(() => {
    const loadContentTypes = async () => {
      try {
        const { get } = getFetchClient();
        const response = await get('/content-manager/content-types');
        const nextContentTypes = response?.data?.data || [];
        setContentTypes(nextContentTypes);
      } catch (error) {
        console.error('[visual-tags-content] Error obteniendo Content-Types:', error);
      }
    };

    loadContentTypes();
  }, []);

  const collectionTypes = useMemo(
    () =>
      contentTypes.filter(
        (contentType) =>
          contentType.kind === 'collectionType' && contentType.uid?.startsWith('api::')
      ),
    [contentTypes]
  );

  const filteredCollectionTypes = useMemo(() => {
    const query = collectionQuery.trim().toLowerCase();

    if (!query) {
      return collectionTypes;
    }

    return collectionTypes.filter((contentType) => {
      const name = (contentType.info?.displayName || '').toLowerCase();
      const uid = (contentType.uid || '').toLowerCase();

      return name.includes(query) || uid.includes(query);
    });
  }, [collectionTypes, collectionQuery]);

  const availableAttributes = useMemo(() => {
    if (!selectedContentType?.attributes) {
      return [];
    }

    return Object.entries(selectedContentType.attributes).filter(
      ([fieldName]) => !SYSTEM_FIELDS.has(fieldName)
    );
  }, [selectedContentType]);

  useEffect(() => {
    if (!selectedContentType && filteredCollectionTypes.length > 0) {
      const firstCollection = filteredCollectionTypes[0];
      setSelectedContentType(firstCollection);
      loadConfigForContentType(firstCollection.uid);
    }
  }, [filteredCollectionTypes, selectedContentType]);

  const getFieldType = (fieldName) => {
    if (!selectedContentType || !fieldName) {
      return null;
    }

    return selectedContentType.attributes?.[fieldName]?.type || null;
  };

  const isNumberField = (fieldType) =>
    ['integer', 'biginteger', 'float', 'decimal', 'number'].includes(fieldType);

  const isTextField = (fieldType) => ['string', 'text'].includes(fieldType);

  const isDateField = (fieldType) => ['datetime', 'date', 'time'].includes(fieldType);

  const getOperatorsForField = (fieldName) => {
    const fieldType = getFieldType(fieldName);

    if (isTextField(fieldType)) {
      return [
        { value: '=', label: '=' },
        { value: '!=', label: '!=' },
        { value: 'contains', label: 'contiene' },
        { value: 'startsWith', label: 'empieza con' },
        { value: 'endsWith', label: 'termina con' },
        { value: 'isEmpty', label: 'está vacío' },
        { value: 'isNotEmpty', label: 'no está vacío' },
      ];
    }

    if (isNumberField(fieldType)) {
      return [
        { value: '=', label: '=' },
        { value: '!=', label: '!=' },
        { value: '>', label: '>' },
        { value: '>=', label: '>=' },
        { value: '<', label: '<' },
        { value: '<=', label: '<=' },
        { value: 'isEmpty', label: 'está vacío' },
        { value: 'isNotEmpty', label: 'no está vacío' },
      ];
    }

    if (isDateField(fieldType)) {
      return [
        { value: '=', label: '=' },
        { value: '!=', label: '!=' },
        { value: '>', label: 'después de' },
        { value: '>=', label: 'después o igual a' },
        { value: '<', label: 'antes de' },
        { value: '<=', label: 'antes o igual a' },
        { value: 'isEmpty', label: 'está vacío' },
        { value: 'isNotEmpty', label: 'no está vacío' },
      ];
    }

    if (fieldType === 'boolean') {
      return [
        { value: '=', label: '=' },
        { value: '!=', label: '!=' },
      ];
    }

    if (fieldType === 'relation') {
      return [
        { value: '=', label: '=' },
        { value: '!=', label: '!=' },
        { value: 'isEmpty', label: 'está vacío' },
        { value: 'isNotEmpty', label: 'no está vacío' },
      ];
    }

    return [
      { value: '=', label: '=' },
      { value: '!=', label: '!=' },
      { value: 'isEmpty', label: 'está vacío' },
      { value: 'isNotEmpty', label: 'no está vacío' },
    ];
  };

  const updateCondition = (ruleIndex, conditionIndex, changes) => {
    const nextRules = [...rules];

    if (!nextRules[ruleIndex]) {
      return;
    }

    const nextConditions = [...(nextRules[ruleIndex].conditions || [])];

    if (!nextConditions[conditionIndex]) {
      return;
    }

    nextConditions[conditionIndex] = {
      ...nextConditions[conditionIndex],
      ...changes,
    };

    nextRules[ruleIndex] = {
      ...nextRules[ruleIndex],
      conditions: nextConditions,
    };

    setRules(nextRules);
  };

  const addTag = () => {
    if (availableAttributes.length === 0) {
      toggleNotification({
        type: 'warning',
        message: 'No hay campos configurables para crear tags en esta colección.',
      });
      return;
    }

    const nextTag = normalizeTag({
      id: createStableId('tag'),
      text: '',
      color: 'mustard',
      logic: 'AND',
      conditions: [
        {
          id: createStableId('condition'),
          field: '',
          operator: '=',
          value: '',
          valueType: 'fixed',
        },
      ],
    });

    setRules((prevRules) => [...prevRules, nextTag]);
    toggleNotification({
      type: 'success',
      message: 'Tag agregado correctamente.',
    });
  };

  const removeTag = (ruleIndex) => {
    setRules((prevRules) => prevRules.filter((_, index) => index !== ruleIndex));
  };

  const addCondition = (ruleIndex) => {
    const nextRules = [...rules];

    if (!nextRules[ruleIndex]) {
      return;
    }

    nextRules[ruleIndex] = {
      ...nextRules[ruleIndex],
      conditions: [
        ...(nextRules[ruleIndex].conditions || []),
        {
          id: createStableId('condition'),
          field: '',
          operator: '=',
          value: '',
          valueType: 'fixed',
        },
      ],
    };

    setRules(nextRules);
  };

  const removeCondition = (ruleIndex, conditionIndex) => {
    const nextRules = [...rules];

    if (!nextRules[ruleIndex]) {
      return;
    }

    const conditions = nextRules[ruleIndex].conditions || [];

    if (conditions.length <= 1) {
      return;
    }

    nextRules[ruleIndex] = {
      ...nextRules[ruleIndex],
      conditions: conditions.filter((_, index) => index !== conditionIndex),
    };

    setRules(nextRules);
  };

  const loadConfigForContentType = async (contentTypeUID) => {
    if (!contentTypeUID) {
      return;
    }

    try {
      const { get } = getFetchClient();
      const response = await get(
        `/visual-tags-content/config/${encodeURIComponent(contentTypeUID)}`
      );

      const config = response?.data?.data || {
        uid: contentTypeUID,
        tags: [],
      };

      const nextTags = Array.isArray(config.tags)
        ? config.tags.map((tag) => normalizeTag(tag))
        : [];

      if (typeof window !== 'undefined') {
        window.visualTagsContentCache = {
          ...(window.visualTagsContentCache || {}),
          [contentTypeUID]: {
            uid: contentTypeUID,
            tags: nextTags,
          },
        };
      }

      setRules(nextTags);
    } catch (error) {
      console.error('[visual-tags-content] Error cargando configuración:', error);
      setRules([]);
    }
  };

  const saveConfigForContentType = async () => {
    if (!selectedContentType?.uid) {
      return;
    }

    setIsSaving(true);

    try {
      const { post } = getFetchClient();
      const response = await post(
        `/visual-tags-content/config/${encodeURIComponent(selectedContentType.uid)}`,
        {
          tags: rules,
        }
      );

      const config = response?.data?.data || {
        uid: selectedContentType.uid,
        tags: rules,
      };

      if (typeof window !== 'undefined') {
        window.visualTagsContentCache = {
          ...(window.visualTagsContentCache || {}),
          [selectedContentType.uid]: {
            uid: selectedContentType.uid,
            tags: Array.isArray(config.tags) ? config.tags : rules,
          },
        };
      }

      setRules(Array.isArray(config.tags) ? config.tags.map((tag) => normalizeTag(tag)) : rules);
      toggleNotification({
        type: 'success',
        message: 'Configuración de tags guardada correctamente.',
      });
    } catch (error) {
      console.error('[visual-tags-content] Error guardando configuración:', error);
      toggleNotification({
        type: 'error',
        message: 'No se pudo guardar la configuración de tags.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetConfigForContentType = async () => {
    if (!selectedContentType?.uid) {
      return;
    }

    setIsSaving(true);

    try {
      const { post } = getFetchClient();
      await post(`/visual-tags-content/config/${encodeURIComponent(selectedContentType.uid)}`, {
        tags: [],
      });

      if (typeof window !== 'undefined') {
        window.visualTagsContentCache = {
          ...(window.visualTagsContentCache || {}),
          [selectedContentType.uid]: {
            uid: selectedContentType.uid,
            tags: [],
          },
        };
      }

      setRules([]);
      toggleNotification({
        type: 'success',
        message: 'Configuración de tags eliminada correctamente.',
      });
    } catch (error) {
      console.error('[visual-tags-content] Error eliminando configuración:', error);
      toggleNotification({
        type: 'error',
        message: 'No se pudo eliminar la configuración de tags.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderValueInput = (rule, ruleIndex, conditionIndex) => {
    const condition = rule.conditions?.[conditionIndex];

    if (!condition) {
      return null;
    }

    const fieldType = getFieldType(condition.field);

    if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
      return (
        <div className="visual-tags-empty-operator">
          Este operador no requiere un valor.
        </div>
      );
    }

    if (fieldType === 'boolean') {
      return (
        <select
          value={condition.value}
          onChange={(e) => updateCondition(ruleIndex, conditionIndex, { value: e.target.value })}
          className="visual-tags-select"
        >
          <option value="">Seleccionar</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (isNumberField(fieldType)) {
      return (
        <input
          type="number"
          value={condition.value}
          onChange={(e) => updateCondition(ruleIndex, conditionIndex, { value: e.target.value })}
          placeholder="Valor numérico"
          className="visual-tags-input"
        />
      );
    }

    if (fieldType === 'datetime') {
      return (
        <input
          type="datetime-local"
          value={condition.value}
          onChange={(e) => updateCondition(ruleIndex, conditionIndex, { value: e.target.value })}
          className="visual-tags-input"
        />
      );
    }

    if (fieldType === 'date') {
      return (
        <input
          type="date"
          value={condition.value}
          onChange={(e) => updateCondition(ruleIndex, conditionIndex, { value: e.target.value })}
          className="visual-tags-input"
        />
      );
    }

    if (fieldType === 'time') {
      return (
        <input
          type="time"
          value={condition.value}
          onChange={(e) => updateCondition(ruleIndex, conditionIndex, { value: e.target.value })}
          className="visual-tags-input"
        />
      );
    }

    return (
      <input
        type="text"
        value={condition.value}
        onChange={(e) => updateCondition(ruleIndex, conditionIndex, { value: e.target.value })}
        placeholder="Valor de comparación"
        className="visual-tags-input"
      />
    );
  };

  const getTagPreviewStyle = (color) => {
    const theme = getTagTheme(color);

    return {
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      border: theme.border,
    };
  };

  return (
    <>
      <style>{appStyles}</style>

      <div className="visual-tags-shell">
        <div className="visual-tags-panel">
          <div className="visual-tags-header">
            <div>
              <div className="visual-tags-eyebrow">Plugin</div>
              <h1>Visual Tags Content</h1>
            </div>

            {selectedContentType && (
              <button
                type="button"
                className="visual-tags-button-ghost"
                onClick={() => setSelectedContentType(null)}
              >
                <ArrowLeft size="14" />
                Volver
              </button>
            )}
          </div>

          <div className="visual-tags-layout">
            <aside className="visual-tags-sidebar">
              <div className="visual-tags-sidebar-header">
                <h2>Colecciones</h2>
              </div>

              <div className="visual-tags-search">
                <div className="visual-tags-search-box">
                  <Search size="14" />
                  <input
                    type="text"
                    value={collectionQuery}
                    onChange={(event) => setCollectionQuery(event.target.value)}
                    placeholder="Buscar colección"
                    aria-label="Buscar colección"
                  />
                </div>
              </div>

              <div className="visual-tags-collection-list">
                {filteredCollectionTypes.length === 0 ? (
                  <div className="visual-tags-empty-state visual-tags-collection-card">
                    No se encontraron colecciones.
                  </div>
                ) : (
                  filteredCollectionTypes.map((contentType) => {
                    const isSelected = selectedContentType?.uid === contentType.uid;

                    return (
                      <div
                        key={contentType.uid}
                        className={`visual-tags-collection-card ${isSelected ? 'is-selected' : ''}`}
                      >
                        <span className="uid">{contentType.uid}</span>
                        <span className="name">{contentType.info?.displayName || contentType.uid}</span>

                        <button
                          type="button"
                          className={isSelected ? 'visual-tags-button' : 'visual-tags-button-secondary'}
                          onClick={async () => {
                            setSelectedContentType(contentType);
                            setRules([]);
                            await loadConfigForContentType(contentType.uid);
                          }}
                        >
                          {isSelected ? 'Editar' : 'Configurar'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            <main className="visual-tags-main">
              {selectedContentType ? (
                <>
                  <div className="visual-tags-toolbar">
                    <h2>{selectedContentType.info?.displayName}</h2>

                    <div className="visual-tags-actions">
                      <button
                        type="button"
                        className="visual-tags-button-danger"
                        onClick={resetConfigForContentType}
                        disabled={isSaving}
                      >
                        <Trash size="14" />
                        Eliminar
                      </button>

                      <button
                        type="button"
                        className="visual-tags-button"
                        onClick={saveConfigForContentType}
                        disabled={isSaving}
                      >
                        <Plus size="14" />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>

                  <div className="visual-tags-meta">
                    UID: <strong>{selectedContentType.uid}</strong>
                  </div>

                  <div className="visual-tags-fields">
                    <h3>Campos disponibles</h3>
                    <div className="visual-tags-field-items">
                      {availableAttributes.length === 0 ? (
                        <span className="visual-tags-field-pill">No hay campos configurables</span>
                      ) : (
                        availableAttributes.map(([fieldName, field]) => (
                          <span key={fieldName} className="visual-tags-field-pill">
                            {fieldName}
                            <span>· {field.type}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="visual-tags-headline">
                    <h3>Tags configurados</h3>
                    <button
                      type="button"
                      className="visual-tags-button-secondary"
                      onClick={addTag}
                      disabled={availableAttributes.length === 0}
                    >
                      <Plus size="14" />
                      Agregar tag
                    </button>
                  </div>

                  {availableAttributes.length === 0 ? (
                    <div className="visual-tags-empty-state visual-tags-fields">
                      No hay campos configurables para esta colección, por lo que no se pueden crear tags.
                    </div>
                  ) : rules.length === 0 ? (
                    <div className="visual-tags-empty-state visual-tags-fields">
                      No hay tags configurados para esta colección.
                    </div>
                  ) : (
                    <div className="visual-tags-stack">
                      {rules.map((rule, index) => (
                        <div key={rule.id || `tag-${index}`} className="visual-tags-tag-card">
                          <div className="visual-tags-tag-top">
                            <div className="visual-tags-tag-label">
                              <span
                                className="visual-tags-tag-chip"
                                style={getTagPreviewStyle(rule.color)}
                              >
                                {rule.text || 'Tag sin texto'}
                              </span>
                              <span className="visual-tags-tag-index">Tag {index + 1}</span>
                            </div>

                            <button
                              type="button"
                              className="visual-tags-button-text"
                              onClick={() => removeTag(index)}
                            >
                              Eliminar tag
                            </button>
                          </div>

                          <div className="visual-tags-section">
                            <label className="visual-tags-label">Relación entre condiciones</label>
                            <select
                              value={rule.logic}
                              onChange={(e) => {
                                const nextRules = [...rules];
                                nextRules[index] = { ...nextRules[index], logic: e.target.value };
                                setRules(nextRules);
                              }}
                              className="visual-tags-select"
                            >
                              <option value="AND">Todas las condiciones (Y)</option>
                              <option value="OR">Cualquiera de las condiciones (O)</option>
                            </select>
                          </div>

                          <div className="visual-tags-condition-list">
                            {rule.conditions?.map((condition, conditionIndex) => {
                              const operators = getOperatorsForField(condition.field);

                              return (
                                <div
                                key={condition.id || `${rule.id || index}-${conditionIndex}`}
                                className="visual-tags-condition"
                              >
                                  <div className="visual-tags-condition-head">
                                    <strong>Condición {conditionIndex + 1}</strong>

                                    {rule.conditions.length > 1 && (
                                      <button
                                        type="button"
                                        className="visual-tags-button-text"
                                        onClick={() => removeCondition(index, conditionIndex)}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                  </div>

                                  <div className="visual-tags-condition-grid">
                                    <div>
                                      <label className="visual-tags-label">Campo</label>
                                      <select
                                        value={condition.field}
                                        onChange={(e) =>
                                          updateCondition(index, conditionIndex, {
                                            field: e.target.value,
                                            operator: '=',
                                            value: '',
                                          })
                                        }
                                        className="visual-tags-select"
                                      >
                                        <option value="">Seleccionar campo</option>
                                        {availableAttributes.map(([fieldName, field]) => (
                                        <option key={fieldName} value={fieldName}>
                                          {fieldName} — {field.type}
                                        </option>
                                      ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="visual-tags-label">Operador</label>
                                      <select
                                        value={condition.operator}
                                        onChange={(e) =>
                                          updateCondition(index, conditionIndex, {
                                            operator: e.target.value,
                                            value: '',
                                          })
                                        }
                                        className="visual-tags-select"
                                        disabled={!condition.field}
                                      >
                                        <option value="">Seleccionar operador</option>
                                        {operators.map((operator) => (
                                          <option key={operator.value} value={operator.value}>
                                            {operator.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="visual-tags-label">Valor</label>
                                      {renderValueInput(rule, index, conditionIndex)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="visual-tags-section">
                            <button type="button" className="visual-tags-button-secondary" onClick={() => addCondition(index)}>
                              <Plus size="14" />
                              Agregar condición
                            </button>
                          </div>

                          <div className="visual-tags-presenter">
                            <h4>Presentación del tag</h4>

                            <div className="visual-tags-section">
                              <label className="visual-tags-label">Texto de la etiqueta</label>
                              <input
                                type="text"
                                value={rule.text}
                                onChange={(e) => {
                                  const nextRules = [...rules];
                                  nextRules[index] = { ...nextRules[index], text: e.target.value };
                                  setRules(nextRules);
                                }}
                                placeholder="Texto que mostrará la etiqueta"
                                className="visual-tags-input"
                              />
                            </div>

                            <div className="visual-tags-section">
                              <label className="visual-tags-label">Color de la etiqueta</label>
                              <select
                                value={rule.color}
                                onChange={(e) => {
                                  const nextRules = [...rules];
                                  nextRules[index] = { ...nextRules[index], color: e.target.value };
                                  setRules(nextRules);
                                }}
                                className="visual-tags-select"
                              >
                                {Object.entries(TAG_COLORS).map(([key, value]) => (
                                  <option key={key} value={key}>
                                    {value.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="visual-tags-preview">
                              <label>Vista previa</label>
                              <span
                                className="visual-tags-tag-chip"
                                style={getTagPreviewStyle(rule.color)}
                              >
                                {rule.text || 'Texto del tag'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="visual-tags-empty">
                  <div className="visual-tags-empty-box">
                    <div className="emoji">🏷️</div>
                    <h3>Selecciona una colección</h3>
                    <p>
                      Elige una colección del listado para crear, editar o eliminar las reglas
                      de etiquetas visuales.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
