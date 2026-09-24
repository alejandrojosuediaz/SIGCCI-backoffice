import React from 'react';
import { getFetchClient } from '@strapi/strapi/admin';
import { Sun } from '@strapi/icons';
import { TAG_COLORS } from './types/tag';

const TAG_CACHE = {};
const TAG_COLUMN_NAME = '__visual_tags_content_tag';

const normalizeConfig = (uid, config = {}) => ({
  uid,
  tags: Array.isArray(config.tags) ? config.tags : [],
});

const readTagConfigFromCache = (uid) => {
  if (!uid) {
    return { uid: '', tags: [] };
  }

  const windowCache =
    typeof window !== 'undefined' && window.visualTagsContentCache
      ? window.visualTagsContentCache
      : {};

  const cacheEntry = TAG_CACHE[uid] || windowCache[uid] || {};

  return normalizeConfig(uid, cacheEntry);
};

const getCurrentContentTypeUID = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const pathname = window.location?.pathname || '';
  const segments = pathname.split('/').filter(Boolean);
  const contentManagerIndex = segments.indexOf('content-manager');

  if (contentManagerIndex === -1) {
    return '';
  }

  return segments[contentManagerIndex + 2] || '';
};

const getFieldValue = (record, fieldPath) => {
  if (!fieldPath || !record) {
    return undefined;
  }

  const path = fieldPath.split('.');
  let value = record;

  for (const segment of path) {
    if (value == null) {
      return undefined;
    }

    value = value[segment];
  }

  return value;
};

const extractComparableValues = (value) => {
  const values = [];

  const pushValue = (entry) => {
    if (entry === undefined || entry === null) {
      return;
    }

    if (typeof entry === 'string' || typeof entry === 'number' || typeof entry === 'boolean') {
      const asString = String(entry).trim();
      if (asString) {
        values.push(asString.toLowerCase());
      }
      return;
    }

    if (Array.isArray(entry)) {
      entry.forEach(pushValue);
      return;
    }

    if (typeof entry === 'object') {
      const relationKeys = ['id', 'documentId', '_id', 'name', 'title', 'slug', 'displayName', 'label', 'value'];

      relationKeys.forEach((key) => {
        if (entry[key] !== undefined && entry[key] !== null) {
          pushValue(entry[key]);
        }
      });

      Object.keys(entry).forEach((key) => {
        if (['id', 'documentId', '_id', '__typename', 'createdAt', 'updatedAt'].includes(key)) {
          return;
        }

        if (typeof entry[key] === 'object') {
          pushValue(entry[key]);
          return;
        }

        if (entry[key] !== undefined && entry[key] !== null) {
          pushValue(entry[key]);
        }
      });
    }
  };

  pushValue(value);
  return [...new Set(values)];
};

const evaluateCondition = (record, condition) => {
  const { field, operator = '=', value } = condition || {};
  const currentValue = getFieldValue(record, field);

  if (operator === 'isEmpty') {
    return currentValue === undefined || currentValue === null || currentValue === '';
  }

  if (operator === 'isNotEmpty') {
    return currentValue !== undefined && currentValue !== null && currentValue !== '';
  }

  if (currentValue === undefined || currentValue === null) {
    return false;
  }

  const comparableValues = extractComparableValues(currentValue);
  const targetString = `${value ?? ''}`;
  const targetLower = targetString.toLowerCase();

  const equalsTarget = comparableValues.some((candidate) => candidate === targetLower);
  const containsTarget = comparableValues.some((candidate) => candidate.includes(targetLower));
  const startsWithTarget = comparableValues.some((candidate) => candidate.startsWith(targetLower));
  const endsWithTarget = comparableValues.some((candidate) => candidate.endsWith(targetLower));

  switch (operator) {
    case '=':
      return equalsTarget;
    case '!=':
      return !equalsTarget;
    case 'contains':
      return containsTarget;
    case 'startsWith':
      return startsWithTarget;
    case 'endsWith':
      return endsWithTarget;
    case '>':
      return Number(currentValue) > Number(value);
    case '>=':
      return Number(currentValue) >= Number(value);
    case '<':
      return Number(currentValue) < Number(value);
    case '<=':
      return Number(currentValue) <= Number(value);
    default:
      return equalsTarget;
  }
};

