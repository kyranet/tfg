import type { Colaboracion } from './Colaboracion';
import type { Upload } from './Upload';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface Upload_Colaboracion {
	/** Foreign key of {@linkcode Upload.id} */
	id_upload: PrimaryKey<ForeignKey<Upload, 'id'>>;
	/** Foreign key of {@linkcode Colaboracion.id} */
	id_colaboracion: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
}

export namespace Upload_Colaboracion {
	export const Name = 'uploads_colaboracion';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Upload_Colaboracion> {}
	export interface CreateData extends GetCreateType<Upload_Colaboracion> {}
}
