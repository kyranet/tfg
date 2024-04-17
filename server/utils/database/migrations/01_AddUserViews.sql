CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user AS
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
	LEFT JOIN admin a ON usuario.id = a.id
	LEFT JOIN profesor p ON usuario.id = p.id
	LEFT JOIN profesor_interno pi ON p.id = pi.id
	LEFT JOIN profesor_externo pe ON p.id = pe.id
	LEFT JOIN estudiante e ON usuario.id = e.id
	LEFT JOIN estudiante_interno ei ON e.id = ei.id
	LEFT JOIN estudiante_externo ee ON e.id = ee.id
	LEFT JOIN oficinaaps oa ON usuario.id = oa.id
	LEFT JOIN socio_comunitario sc ON usuario.id = sc.id
	LEFT JOIN datos_personales_interno dpi ON COALESCE(
		a.datos_personales_Id,
		pi.datos_personales_Id,
		ei.datos_personales_Id,
		oa.datos_personales_Id
	) = dpi.id
	LEFT JOIN datos_personales_externo dpe ON COALESCE(
		pe.datos_personales_Id,
		ee.datos_personales_Id,
		sc.datos_personales_Id
	) = dpe.id;

-- Admin
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_admin AS
SELECT
	user.id,
	user.createdAt,
	user_data.nombre as firstName,
	user_data.apellidos as lastName,
	user_data.telefono as phone,
	user_data.correo as email,
	JSON_OBJECT ('type', 'Admin') as user
FROM
	admin
	INNER JOIN usuario user ON admin.id = user.id
	INNER JOIN datos_personales_interno user_data ON admin.datos_personales_Id = user_data.id;

-- Internal Professor
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_internal_professor AS
SELECT
	user.id,
	user.createdAt,
	user_data.nombre as firstName,
	user_data.apellidos as lastName,
	user_data.telefono as phone,
	user_data.correo as email,
	JSON_OBJECT ('type', 'InternalProfessor') as user
FROM
	profesor_interno internal_professor
	INNER JOIN profesor professor ON internal_professor.id = professor.id
	INNER JOIN usuario user ON professor.id = user.id
	INNER JOIN datos_personales_interno user_data ON internal_professor.datos_personales_Id = user_data.id;

-- External Professor
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_external_professor AS
SELECT
	user.id,
	user.createdAt,
	user_data.nombre as firstName,
	user_data.apellidos as lastName,
	user_data.telefono as phone,
	user_data.correo as email,
	JSON_OBJECT (
		'type', 'ExternalProfessor',
		'university', external_professor.universidad,
		'faculty', external_professor.facultad
	) as user
FROM
	profesor_externo external_professor
	INNER JOIN profesor professor ON external_professor.id = professor.id
	INNER JOIN usuario user ON professor.id = user.id
	INNER JOIN datos_personales_externo user_data ON external_professor.datos_personales_Id = user_data.id;

-- Internal Student
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_internal_student AS
SELECT
	user.id,
	user.createdAt,
	user_data.nombre as firstName,
	user_data.apellidos as lastName,
	user_data.telefono as phone,
	user_data.correo as email,
	JSON_OBJECT (
		'type', 'InternalStudent',
		'degree', internal_student.titulacion_local
	) as user
FROM
	estudiante_interno internal_student
	INNER JOIN estudiante student ON internal_student.id = student.id
	INNER JOIN usuario user ON student.id = user.id
	INNER JOIN datos_personales_interno user_data ON internal_student.datos_personales_Id = user_data.id;

-- External Student
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_external_student AS
SELECT
	user.id,
	user.createdAt,
	user_data.nombre as firstName,
	user_data.apellidos as lastName,
	user_data.telefono as phone,
	user_data.correo as email,
	JSON_OBJECT (
		'type', 'ExternalStudent',
		'degree', external_student.titulacion,
		'university', external_student.universidad
	) as user
FROM
	estudiante_externo external_student
	INNER JOIN estudiante student ON external_student.id = student.id
	INNER JOIN usuario user ON student.id = user.id
	INNER JOIN datos_personales_externo user_data ON external_student.datos_personales_Id = user_data.id;

-- ApS Office
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_aps_office AS
SELECT
	user.id,
	user.createdAt,
	user_data.nombre as firstName,
	user_data.apellidos as lastName,
	user_data.telefono as phone,
	user_data.correo as email,
	JSON_OBJECT ('type', 'ApSOffice') as user
FROM
	oficinaaps office
	INNER JOIN usuario user ON office.id = user.id
	INNER JOIN datos_personales_interno user_data ON office.datos_personales_Id = user_data.id;

-- Community Partner
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_community_partner AS
SELECT
	usuario.id,
	usuario.createdAt,
	dpe.nombre as firstName,
	dpe.apellidos as lastName,
	dpe.telefono as phone,
	dpe.correo as email,
	JSON_OBJECT (
		'type', 'CommunityPartner',
		'mission', sc.mision,
		'name', sc.nombre_socioComunitario,
		'sector', sc.sector,
		'url', sc.url
	) as user
FROM
	usuario
	INNER JOIN socio_comunitario sc ON usuario.id = sc.id
	INNER JOIN datos_personales_externo dpe ON sc.datos_personales_Id = dpe.id;

-- Privileged view to get users with the password, please do **NOT** use this
-- view in the application outside of the authentication process.
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_privileged AS
SELECT
	usuario.id,
	COALESCE(dpi.correo, dpe.correo) as email,
	COALESCE(dpi.nombre, dpe.nombre) as firstName,
	COALESCE(dpi.apellidos, dpe.apellidos) as lastName,
	COALESCE(dpi.password, dpe.password) as password,
	CASE
		WHEN a.id IS NOT NULL THEN 'Admin'
		WHEN pi.id IS NOT NULL THEN 'InternalProfessor'
		WHEN pe.id IS NOT NULL THEN 'ExternalProfessor'
		WHEN ei.id IS NOT NULL THEN 'InternalStudent'
		WHEN ee.id IS NOT NULL THEN 'ExternalStudent'
		WHEN oa.id IS NOT NULL THEN 'ApSOffice'
		WHEN sc.id IS NOT NULL THEN 'CommunityPartner'
	END as rol
FROM
	usuario
	LEFT JOIN admin a ON usuario.id = a.id
	LEFT JOIN profesor p ON usuario.id = p.id
	LEFT JOIN profesor_interno pi ON p.id = pi.id
	LEFT JOIN profesor_externo pe ON p.id = pe.id
	LEFT JOIN estudiante e ON usuario.id = e.id
	LEFT JOIN estudiante_interno ei ON e.id = ei.id
	LEFT JOIN estudiante_externo ee ON e.id = ee.id
	LEFT JOIN oficinaaps oa ON usuario.id = oa.id
	LEFT JOIN socio_comunitario sc ON usuario.id = sc.id
	LEFT JOIN datos_personales_interno dpi ON COALESCE(
		a.datos_personales_Id,
		pi.datos_personales_Id,
		ei.datos_personales_Id,
		oa.datos_personales_Id
	) = dpi.id
	LEFT JOIN datos_personales_externo dpe ON COALESCE(
		pe.datos_personales_Id,
		ee.datos_personales_Id,
		sc.datos_personales_Id
	) = dpe.id;
