import type { Tag } from './Tag';
import type { ForeignKey, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface OfertaDemanda_Tags {
	object_id: PrimaryKey<Int>;
	tag_id: PrimaryKey<ForeignKey<Tag, 'id'>>;
	tipo: PrimaryKey<VarChar<8>>;
}

export namespace OfertaDemanda_Tags {
	export const Name = 'oferta_demanda_tags';

	export interface Value extends GetType<OfertaDemanda_Tags> {}
	export interface CreateData extends GetCreateType<OfertaDemanda_Tags> {}
}
