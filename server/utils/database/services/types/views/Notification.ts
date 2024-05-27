import type { AceptacionAceptada } from '../AceptacionAceptada';
import type { Matching } from '../Matching';
import type { Notificacion } from '../Notificacion';
import type { OfertaAceptada } from '../OfertaAceptada';
import type { OfertaServicio } from '../OfertaServicio';
import type { Partenariado } from '../Partenariado';

export namespace ViewNotification {
	export const Name = 'view_notification';
	export interface Value<Type extends ValueDataType = ValueDataType> {
		id: Notificacion.Value['id'];
		userId: Notificacion.Value['idDestino'];
		read: Notificacion.Value['leido'];
		title: Notificacion.Value['titulo'];
		message: Notificacion.Value['mensaje'];
		deadline: Notificacion.Value['fecha_fin'];
		pending: Notificacion.Value['pendiente'];
		data: ValueDataOfType<Type>;
	}

	export type ValueData =
		| ConfirmationAccepted //
		| ConfirmationRejected
		| DemandBacked
		| MatchingNotification
		| OfferAccepted
		| PartnershipFilled;

	export type ValueDataType = ValueData['type'];
	export type ValueDataOfType<Type extends ValueDataType> = Extract<ValueData, { type: Type }>;

	export interface ConfirmationAccepted {
		type: 'ConfirmationAccepted';
		accepted: AceptacionAceptada.Value['idNotificacionAceptada'];
		partnership: PartnershipData;
	}

	export interface ConfirmationRejected {
		type: 'ConfirmationRejected';
		associateId: OfertaAceptada.Value['idSocio'];
		offer: OfferData;
	}

	export interface DemandBacked {
		type: 'DemandBacked';
		partnership: PartnershipData;
	}

	export interface MatchingNotification {
		type: 'MatchingNotification';
		demand: MatchingData;
		offer: MatchingData;
	}

	export interface OfferAccepted {
		type: 'OfferAccepted';
		associateId: OfertaAceptada.Value['idSocio'];
		offer: OfferData;
	}

	export interface PartnershipFilled {
		type: 'PartnershipFilled';
		partnership: PartnershipData;
	}

	interface PartnershipData {
		id: Partenariado.Value['id'];
		offerId: Partenariado.Value['id_oferta'];
		demandId: Partenariado.Value['id_demanda'];
		status: Partenariado.Value['estado'];
	}

	interface OfferData {
		id: OfertaServicio.Value['id'];
		creatorId: OfertaServicio.Value['creador'];
		quarter: OfertaServicio.Value['cuatrimestre'];
		academicYear: OfertaServicio.Value['anio_academico'];
		deadline: OfertaServicio.Value['fecha_limite'];
		temporaryRemarks: OfertaServicio.Value['observaciones_temporales'];
	}

	interface MatchingData {
		id: Matching.Value['id_demanda'];
		processed: Matching.Value['procesado'];
		score: Matching.Value['emparejamiento'];
	}
}
