import { defineEventHandler, readBody, createError } from 'h3';
import {crearPartenariado} from '../../utils/database/services/daos/daoColaboracion';
import TPartenariado from '../../utils/database/services/Transfer/tPartenariado'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let profesores = body.profesores.map(dato => dato.id);
    let partenariado : TPartenariado={
        id:null,
        titulo:body.titulo,
        descripcion:body.descripcion,
        admite_externos:body.externos,
        responsable:body.responsable,
        profesores:profesores,
        id_demanda:body.id_demanda,
        id_oferta:body.id_oferta,
        status:'EN_CREACION',
    }
    let id = await crearPartenariado(partenariado);
    return { ok: true, id };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