const ruleMatchesRecord = (record, rule) => {
  if (!rule || !Array.isArray(rule.conditions) || rule.conditions.length === 0) {
    return false;
  }

  const conditions = rule.conditions.filter(Boolean);

  if (conditions.length === 0) {
    return false;
  }

  if (rule.logic === 'OR') {
    return conditions.some((condition) => evaluateCondition(record, condition));
  }

  return conditions.every((condition) => evaluateCondition(record, condition));
};

const getTagBadgeStyle = (color) => {
  const theme = TAG_COLORS[color] || TAG_COLORS.mustard;

  return {
    backgroundColor: theme.soft || '#F0F0F0',
    color: theme.text || theme.value || '#111827',
    border: `1px solid ${theme.value}33`,
    borderRadius: '999px',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.2,
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  };
};

const refreshTagConfig = async (uid) => {
  if (!uid) {
    return { uid: '', tags: [] };
  }

  try {
    const { get } = getFetchClient();
    const response = await get(`/visual-tags-content/config/${encodeURIComponent(uid)}`);
    const config = response?.data?.data || { uid, tags: [] };
    const normalized = normalizeConfig(uid, config);

    TAG_CACHE[uid] = normalized;

    if (typeof window !== 'undefined') {
      window.visualTagsContentCache = {
        ...(window.visualTagsContentCache || {}),
        [uid]: normalized,
      };
    }

    return normalized;
  } catch (error) {
    console.error('[visual-tags-content] Error cargando configuración:', error);
    TAG_CACHE[uid] = { uid, tags: [] };

    if (typeof window !== 'undefined') {
      window.visualTagsContentCache = {
        ...(window.visualTagsContentCache || {}),
        [uid]: { uid, tags: [] },
      };
    }

    return { uid, tags: [] };
  }
};

const syncCurrentContentTypeConfig = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  const uid = getCurrentContentTypeUID();

  if (!uid) {
    return;
  }

  await refreshTagConfig(uid);
};

const injectTagColumnHook = ({ displayedHeaders, layout }) => {
  const uid = getCurrentContentTypeUID();
  const { tags } = readTagConfigFromCache(uid);

  if (!uid || !Array.isArray(tags) || tags.length === 0) {
    return { displayedHeaders, layout };
  }

  const alreadyExists = displayedHeaders.some(
    (header) => header.name === TAG_COLUMN_NAME || header.name === 'tag'
  );

  if (alreadyExists) {
    return { displayedHeaders, layout };
  }

  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        attribute: {
          type: 'string',
        },
        label: {
          id: 'visual-tags-content.list.header.tag',
          defaultMessage: 'Tag',
        },
        searchable: false,
        sortable: false,
        name: TAG_COLUMN_NAME,
        cellFormatter: (props) => {
          const matches = tags.filter((tag) => ruleMatchesRecord(props, tag));

          if (!matches.length) {
            return null;
          }

          return React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                alignItems: 'center',
              },
            },
            matches.map((tag, index) =>
              React.createElement(
                'span',
                {
                  key: `${tag?.text || 'tag'}-${index}`,
                  style: getTagBadgeStyle(tag.color),
                },
                tag.text || 'Tag'
              )
            )
          );
        },
      },
    ],
    layout,
  };
};

export default {
  register(app) {
    app.registerHook('Admin/CM/pages/ListView/inject-column-in-table', injectTagColumnHook);

    if (typeof window !== 'undefined') {
      const refreshOnNavigation = () => {
        syncCurrentContentTypeConfig();
      };

      window.addEventListener('popstate', refreshOnNavigation);

      const originalPushState = window.history.pushState;
      window.history.pushState = function patchedPushState(...args) {
        const result = originalPushState.apply(this, args);
        refreshOnNavigation();
        return result;
      };

      const originalReplaceState = window.history.replaceState;
      window.history.replaceState = function patchedReplaceState(...args) {
        const result = originalReplaceState.apply(this, args);
        refreshOnNavigation();
        return result;
      };
    }

    app.addMenuLink({
      to: '/plugins/visual-tags-content',
      icon: Sun,
      intlLabel: {
        id: 'visual-tags-content.plugin.name',
        defaultMessage: 'Visual Tags Content',
      },
      Component: async () => {
        const component = await import('./pages/App');

        return component;
      },
    });
  },

  async bootstrap() {
    await syncCurrentContentTypeConfig();
  },
};