import { Knex } from 'knex';

export type VarChar<_Characters extends number> = string;
export type Int = number;
export type Float = number;
export type AutoIncrement<Type> = Type & { __AUTO_INCREMENT__: Type };
export type Defaults<Type> = Type & { __DEFAULTS__: Type };
export type Unique<Type> = Type & { __UNIQUE__: Type };
export type PrimaryKey<Type> = Type & { __PRIMARY_KEY__: Type };
export type ForeignKey<Table, Keys extends keyof Table> = ExtractTypeValue<Table[Keys]> & {
	__REFERENCES_TABLE__: Table;
	__REFERENCES_KEY__: Keys;
};

export function makeKeyFunction<Name extends Knex.TableNames>(name: Name) {
	return function <Key extends Extract<keyof Knex.TableType<Name>, string>>(key: Key): `${Name}.${Key}` {
		return `${name}.${key}` as const;
	};
}

type ExtractTypeValue<Type> =
	Type extends PrimaryKey<infer InnerType>
		? ExtractTypeValue<InnerType>
		: Type extends Unique<infer InnerType>
			? ExtractTypeValue<InnerType>
			: Type extends ForeignKey<infer InnerTable, infer InnerKey>
				? ExtractTypeValue<InnerTable[InnerKey]>
				: Type extends AutoIncrement<infer InnerType>
					? ExtractTypeValue<InnerType>
					: Type extends Defaults<infer InnerType>
						? ExtractTypeValue<InnerType>
						: Type;

export type GetType<Table extends object> = { [K in keyof Table]: ExtractTypeValue<Table[K]> };

type IsAutomaticValue<Type> = Type extends AutoIncrement<infer _> | Defaults<infer _> ? true : false;
type GetAutomaticKeys<Table extends object> = { [K in keyof Table]: IsAutomaticValue<Table[K]> extends true ? K : never }[keyof Table];
type PartializeKeys<Value extends object, Keys extends keyof Value> = Omit<Value, Keys> & Partial<Pick<Value, Keys>>;
export type GetCreateType<Table extends object> = PartializeKeys<GetType<Table>, GetAutomaticKeys<Table>>;
