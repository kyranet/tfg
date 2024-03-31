import { defineEventHandler,createError, readBody } from 'h3';
import {crearDemanda } from '../../utils/database/services/daos/daoDemanda';
import TDemanda from '../../utils/database/services/Transfer/tDemandaServicio';

export const crearDemandas= defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    // Recolectar áreas y titulaciones del cuerpo de la solicitud
    const areas = body.area_servicio.map((data) => data.id);
    const titulaciones = body.titulacion_local.map((data) => data.id);
    
    // Crear la instancia de la demanda siguiendo la original
    const demanda : TDemanda = {
      id: null, // id
      titulo: body.titulo,
      descripcion: body.descripcion,
      imagen: body.imagen,
      created_at:null, 
      updated_at:null,
      creador: body.current_user.uid, // Esta en el original, correcto?
      ciudad: body.ciudad,
      finalidad: body.objetivo,
      periodo_definicion_ini: body.fechaDefinicionIni,
      periodo_definicion_fin: body.fechaDefinicionFin,
      periodo_ejecucion_ini: body.fechaEjecucionIni,
      periodo_ejecucion_fin: body.fechaEjecucionFin,
      fecha_fin: body.fechaFin,
      observaciones_temporales: body.observaciones,
      necesidad_social: body.necesidad_social,
      titulacionlocal: titulaciones,
      area_servicio: areas,
      comunidad_beneficiaria: body.comunidadBeneficiaria,
      dummy: 0,
    };

    // Llamada al DAO para guardar la nueva demanda
    const demandaId = await crearDemanda(demanda);
    demanda.id = demandaId; // Actualizamos ID

    // Devolver la demanda creada como respuesta
    return { ok: true, demanda };
  } catch (error) {
    console.error(error);

    throw createError({ statusCode: 500, statusMessage: 'Error al crear Demanda' });
  }
});
