CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification AS
SELECT
	n.id,
	n.idDestino as `userId`,
	n.leido as `read`,
	n.titulo as `title`,
	n.mensaje as `message`,
	n.fecha_fin as `endDate`,
	n.pendiente as `pending`,
	CASE
		WHEN aa.idNotificacion IS NOT NULL THEN JSON_OBJECT (
			'type', 'ConfirmationAccepted',
			'accepted', aa.idNotificacionAceptada,
			'partnership', JSON_OBJECT (
				'id', aa_p.id,
				'offerId', aa_p.id_oferta,
				'demandId', aa_p.id_demanda,
				'status', aa_p.estado
			)
		)
		WHEN ar.idNotificacion IS NOT NULL THEN JSON_OBJECT (
			'type', 'ConfirmationRejected',
			'associateId', oa.idSocio,
			'offer', JSON_OBJECT (
				'id', oa_os.id,
				'creatorId', oa_os.creador,
				'quarter', oa_os.cuatrimestre,
				'academicYear', oa_os.anio_academico,
				'deadline', oa_os.fecha_limite,
				'temporaryRemarks', oa_os.observaciones_temporales
			)
		)
		WHEN dr.idNotificacion IS NOT NULL THEN JSON_OBJECT (
			'type', 'DemandBacked',
			'partnership', JSON_OBJECT (
				'id', dr_p.id,
				'offerId', dr_p.id_oferta,
				'demandId', dr_p.id_demanda,
				'status', dr_p.estado
			)
		)
		WHEN nm.idNotificacion IS NOT NULL THEN JSON_OBJECT (
			'type', 'MatchingNotification',
			'demand', JSON_OBJECT (
				'id', nm_dm.id_demanda,
				'processed', nm_dm.procesado,
				'score', nm_dm.emparejamiento
			),
			'offer', JSON_OBJECT (
				'id', nm_om.id_demanda,
				'processed', nm_om.procesado,
				'score', nm_om.emparejamiento
			)
		)
		WHEN oa.idNotificacion IS NOT NULL THEN JSON_OBJECT (
			'type', 'OfferAccepted',
			'associateId', oa.idSocio,
			'offer', JSON_OBJECT (
				'id', oa_os.id,
				'creatorId', oa_os.creador,
				'quarter', oa_os.cuatrimestre,
				'academicYear', oa_os.anio_academico,
				'deadline', oa_os.fecha_limite,
				'temporaryRemarks', oa_os.observaciones_temporales
			)
		)
		WHEN pr.idNotificacion IS NOT NULL THEN JSON_OBJECT (
			'type', 'PartnershipFilled',
			'partnership', JSON_OBJECT (
				'id', pr_p.id,
				'offerId', pr_p.id_oferta,
				'demandId', pr_p.id_demanda,
				'status', pr_p.estado
			)
		)
	END as `data`
FROM
	notificaciones n
	LEFT JOIN (
		aceptacionaceptada aa
		INNER JOIN partenariado aa_p on aa.idPartenariado = aa_p.id
	) ON n.id = aa.idNotificacion
	LEFT JOIN aceptacionrechazado ar ON n.id = ar.idNotificacion
	LEFT JOIN (
		demandarespalda dr
		INNER JOIN partenariado dr_p on dr.idPartenariado = dr_p.id
	) ON n.id = dr.idNotificacion
	LEFT JOIN (
		notificacionmatching nm
		INNER JOIN matching nm_dm ON nm.idDemanda = nm_dm.id_demanda
		INNER JOIN matching nm_om ON nm.idOferta = nm_om.id_oferta
	) ON n.id = nm.idNotificacion
	LEFT JOIN (
		ofertaaceptada oa
		INNER JOIN oferta_servicio oa_os ON oa.idOferta = oa_os.id
	) ON n.id = oa.idNotificacion
	LEFT JOIN (
		partenariadorellenado pr
		INNER JOIN partenariado pr_p on pr.idPartenariado = pr_p.id
	) ON n.id = pr.idNotificacion;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification_confirmation_accepted AS
SELECT
	notification.id,
	notification.idDestino as `userId`,
	notification.leido as `read`,
	notification.titulo as `title`,
	notification.mensaje as `message`,
	notification.fecha_fin as `endDate`,
	notification.pendiente as `pending`,
	JSON_OBJECT (
		'type', 'ConfirmationAccepted',
		'accepted', confirmation_accepted.idNotificacionAceptada,
		'partnership', JSON_OBJECT (
			'id', partnership.id,
			'offerId', partnership.id_oferta,
			'demandId', partnership.id_demanda,
			'status', partnership.estado
		)
	) as `data`
