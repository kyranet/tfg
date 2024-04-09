import type { AutoIncrement, Defaults, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Mail {
	id: PrimaryKey<AutoIncrement<Int>>;
	mail_to: VarChar<200>;
	type: VarChar<200>;
	mail_name: VarChar<200>;
	mail_from: VarChar<200>;
	subject: VarChar<1200>;
	html: VarChar<1200>;
	_to: VarChar<200>;
	usuario: Defaults<VarChar<200>>;
	createdAt: Defaults<Date>;
	updatedAt: Defaults<Date>;
}

export namespace Mail {
	export const name = 'mail';

	export interface Value extends GetType<Mail> {}
	export interface CreateData extends GetCreateType<Mail> {}
}
