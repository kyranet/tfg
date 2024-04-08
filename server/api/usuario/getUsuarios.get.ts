import { defineEventHandler, getQuery, createError } from 'h3';
import Usuario from '../../database/models/usuario.model'; //Revisar Models

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const skip = Number(query.skip) || 0;
    const limit = Number(query.limit) || Number.MAX_SAFE_INTEGER;
    const filtros = JSON.parse(query.filtros as string || '{}');
    let conditions = [];

    // Logica de filtros
    // filtro por texto (titulo)
    if (filtros.terminoBusqueda.trim() !== '') {
        let regex = new RegExp(filtros.terminoBusqueda.trim(), 'i')
        conditions.push(
            { $or: [{ nombre: regex }, { apellidos: regex }, { email: regex }, { universidad: regex }, { titulo: regex }, { sector: regex }, { rol: regex }, { origin_login: regex }] }
        );
    }
    const [usuarios, filtradas, total] = await Promise.all([
      Usuario.find(conditions.length ? { $and: conditions } : {}).sort('-createdAt').skip(skip).limit(limit),
      Usuario.find(conditions.length ? { $and: conditions } : {}).countDocuments(),
      Usuario.countDocuments(),
    ]);

    return { ok: true, usuarios, filtradas, total };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
