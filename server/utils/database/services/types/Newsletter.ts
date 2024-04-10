import {
	makeKeyFunction,
	type AutoIncrement,
	type Defaults,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type VarChar
} from './base/Shared';

export interface Newsletter {
	id: PrimaryKey<AutoIncrement<Int>>;
	mail_to: VarChar<200>;
	createdAt: Defaults<Date>;
	updatedAt: Defaults<Date | null>;
}

export namespace Newsletter {
	export const Name = 'newsletter';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Newsletter> {}
	export interface CreateData extends GetCreateType<Newsletter> {}
}
