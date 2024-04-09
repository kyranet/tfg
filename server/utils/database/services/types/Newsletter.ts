import type { AutoIncrement, Defaults, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Newsletter {
	id: PrimaryKey<AutoIncrement<Int>>;
	mail_to: VarChar<200>;
	createdAt: Defaults<Date>;
	updatedAt: Defaults<Date | null>;
}

export namespace Newsletter {
	export const Name = 'newsletter';

	export interface Value extends GetType<Newsletter> {}
	export interface CreateData extends GetCreateType<Newsletter> {}
}
