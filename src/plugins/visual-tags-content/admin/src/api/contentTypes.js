import { getFetchClient } from '@strapi/strapi/admin';

export const getContentTypes = async () => {
  try {
    const { get } = getFetchClient();

    const response = await get('/content-manager/content-types');

    return response.data;
  } catch (error) {
    console.error(
      '[visual-tags-content] Error obteniendo Content-Types:',
      error
    );

    return [];
  }
};