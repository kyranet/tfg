import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface Tag {
	id: PrimaryKey<AutoIncrement<Int>>;
	nombre: VarChar<32>;
}

export namespace Tag {
	export const Name = 'tags';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Tag> {}
	export interface CreateData extends GetCreateType<Tag> {}
}
