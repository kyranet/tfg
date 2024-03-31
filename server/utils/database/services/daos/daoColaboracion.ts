import knex from '../../config';
import TColaboracion from '../Transfer/tColaboracion';
import tPartenariado from '../Transfer/tPartenariado';
import tProyecto from '../Transfer/tProyecto';
import TNotas from '../Transfer/tNotas';
import {obtenerUsuarioSinRolPorId} from '../daos/daoUsuario'


export const crearColaboracion = async (colaboracion: TColaboracion): Promise<number> => {
  try {
    const idColab: number[] = await knex("colaboracion").insert({
      titulo: colaboracion.titulo,
      descripcion: colaboracion.descripcion,
      admite_externos: colaboracion.admite_externos,
      responsable: colaboracion.responsable,
    }, 'id');

    const profesores = colaboracion.profesores;
    const fieldsToInsert = profesores.map((profesor) => ({
      id_profesor: profesor,
      id_colaboracion: idColab[0],
    }));

    await knex("profesor_colaboracion").insert(fieldsToInsert);
    return idColab[0];
  } catch (err) {
    console.error("Se ha producido un error al intentar crear la colaboracion", err);
    throw err;
  }
};

export const crearPartenariado = async (partenariado: tPartenariado): Promise<number> => {
  try {
    const id = await crearColaboracion(partenariado);
    await knex("partenariado").insert({
      id,
      id_demanda: partenariado.id_demanda,
      id_oferta: partenariado.id_oferta,
      estado: partenariado.status,
    });
    console.log("Se ha creado un partenariado con id", id);
    return id;
  } catch (err) {
    console.error("Se ha producido un error al crear el partenariado", err);
    throw err;
  }
};

export const crearProyecto = async (proyecto: tProyecto): Promise<number> => {
  try {
    const id = await crearColaboracion(proyecto);
    await knex("proyecto").insert({
      id,
      id_partenariado: proyecto.id_partenariado,
      estado: proyecto.estado,
    });

    const fieldsToInsert = proyecto.estudiantes.map((estudiante) => ({
      id_estudiante: estudiante,
      id_proyecto: id,
    }));

    await knex("estudiante_proyecto").insert(fieldsToInsert);
    return id;
  } catch (err) {
    console.error("Se ha producido un error al intentar crear el proyecto", err);
    throw err; 
  }
};

async function crearNota(nota: TNotas): Promise<number> {
    try {
      const [idF] = await knex("notas").insert({
        id_estudiante: nota.id_estudiante,
        nota: nota.nota,
        id_proyecto: nota.id_proyecto,
      }).returning("id");
      return idF;
    } catch (err) {
      console.error("Se ha producido un error al intentar crear la nota ", err);
      throw err;
    }
  }

  async function obtenerColaboracion(id_colab: number): Promise<TColaboracion> {
    try {
      const colab = await knex("colaboracion").where({ id: id_colab }).first();
      const profes = await knex("profesor_colaboracion").where({ id_colaboracion: id_colab }).select("id_profesor");
  
      const profesores = profes.map(prof => prof.id_profesor);
  
      let colabo:TColaboracion={
        id:id_colab,
        titulo:colab.titulo,
        descripcion:colab.descripcion,
        admite_externos:colab.admite_externos,
        responsable:colab.responsable,
        profesores
      };
      return colabo;
    } catch (err) {
      console.error(`Se ha producido un error al intentar obtener los profesores que trabajan en la colaboracion ${id_colab}`, err);
      throw err;
    }
  }

  export async function obtenerPartenariado(id: number): Promise<tPartenariado> {
    try {
      const colaboracion = await obtenerColaboracion(id);
      const partenariado = await knex("partenariado").where({ id }).first();
  
      const responsable = await obtenerUsuarioSinRolPorId(colaboracion.id);
      const estado = transformarEstadoPartenariado(partenariado.estado);
  
      const partner:tPartenariado={
        id:id,
        titulo:colaboracion.titulo,
        descripcion:colaboracion.descripcion,
        admite_externos:colaboracion.admite_externos,
        responsable:responsable.nombre,
        profesores:colaboracion.profesores,
        id_demanda:partenariado.id_demanda,
        id_oferta:partenariado.id_oferta,
        status:estado
      }
        return partner;
    } catch (err) {
      console.error(`Se ha producido un error al intentar obtener el partenariado con id ${id}`, err);
      throw err;
    }
  }

  async function obtenerProyecto(id: number): Promise<tProyecto> {
    try {
      const colaboracion = await obtenerColaboracion(id);
      const proyecto = await knex("proyecto").where({ id }).first();
      const estudiantes = await knex("estudiante_proyecto").where({ id_proyecto: id }).select("id_estudiante");
  
      const idsEstudiantes = estudiantes.map(est => est.id_estudiante);
  
      const proy:tProyecto={
        id:id,
        titulo:colaboracion.titulo,
        descripcion:colaboracion.descripcion,
        admite_externos:colaboracion.admite_externos,
        responsable:colaboracion.responsable,
        profesores:colaboracion.profesores,
        id_partenariado:proyecto.id_partenariado,
        estado:proyecto.estado,
        estudiantes:idsEstudiantes
      }
        return proy;
    } catch (err) {
      console.error(`Se ha producido un error al intentar obtener el proyecto con id ${id}`, err);
      throw err;
    }
  }
  
  // Utilidad para transformar el estado del partenariado
  function transformarEstadoPartenariado(estado: string): string {
    switch (estado) {
      case "EN_CREACION":
        return "En creación";
      case "EN_NEGOCIACION":
        return "En negociación";
      case "ACORDADO":
        return "Acordado";
      case "SUSPENDIDO":
        return "Suspendido";
      default:
        return "Estado desconocido";
    }
  }

  // Función para obtener una nota específica
