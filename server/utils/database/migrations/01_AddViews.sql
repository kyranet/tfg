CREATE
OR REPLACE SQL SECURITY INVOKER VIEW user_any AS
SELECT
	usuario.id,
	usuario.createdAt,
	COALESCE(dpi.nombre, dpe.nombre) as firstName,
	COALESCE(dpi.apellidos, dpe.apellidos) as lastName,
	COALESCE(dpi.telefono, dpe.telefono) as phone,
	COALESCE(dpi.correo, dpe.correo) as email,
	CASE
		WHEN a.id IS NOT NULL THEN JSON_OBJECT ('type', 'Admin')
		WHEN pi.id IS NOT NULL THEN JSON_OBJECT ('type', 'InternalProfessor')
		WHEN pe.id IS NOT NULL THEN JSON_OBJECT (
			'type', 'ExternalProfessor',
			'university', pe.universidad,
			'faculty', pe.facultad
		)
		WHEN ei.id IS NOT NULL THEN JSON_OBJECT (
			'type', 'InternalStudent',
			'degree', ei.titulacion_local
		)
		WHEN ee.id IS NOT NULL THEN JSON_OBJECT (
			'type', 'ExternalStudent',
			'degree', ee.titulacion,
			'university', ee.universidad
		)
		WHEN oa.id IS NOT NULL THEN JSON_OBJECT ('type', 'ApSOffice')
		WHEN sc.id IS NOT NULL THEN JSON_OBJECT (
			'type', 'CommunityPartner',
			'mission', sc.mision,
			'name', sc.nombre_socioComunitario,
			'sector', sc.sector,
			'url', sc.url
		)
	END as user
FROM
	usuario
	LEFT JOIN aps.admin a ON usuario.id = a.id
	LEFT JOIN aps.profesor p ON usuario.id = p.id
	LEFT JOIN aps.profesor_interno pi ON p.id = pi.id
	LEFT JOIN aps.profesor_externo pe ON p.id = pe.id
	LEFT JOIN aps.estudiante e ON usuario.id = e.id
	LEFT JOIN aps.estudiante_interno ei ON e.id = ei.id
	LEFT JOIN aps.estudiante_externo ee ON e.id = ee.id
	LEFT JOIN aps.oficinaaps oa ON usuario.id = oa.id
	LEFT JOIN aps.socio_comunitario sc ON usuario.id = sc.id
	LEFT JOIN aps.datos_personales_interno dpi ON COALESCE(
		a.datos_personales_Id,
		pi.datos_personales_Id,
		ei.datos_personales_Id,
		oa.datos_personales_Id
	) = dpi.id
	LEFT JOIN aps.datos_personales_externo dpe ON COALESCE(
		pe.datos_personales_Id,
		ee.datos_personales_Id,
		sc.datos_personales_Id
	) = dpe.id;
