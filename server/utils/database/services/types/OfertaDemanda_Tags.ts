import type { Tag } from './Tag';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface OfertaDemanda_Tags {
	object_id: PrimaryKey<Int>;
	tag_id: PrimaryKey<ForeignKey<Tag, 'id'>>;
	tipo: PrimaryKey<VarChar<8>>;
}

export namespace OfertaDemanda_Tags {
	export const Name = 'oferta_demanda_tags';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<OfertaDemanda_Tags> {}
	export interface CreateData extends GetCreateType<OfertaDemanda_Tags> {}
}
