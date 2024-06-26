import type { AnuncioServicio } from './AnuncioServicio';
import type { Upload } from './Upload';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface Upload_AnuncioServicio {
	/** Foreign key of {@linkcode Upload.id} */
	id_upload: PrimaryKey<ForeignKey<Upload, 'id'>>;
	/** Foreign key of {@linkcode AnuncioServicio.id} */
	id_anuncio: PrimaryKey<ForeignKey<AnuncioServicio, 'id'>>;
}

export namespace Upload_AnuncioServicio {
	export const Name = 'upload_anuncioservicio';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Upload_AnuncioServicio> {}
	export interface CreateData extends GetCreateType<Upload_AnuncioServicio> {}
}
