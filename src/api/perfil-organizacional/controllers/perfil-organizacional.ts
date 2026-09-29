/**
 * perfil-organizacional controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::perfil-organizacional.perfil-organizacional', () => ({
	async findComplete(ctx) {
		ctx.query = {
			...ctx.query,
			populate: {
				Seccion: {
					on: {
						'componentes.tarjeta': {
							populate: {
								Imagen: true,
							},
						},
						'componentes.bloques': {
							populate: {
								Bloque: true,
							},
						},
					},
				},
			},
		};

		return super.find(ctx);
	},
}));
