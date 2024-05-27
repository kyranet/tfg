CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_partnership AS
SELECT
	colaboracion.id as `id`,
	colaboracion.titulo as `title`,
	colaboracion.descripcion as `description`,
	colaboracion.imagen as `image`,
	colaboracion.admite_externos as `acceptsExternals`,
	colaboracion.responsable as `managerId`,
	p.estado as `status`,
	p.url as `url`,
	pa.estado as `partnershipStatus`,
	os.observaciones_temporales as `offerTemporaryObservations`,
	os.fecha_limite as `offerDeadline`,
	os.cuatrimestre as `offerQuarter`,
	os.anio_academico as `offerAcademicYear`,
	sc.id as `offerCreatorId`,
	sc.nombre_socioComunitario as `offerCreatorName`,
	ds.observaciones_temporales as `demandTemporaryObservations`,
	ds.creador as `demandCreatorId`,
	ds.ciudad as `demandCity`,
	ds.finalidad as `demandPurpose`,
	ds.comunidad_beneficiaria as `demandBeneficiaryCommunity`,
	ds.periodo_definicion_ini as `demandDefinitionPeriodStart`,
	ds.periodo_definicion_fin as `demandDefinitionPeriodEnd`,
	ds.periodo_ejecucion_ini as `demandExecutionPeriodStart`,
	ds.periodo_ejecucion_fin as `demandExecutionPeriodEnd`,
	ds.fecha_fin as `demandEndDate`,
	ds.necesidad_social as `demandSocialNeedId`,
	(
		SELECT JSON_ARRAYAGG(JSON_OBJECT(
			'id', e.id,
			'firstName', COALESCE(dpi.nombre, dpe.nombre),
			'lastName', COALESCE(dpi.apellidos, dpe.apellidos)))
		FROM estudiante_proyecto ep
			INNER JOIN estudiante e ON ep.id_estudiante = e.id
			LEFT JOIN (
				estudiante_interno ei
				INNER JOIN aps.datos_personales_interno dpi ON ei.datos_personales_Id = dpi.id
			) ON e.id = ei.id
			LEFT JOIN (
				estudiante_externo ee
				INNER JOIN aps.datos_personales_externo dpe ON ee.datos_personales_Id = dpe.id
			) ON e.id = ee.id
		WHERE ep.id_proyecto = p.id
	) as `students`,
	(
		SELECT JSON_ARRAYAGG(JSON_OBJECT(
			'id', pf.id,
			'firstName', COALESCE(dpi.nombre, dpe.nombre),
			'lastName', COALESCE(dpi.apellidos, dpe.apellidos)))
		FROM profesor_colaboracion pc
			INNER JOIN profesor pf ON pc.id_profesor = p.id
			LEFT JOIN (
				profesor_interno pi
				INNER JOIN aps.datos_personales_interno dpi ON pi.datos_personales_Id = dpi.id
			) ON pf.id = pi.id
			LEFT JOIN (
				profesor_externo pe
				INNER JOIN aps.datos_personales_externo dpe ON pe.datos_personales_Id = dpe.id
			) ON pf.id = pe.id
		WHERE pc.id_colaboracion = colaboracion.id
	) as `professors`
FROM colaboracion
INNER JOIN proyecto p ON colaboracion.id = p.id
INNER JOIN partenariado pa ON colaboracion.id = pa.id
INNER JOIN oferta_servicio os ON pa.id_oferta = os.id
INNER JOIN demanda_servicio ds ON pa.id_demanda = ds.id
INNER JOIN socio_comunitario sc ON ds.creador = sc.id;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_demand AS
SELECT
    demanda.id,
    demanda.ciudad as `city`,
    demanda.finalidad as `purpose`,
    demanda.periodo_definicion_ini as `periodDefinitionStart`,
    demanda.periodo_definicion_fin as `periodDefinitionEnd`,
    demanda.periodo_ejecucion_ini as `periodEjecutionStart`,
    demanda.periodo_ejecucion_ini as `periodEjecutionEnd`,
    demanda.fecha_fin as `periodDeadline`,
    demanda.observaciones_temporales as `temporaryObservations`,
    demanda.comunidad_beneficiaria as `beneficiaryCommunity`,
    anuncio.titulo as `title`,
    anuncio.descripcion as `description`,
    anuncio.created_at as `createdAt`,
    anuncio.updated_at as `updatedAt`,
    anuncio.imagen as `image`,
    ns.id as `socialNeedId`,
    ns.nombre as `socialNeedName`,
    sc.id as `creatorId`,
    sc.nombre_socioComunitario as `creatorName`,
    sc.mision as `creatorMission`,
    sc.sector as `creatorSector`,
    sc.url as `creatorUrl`,
    u.origin_img as `creatorAvatar`,
    (
        SELECT COALESCE(JSON_ARRAYAGG(sa.nombre), JSON_ARRAY())
        FROM areaservicio_anuncioservicio sa_sa
        INNER JOIN area_servicio sa ON sa_sa.id_area = sa.id
        WHERE sa_sa.id_anuncio = anuncio.id
    ) as `serviceAreas`,
    (
        SELECT COALESCE(JSON_ARRAYAGG(tl.nombre), JSON_ARRAY())
        FROM titulacionlocal_demanda degree
        INNER JOIN titulacion_local tl on degree.id_titulacion = tl.id
        WHERE degree.id_demanda = demanda.id
    ) as `degrees`
FROM demanda_servicio demanda
INNER JOIN anuncio_servicio anuncio ON demanda.id = anuncio.id
INNER JOIN necesidad_social ns ON demanda.necesidad_social = ns.id
INNER JOIN socio_comunitario sc ON demanda.creador = sc.id
INNER JOIN usuario u on sc.id = u.id;
