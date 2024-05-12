import { Colaboracion } from '../Colaboracion';
import { DatosPersonalesExterno } from '../DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../DatosPersonalesInterno';
import { DemandaServicio } from '../DemandaServicio';
import { Estudiante } from '../Estudiante';
import { EstudianteInterno } from '../EstudianteInterno';
import { OfertaServicio } from '../OfertaServicio';
import { Partenariado } from '../Partenariado';
import { Profesor } from '../Profesor';
import { Proyecto } from '../Proyecto';
import { SocioComunitario } from '../SocioComunitario';
import { makeKeyFunction } from '../base/Shared';

export namespace ViewPartnership {
	export const Name = 'view_partnership';
	export const Key = makeKeyFunction(Name);

	export interface Value {
		id: Colaboracion.Value['id'];
		title: Colaboracion.Value['titulo'];
		description: Colaboracion.Value['descripcion'];
		image: Colaboracion.Value['imagen'];
		acceptsExternals: Colaboracion.Value['admite_externos'];
		managerId: Colaboracion.Value['responsable'];
		status: Proyecto.Value['estado'];
		url: Proyecto.Value['url'];
		partnershipStatus: Partenariado.Value['estado'];
		offerTemporaryObservations: OfertaServicio.Value['observaciones_temporales'];
		offerDeadline: OfertaServicio.Value['fecha_limite'];
		offerQuarter: OfertaServicio.Value['cuatrimestre'];
		offerAcademicYear: OfertaServicio.Value['anio_academico'];
		offerCreatorId: SocioComunitario.Value['id'];
		offerCreatorName: SocioComunitario.Value['nombre_socioComunitario'];
		demandTemporaryObservations: DemandaServicio.Value['observaciones_temporales'];
		demandCreatorId: DemandaServicio.Value['creador'];
		demandCity: DemandaServicio.Value['ciudad'];
		demandPurpose: DemandaServicio.Value['finalidad'];
		demandBeneficiaryCommunity: DemandaServicio.Value['comunidad_beneficiaria'];
		demandDefinitionPeriodStart: DemandaServicio.Value['periodo_definicion_ini'];
		demandDefinitionPeriodEnd: DemandaServicio.Value['periodo_definicion_fin'];
		demandExecutionPeriodStart: DemandaServicio.Value['periodo_ejecucion_ini'];
		demandExecutionPeriodEnd: DemandaServicio.Value['periodo_ejecucion_fin'];
		demandEndDate: DemandaServicio.Value['fecha_fin'];
		demandSocialNeedId: DemandaServicio.Value['necesidad_social'];
		students: {
			id: Estudiante.Value['id'];
			firstName: DatosPersonalesInterno.Value['nombre'] | DatosPersonalesExterno.Value['nombre'];
			lastName: DatosPersonalesInterno.Value['apellidos'] | DatosPersonalesExterno.Value['apellidos'];
		}[];
		professors: {
			id: Profesor.Value['id'];
			firstName: DatosPersonalesInterno.Value['nombre'] | DatosPersonalesExterno.Value['nombre'];
			lastName: DatosPersonalesInterno.Value['apellidos'] | DatosPersonalesExterno.Value['apellidos'];
		}[];
	}
}
