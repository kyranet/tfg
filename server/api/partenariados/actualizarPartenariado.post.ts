import { defineEventHandler, readBody, createError } from 'h3';
import {actualizarPartenariado,obtenerPartenariado} from '../../utils/database/services/daos/daoColaboracion'; 

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id as unknown as number;
    const body = await readBody(event);
    let partenariado = await obtenerPartenariado(id);

    if (!partenariado) {
      throw createError({ statusCode: 404, statusMessage: 'Partenariado no encontrado' });
    }

    partenariado.id_demanda = body.id_demanda;
    partenariado.titulo = body.titulo;
    partenariado.descripcion = body.descripcion;
    partenariado.admite_externos = body.externos;
    partenariado.profesores = body.profesores;
    await actualizarPartenariado(partenariado);

    return { ok: true };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
