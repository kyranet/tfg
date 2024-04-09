import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Tag {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<32>;
}

export namespace Tag {
	export const Name = 'tags';

	export interface Value extends GetType<Tag> {}
	export interface CreateData extends GetCreateType<Tag> {}
}
