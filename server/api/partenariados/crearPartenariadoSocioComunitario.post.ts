import { defineEventHandler, readBody, createError } from 'h3';
import TDemandaServicio from '../../utils/database/services/Transfer/tDemandaServicio';
import TPartenariado from '../../utils/database/services/Transfer/tPartenariado';
import {crearDemanda} from '../../utils/database/services/daos/daoDemanda';
import {obtenerIdPartenariado,crearPartenariado,actualizarPartenariado,actualizarPrevioPartenariado} from '../../utils/database/services/daos/daoColaboracion';
import {} from '../../utils/database/services/daos/daoTentativa';

const NEGOTIATION_STATE = 'EN_NEGOCIACION';
const CREATION_STATE = 'EN_NEGOCIACION';
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = event.context.req.currentUser; // Asegúrate de tener una forma de acceder al usuario actual
    let id_demanda = body.id_demanda;
    let estado = id_demanda == undefined ? CREATION_STATE : NEGOTIATION_STATE;

    if (id_demanda == undefined) {
      // Si no existe demanda, se crea una
      let areasServicio = body.areasServicio.map(dato => dato.id);
      let titulaciones = body.titulaciones.map(dato => dato.id);
      let demanda:TDemandaServicio={
          id: null,
          titulo: body.titulo,
          descripcion: body.descripcion,
          imagen: body.imagen,
          creador: user.uid,
          ciudad: body.ciudad,
          finalidad: body.finalidad,
          periodo_definicion_ini: body.periodo_definicion_ini,
          periodo_definicion_fin: body.periodo_definicion_fin,
          periodo_ejecucion_ini: body.periodo_ejecucion_ini,
          periodo_ejecucion_fin: body.periodo_ejecucion_fin,
          fecha_fin: body.fecha_fin,
          observaciones_temporales: body.observaciones_temporales,
          necesidad_social: body.necesidad_social,
          titulacionlocal: titulaciones,
          area_servicio: areasServicio,
          comunidad_beneficiaria: '',
          dummy: 1,
          created_at: undefined,
          updated_at: undefined
      } 
      id_demanda = await crearDemanda(demanda);
    }

    let id_partenariado = await obtenerIdPartenariado(id_demanda, body.id_oferta);

    let partenariado :TPartenariado={
        id:id_partenariado,
        titulo:body.titulo,
        descripcion:body.descripcion,
        admite_externos:body.externos,
        responsable:body.responsable,
        profesores:body.profesores,
        id_demanda:id_demanda,
        id_oferta:body.id_oferta,
        status:estado
    }
    
    if (id_partenariado == null) {
      await crearPartenariado(partenariado);
    } else {
      await actualizarPartenariado(partenariado);
    }

    // Actualizar estado del partenariado previo, si necesario
    //Revisar si es correcto los parametros que se pasan, en el cod original se envia 0,1 en vez de true/false
    await actualizarPrevioPartenariado(id_demanda, body.id_oferta, false, true);

    return { ok: true, partenariado };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
