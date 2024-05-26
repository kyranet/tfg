import type { AnuncioServicio } from '../AnuncioServicio';
import type { AreaServicio } from '../AreaServicio';
import type { Asignatura } from '../Asignatura';
import type { DatosPersonalesInterno } from '../DatosPersonalesInterno';
import type { OfertaServicio } from '../OfertaServicio';
import type { Tag } from '../Tag';
import type { Usuario } from '../Usuario';
import { makeKeyFunction, type AsRaw } from '../base/Shared';
import type { ViewUser } from './User';

export namespace ViewServiceOffer {
	export const Name = 'view_service_offer';
	export const Key = makeKeyFunction(Name);

	export interface Value {
		id: OfertaServicio.Value['id'];
		academicYear: OfertaServicio.Value['anio_academico'];
		remarks: OfertaServicio.Value['observaciones_temporales'];
		quarter: OfertaServicio.Value['cuatrimestre'];
		deadline: OfertaServicio.Value['fecha_limite'];
		title: AnuncioServicio.Value['titulo'];
		description: AnuncioServicio.Value['descripcion'];
		image: AnuncioServicio.Value['imagen'];
		createdAt: AnuncioServicio.Value['created_at'];
		updatedAt: AnuncioServicio.Value['updated_at'];
		services: AreaServicio.Value['nombre'][];
		subjects: Asignatura.Value['nombre'][];
		tags: Tag.Value['nombre'][];
		creator: {
			id: ViewUser.Value['id'];
			firstName: ViewUser.Value['firstName'];
			lastName: ViewUser.Value['lastName'];
			avatar: ViewUser.Value['avatar'];
		};
		professors: {
			id: DatosPersonalesInterno.Value['id'];
			firstName: DatosPersonalesInterno.Value['nombre'];
			lastName: DatosPersonalesInterno.Value['apellidos'];
			avatar: Usuario.Value['origin_img'];
		}[];
	}

	export type RawValue = AsRaw<Value>;
}
