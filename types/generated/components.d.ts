import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentesActividad extends Struct.ComponentSchema {
  collectionName: 'components_componentes_actividads';
  info: {
    displayName: 'Actividad';
    icon: 'bulletList';
  };
  attributes: {
    Descripcion: Schema.Attribute.Text & Schema.Attribute.Required;
    Titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentesRedSocial extends Struct.ComponentSchema {
  collectionName: 'components_componentes_red_socials';
  info: {
    displayName: 'Red social';
    icon: 'attachment';
  };
  attributes: {
    Enlace: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    Tipo: Schema.Attribute.Enumeration<
      ['Facebook', 'X', 'Instagram', 'Linkendin', 'YouTube']
    > &
      Schema.Attribute.Required;
  };
}

export interface ComponentesRepresentantes extends Struct.ComponentSchema {
  collectionName: 'components_componentes_representantes';
  info: {
    displayName: 'Representante';
    icon: 'alien';
  };
  attributes: {
    Descripcion: Schema.Attribute.Text & Schema.Attribute.Required;
    Foto: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    Nombre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentesTarjeta extends Struct.ComponentSchema {
  collectionName: 'components_componentes_tarjetas';
  info: {
    displayName: 'Tarjeta';
    icon: 'star';
  };
  attributes: {
    Descripcion: Schema.Attribute.Text & Schema.Attribute.Required;
    Imagen: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    Titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PaginaRepresentantes extends Struct.ComponentSchema {
  collectionName: 'components_pagina_representantes';
  info: {
    displayName: 'Representantes';
    icon: 'alien';
  };
  attributes: {
    Representantes: Schema.Attribute.Component<
      'componentes.representantes',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface PaginaSobre extends Struct.ComponentSchema {
  collectionName: 'components_pagina_sobres';
  info: {
    displayName: 'Sobre';
    icon: 'book';
  };
  attributes: {
    Tarjeta: Schema.Attribute.Component<'componentes.tarjeta', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'componentes.actividad': ComponentesActividad;
      'componentes.red-social': ComponentesRedSocial;
      'componentes.representantes': ComponentesRepresentantes;
      'componentes.tarjeta': ComponentesTarjeta;
      'pagina.representantes': PaginaRepresentantes;
      'pagina.sobre': PaginaSobre;
    }
  }
}
