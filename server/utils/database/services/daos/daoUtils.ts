import knex from '../../config';

// Define un tipo para el parámetro 'type'
type ObjectType = 'oferta' | 'demanda';

async function createAndLinkedTags(tagName: string, objectId: number, type: ObjectType): Promise<void> {
	try {
		let tag = await knex('tags').where({ nombre: tagName }).first();

		// Si el tag no existe, lo crea
		if (!tag) {
			const [tagId] = await knex('tags').insert({ nombre: tagName }).returning('id');
			tag = { id: tagId, nombre: tagName };
		}

		// Verifica si el vínculo ya existe
		const linkExists = await knex('oferta_demanda_tags')
			.where({
				tag_id: tag.id,
				object_id: objectId,
				tipo: type
			})
			.first();

		// Si no existe el vínculo, lo crea
		if (!linkExists) {
			await knex('oferta_demanda_tags').insert({
				tag_id: tag.id,
				object_id: objectId,
				tipo: type
			});
		}
	} catch (error) {
		console.error('Error al crear o vincular tag:', error);
	}
}

export { createAndLinkedTags };