async function obtenerNota(id: number): Promise<TNotas | null> {
    try {
      const response = await knex('notas').where({ id }).first();
      if (!response) return null;
      const notas: TNotas={
        id:response.id,
        id_estudiante:response.id_estudiante,
        nota:response.nota,
        id_proyecto:response.id_proyecto
      }
        return notas;
    } catch (err) {
      console.error("Se ha producido un error al obtener la nota:", err);
      throw err;
    }
  }
  
  // Funciones para contar elementos en la base de datos
  export async function contarProyectos(): Promise<number> {
    try {
      const result = await knex('proyecto').count('* as total').first();
      return result ? +result.total : 0;
    } catch (err) {
      console.error("Error al contar proyectos:", err);
      throw err;
    }
  }
  
  export async function contarPartenariados(): Promise<number> {
    try {
      const result = await knex('partenariado').count('* as total').first();
      return result ? +result.total : 0;
    } catch (err) {
      console.error("Error al contar partenariados:", err);
      throw err;
    }
  }
  
  export async function contarIniciativas(): Promise<number> {
    try {
      const result = await knex('oferta_servicio').count('* as total').first();
      return result ? +result.total : 0;
    } catch (err) {
      console.error("Error al contar iniciativas:", err);
      throw err;
    }
  }
  
  async function contarOfertas(): Promise<number> {
    try {
      const result = await knex('anuncio_servicio').count('* as total').first();
      return result ? +result.total : 0;
    } catch (err) {
      console.error("Error al contar ofertas:", err);
      throw err;
    }
  }

  //ELIMINAR

// Eliminar una colaboración
async function eliminarColaboracion(id_colab: number): Promise<void> {
  try {
    const result = await knex("colaboracion").where({ id: id_colab }).del();
    if (result > 0) {
      console.log("Colaboración eliminada con éxito. ID:", id_colab);
    } else {
      console.log("No se encontró la colaboración con ID:", id_colab);
    }
  } catch (err) {
    console.error("Error al eliminar la colaboración. ID:", id_colab, err);
  }
}

// Eliminar un partenariado
async function eliminarPartenariado(id: number): Promise<void> {
  try {
    const result = await knex("partenariado").where("id", id).del();
    if (result > 0) {
      console.log("Partenariado eliminado con éxito. ID:", id);
    } else {
      console.log("No se encontró el partenariado con ID:", id);
    }
  } catch (err) {
    console.error("Error al eliminar el partenariado. ID:", id, err);
  }
}

// Eliminar un proyecto
async function eliminarProyecto(id: number): Promise<void> {
  try {
    const result = await knex("proyecto").where("id", id).del();
    if (result > 0) {
      console.log("Proyecto eliminado con éxito. ID:", id);
    } else {
      console.log("No se encontró el proyecto con ID:", id);
    }
  } catch (err) {
    console.error("Error al eliminar el proyecto. ID:", id, err);
  }
}

// Eliminar una nota
async function eliminarNota(id: number): Promise<void> {
  try {
    const result = await knex("notas").where({ id }).del();
    if (result > 0) {
      console.log("Nota eliminada con éxito. ID:", id);
    } else {
      console.log("No se encontró la nota con ID:", id);
    }
  } catch (err) {
    console.error("Error al eliminar la nota. ID:", id, err);
  }
}

//ACTUALIZAR---------------------------------------------------

async function actualizarColaboracion(colaboracion: TColaboracion): Promise<void> {
  try {
    await knex("colaboracion")
      .where({ id: colaboracion.id })
      .update({
        titulo: colaboracion.titulo,
        descripcion: colaboracion.descripcion,
        admite_externos: colaboracion.admite_externos,
        responsable: colaboracion.responsable,
      });

    await knex("profesor_colaboracion")
      .where("id_colaboracion", colaboracion.id)
      .del();

    if (colaboracion.profesores.length > 0) {
      const fieldsToInsert = colaboracion.profesores.map(profesor => ({
        id_profesor: profesor,
        id_colaboracion: colaboracion.id,
      }));
      await knex("profesor_colaboracion").insert(fieldsToInsert);
    }

    console.log("Colaboración actualizada con éxito. ID:", colaboracion.id);
  } catch (err) {
    console.error("Error al actualizar la colaboración. ID:", colaboracion.id, err);
  }
}

