import { OfertaDemanda_Tags } from '../types/OfertaDemanda_Tags';
import { Tag } from '../types/Tag';

// Define un tipo para el parámetro 'type'
type ObjectType = 'oferta' | 'demanda';

export async function createAndLinkedTags(name: string, objectId: number, type: ObjectType): Promise<void> {
	return await qb.transaction(async (trx) => {
		const tag =
			(await trx(Tag.Name).where({ nombre: name }).first()) ?? //
			(await trx(Tag.Name).insert({ nombre: name }).returning('*').first())!;

		await trx(OfertaDemanda_Tags.Name).upsert({ tag_id: tag.id, object_id: objectId, tipo: type });
	});
}
