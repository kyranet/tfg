import { defineEventHandler, readBody, createError } from 'h3';
import Partenariado from '../database/models/partenariado.model'; 

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const body = await readBody(event);
    const user = event.context.req.currentUser; 

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado' });
    }

    const partenariado = await Partenariado.findById(id);

    if (!partenariado || partenariado.estado !== 'En negociación') {
      return { ok: false, msg: 'No se pueden enviar mensajes a un partenariado que no está en negociación' };
    }

    const mensaje = {
      texto: body.mensaje,
      uid: user.uid,
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      rol: user.rol,
      fecha: new Date()
    };

    await Partenariado.updateOne(
      { _id: id },
      { $push: { mensajes: { $each: [mensaje], $position: 0 } } }
    );

    return { ok: true, partenariado };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