export async function actualizarPartenariado(partenariado: tPartenariado): Promise<void> {
  try {
    await actualizarColaboracion(partenariado);

    await knex("partenariado")
      .where("id", partenariado.id)
      .update({
        id_demanda: partenariado.id_demanda,
        id_oferta: partenariado.id_oferta,
      });

    console.log("Partenariado actualizado con éxito. ID:", partenariado.id);
  } catch (err) {
    console.error("Error al actualizar el partenariado. ID:", partenariado.id, err);
  }
}

async function actualizarProyecto(proyecto: tProyecto): Promise<void> {
  try {
    await actualizarColaboracion(proyecto);

    await knex("proyecto")
      .where("id", proyecto.id)
      .update({
        id_partenariado: proyecto.id_partenariado,
        estado: proyecto.estado,
      });

    await knex("estudiante_proyecto")
      .where("id_proyecto", proyecto.id)
      .del();

    const fieldsToInsert = proyecto.estudiantes.map(estudiante => ({
      id_estudiante: estudiante,
      id_proyecto: proyecto.id,
    }));
    await knex("estudiante_proyecto").insert(fieldsToInsert);

    console.log("Proyecto actualizado con éxito. ID:", proyecto.id);
  } catch (err) {
    console.error("Error al actualizar el proyecto. ID:", proyecto.id, err);
  }
}

async function actualizarNota(nota: TNotas): Promise<void> {
  try {
    const notaExistente = await knex('notas')
      .where('id', nota.id)
      .first();

    if (!notaExistente) {
      console.log('No se ha encontrado la nota con ID:', nota.id);
      return;
    }

    await knex('notas')
      .where('id', nota.id)
      .update({
        nota: nota.nota,
      });

    console.log('Nota actualizada con éxito. ID:', nota.id);
  } catch (err) {
    console.error('Error al intentar actualizar la nota. ID:', nota.id, err);
  }
}

export async function actualizarEstadoPartenariado(partenariado: tPartenariado): Promise<void> {
  try {
    const partenariadoExistente = await knex('partenariado')
      .where('id', partenariado.id)
      .first();

    if (!partenariadoExistente) {
      console.log('No se ha encontrado el partenariado con ID:', partenariado.id);
      return;
    }

    await knex('partenariado')
      .where('id', partenariado.id)
      .update({
        estado: partenariado.status,
      });

    console.log('Estado de partenariado actualizado con éxito. ID:', partenariado.id);
  } catch (err) {
    console.error('Error al intentar actualizar el estado de partenariado. ID:', partenariado.id, err);
  }
}

//GET ALL
async function obtenerTodosPartenariados(): Promise<tPartenariado[]> {
  try {
    const datos = await knex("colaboracion")
      .join("partenariado", "colaboracion.id", "=", "partenariado.id")
      .select("*");

    const datos_profesores = await knex("profesor_colaboracion").select("*");

    const transfers = datos.map((partenariado) => {
      const profesores = datos_profesores
        .filter((profesor) => profesor["id_colaboracion"] === partenariado["id"])
        .map((profesor) => profesor["id_profesor"]);

      return {
        id: partenariado["id"],
        titulo: partenariado["titulo"],
        descripcion: partenariado["descripcion"],
        admite_externos: partenariado["admite_externos"],
        responsable: partenariado["responsable"],
        profesores: profesores,
        id_demanda: partenariado["id_demanda"],
        id_oferta: partenariado["id_oferta"],
        status: partenariado["estado"],
      };
    });

    return transfers;
  } catch (err) {
    console.error("Error al obtener todos los partenariados:", err);
    throw err;
  }
}

async function crearPrevioPartenariado(id_demanda: number,id_oferta: number,completado_profesor: boolean,completado_socioComunitario: boolean) :Promise<void> {
  try {
    await knex("previo_partenariado").insert({
      id_demanda,
      id_oferta,
      completado_profesor,
      completado_socioComunitario,
    });
  } catch (err) {
    console.error("Error al crear el previo al partenariado:", err);
    throw err;
  }
}

export async function actualizarPrevioPartenariado(id_demanda: number,id_oferta: number,completado_profesor: boolean,completado_socioComunitario: boolean): Promise<void> {
  try {
    await knex("previo_partenariado")
      .where({ id_demanda, id_oferta })
      .update({
        completado_profesor,
        completado_socioComunitario,
      });
  } catch (err) {
    console.error("Error al actualizar el previo al partenariado:", err);
    throw err;
  }
}

export async function obtenerIdPartenariado(id_demanda: number, id_oferta: number): Promise<number | null> {
  try {
    const result = await knex('partenariado')
      .where({ id_demanda, id_oferta })
      .select('id')
      .first();

    return result ? result.id : null;
  } catch (err) {
    console.error("Error al obtener ID de partenariado:", err);
    throw err;
  }
}




  