FROM
	aceptacionaceptada confirmation_accepted
	INNER JOIN notificaciones notification ON confirmation_accepted.idNotificacion = notification.id
	INNER JOIN partenariado partnership on confirmation_accepted.idPartenariado = partnership.id;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification_confirmation_rejected AS
SELECT
	notification.id,
	notification.idDestino as `userId`,
	notification.leido as `read`,
	notification.titulo as `title`,
	notification.mensaje as `message`,
	notification.fecha_fin as `endDate`,
	notification.pendiente as `pending`,
	JSON_OBJECT (
		'type', 'ConfirmationRejected',
		'associateId', accepted_offer.idSocio,
		'offer', JSON_OBJECT (
			'id', offer.id,
			'creatorId', offer.creador,
			'quarter', offer.cuatrimestre,
			'academicYear', offer.anio_academico,
			'deadline', offer.fecha_limite,
			'temporaryRemarks', offer.observaciones_temporales
		)
	) as `data`
FROM
	aceptacionrechazado confirmation_rejected
	INNER JOIN notificaciones notification ON confirmation_rejected.idNotificacion = notification.id
	INNER JOIN ofertaaceptada accepted_offer ON confirmation_rejected.idNotificacionOferta = accepted_offer.idNotificacion
	INNER JOIN oferta_servicio offer ON accepted_offer.idOferta = offer.id;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification_demand_backed AS
SELECT
	notification.id,
	notification.idDestino as `userId`,
	notification.leido as `read`,
	notification.titulo as `title`,
	notification.mensaje as `message`,
	notification.fecha_fin as `endDate`,
	notification.pendiente as `pending`,
	JSON_OBJECT (
		'type', 'DemandBacked',
		'partnership', JSON_OBJECT (
			'id', partnership.id,
			'offerId', partnership.id_oferta,
			'demandId', partnership.id_demanda,
			'status', partnership.estado
		)
	) as `data`
FROM
	demandarespalda demand_backed
	INNER JOIN notificaciones notification ON demand_backed.idNotificacion = notification.id
	INNER JOIN partenariado partnership on demand_backed.idPartenariado = partnership.id;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification_matching_notification AS
SELECT
	notification.id,
	notification.idDestino as `userId`,
	notification.leido as `read`,
	notification.titulo as `title`,
	notification.mensaje as `message`,
	notification.fecha_fin as `endDate`,
	notification.pendiente as `pending`,
	JSON_OBJECT (
		'type', 'MatchingNotification',
		'demand', JSON_OBJECT (
			'id', matching_demand.id_demanda,
			'processed', matching_demand.procesado,
			'score', matching_demand.emparejamiento
		),
		'offer', JSON_OBJECT (
			'id', matching_offer.id_demanda,
			'processed', matching_offer.procesado,
			'score', matching_offer.emparejamiento
		)
	) as `data`
FROM
	notificacionmatching matching_notification
	INNER JOIN notificaciones notification ON matching_notification.idNotificacion = notification.id
	INNER JOIN matching matching_demand on matching_notification.idDemanda = matching_demand.id_demanda
	INNER JOIN matching matching_offer on matching_notification.idOferta = matching_offer.id_oferta;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification_offer_accepted AS
SELECT
	notification.id,
	notification.idDestino as `userId`,
	notification.leido as `read`,
	notification.titulo as `title`,
	notification.mensaje as `message`,
	notification.fecha_fin as `endDate`,
	notification.pendiente as `pending`,
	JSON_OBJECT (
		'type', 'OfferAccepted',
		'associateId', offer_accepted.idSocio,
		'offer', JSON_OBJECT (
			'id', offer.id,
			'creatorId', offer.creador,
			'quarter', offer.cuatrimestre,
			'academicYear', offer.anio_academico,
			'deadline', offer.fecha_limite,
			'temporaryRemarks', offer.observaciones_temporales
		)
	) as `data`
FROM
	ofertaaceptada offer_accepted
	INNER JOIN notificaciones notification ON offer_accepted.idNotificacion = notification.id
	INNER JOIN oferta_servicio offer on offer_accepted.idOferta = offer.id;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_notification_partnership_filled AS
SELECT
	notification.id,
	notification.idDestino as `userId`,
	notification.leido as `read`,
	notification.titulo as `title`,
	notification.mensaje as `message`,
	notification.fecha_fin as `endDate`,
	notification.pendiente as `pending`,
	JSON_OBJECT (
		'type', 'PartnershipFilled',
		'partnership', JSON_OBJECT (
			'id', partnership.id,
			'offerId', partnership.id_oferta,
			'demandId', partnership.id_demanda,
			'status', partnership.estado
		)
	) as `data`
FROM
	partenariadorellenado partnership_filled
	INNER JOIN notificaciones notification ON partnership_filled.idNotificacion = notification.id
	INNER JOIN partenariado partnership on partnership_filled.idPartenariado = partnership.id;
