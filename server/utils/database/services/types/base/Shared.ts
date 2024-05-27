import type { Knex } from 'knex';

/**
 * Represents a variable character type with a specified length in SQL.
 */
export type VarChar<_Characters extends number> = string;

/**
 * Represents an integer type in SQL.
 */
export type Int = number;

/**
 * Represents a float type in SQL.
 */
export type Float = number;

/**
 * Represents a SQL column with an `AUTO_INCREMENT` clause.
 *
 * @typeparam Type - The base type to extend.
 */
export type AutoIncrement<Type> = Type & { __AUTO_INCREMENT__: Type };

/**
 * Represents a SQL column with a `DEFAULT` clause or that lacks a `NOT NULL`
 * clause (defaults to `NULL`).
 *
 * @typeparam Type - The base type to extend.
 */
export type Defaults<Type> = Type & { __DEFAULTS__: Type };

/**
 * Represents a SQL column that is unique.
 *
 * @typeparam Type - The base type to extend.
 */
export type Unique<Type> = Type & { __UNIQUE__: Type };

/**
 * Represents a SQL column that is a primary key.
 *
 * @typeparam Type - The base type to extend.
 */
export type PrimaryKey<Type> = Type & { __PRIMARY_KEY__: Type };

/**
 * Represents a SQL column that is a foreign key. This will be typed as the
 * value of the key that the foreign key references.
 *
 * @typeparam Table - The table that the foreign key references.
 * @typeparam Keys - The key that the foreign key references.
 */
export type ForeignKey<Table, Keys extends keyof Table> = ExtractTypeValue<Table[Keys]> & {
	__REFERENCES_TABLE__: Table;
	__REFERENCES_KEY__: Keys;
};

/**
 * Creates a function that generates a string in the format `${tableName}.${columnName}`.
 *
 * This is useful for formatting column names with their respective table names,
 * used primarily for SQL joins.
 *
 * @remarks
 *
 * This function is used only for the namespaces in the `types` directory, and
 * is not intended to be used elsewhere. To use this, please import the
 * already created function from the respective table's namespace.
 *
 * @example
 * ```typescript
 * import { makeKeyFunction } from './base/Shared';
 *
 * export namespace Admin {
 * 	export const Name = 'admin';
 * 	export const Key = makeKeyFunction(Name);
 * }
 * ```
 *
 * @privateRemarks
 *
 * If the following error occurs:
 * ```plaintext
 * Argument of type '"my-table-name"' is not assignable to parameter of type 'keyof Tables'. ts(2345)
 * ```
 *
 * You may have misspelled the table name or it's not defined in the `Tables`
 * namespace as augmented in the `augments.d.ts` file under the `database`
 * folder.
 *
 * @param name - The name of the table.
 * @returns A function that takes a column name to format with the specified table name.
 */
export function makeKeyFunction<Name extends Knex.TableNames>(name: Name) {
	/**
	 * Appends the specified name with the previously specified table name.
	 * This is a type-safe function that aids in formatting column names with
	 * their respective table names, used primarily for SQL joins, and allows
	 * the project's development environment to catch typos in column names as
	 * well as reducing the amount of magic strings in the codebase.
	 *
	 * @example
	 * ```typescript
	 * const key = makeKeyFunction('admin');
	 *
	 * key('id');
	 * // 'admin.id'
	 *
	 * key('does-not-exist');
	 * // Argument of type '"does-not-exist"' is not assignable to parameter of type 'keyof Value'. ts(2345)
	 * ```
	 *
	 * @param key - The column name to append to the table name.
	 * @returns A formatted string in the format `${tableName}.${columnName}`.
	 */
	return function <Key extends Extract<keyof Knex.TableType<Name> | '*', string>>(key: Key): `${Name}.${Key}` {
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

/**
 * Unwraps a table type to extract the raw value types of each key.
 *
 * @template Table - The object type from which to extract the value types.
 */
export type GetType<Table extends object> = { [K in keyof Table]: ExtractTypeValue<Table[K]> };

type IsAutomaticValue<Type> = Type extends AutoIncrement<infer _> | Defaults<infer _> ? true : false;
type GetAutomaticKeys<Table extends object> = { [K in keyof Table]: IsAutomaticValue<Table[K]> extends true ? K : never }[keyof Table];
type PartializeKeys<Value extends object, Keys extends keyof Value> = Omit<Value, Keys> & Partial<Pick<Value, Keys>>;

/**
 * Unwraps a table type to extract the raw value types of each key, but
 * partializes the keys that are automatically generated or defaulted.
 *
 * @template Table - The object type from which to extract the value types.
 */
export type GetCreateType<Table extends object> = PartializeKeys<GetType<Table>, GetAutomaticKeys<Table>>;

type IsJsonValue<Type> = Type extends object ? (Type extends Date ? false : true) : false;
export type AsRaw<Table extends object> = {
	[K in keyof Table]: IsJsonValue<Table[K]> extends true ? string : Table[K];
};
