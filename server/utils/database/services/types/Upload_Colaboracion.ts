import type { Colaboracion } from './Colaboracion';
import type { Upload } from './Upload';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface Upload_Colaboracion {
	/** Foreign key of {@linkcode Upload.id} */
	id_upload: PrimaryKey<ForeignKey<Upload, 'id'>>;
	/** Foreign key of {@linkcode Colaboracion.id} */
	id_colaboracion: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
}

export namespace Upload_Colaboracion {
	export const name = 'uploads_colaboracion';

	export interface Value extends GetType<Upload_Colaboracion> {}
	export interface CreateData extends GetCreateType<Upload_Colaboracion> {}
}
