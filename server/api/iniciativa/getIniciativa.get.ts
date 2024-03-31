import { defineEventHandler, createError } from 'h3';


export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const iniciativa = await findById(id); 
    if (!iniciativa) {
      throw createError({ statusCode: 404, statusMessage: 'Iniciativa no encontrada' });
    }
    return { ok: true, iniciativa };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
