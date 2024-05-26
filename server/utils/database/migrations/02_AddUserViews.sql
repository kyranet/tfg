CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user AS
SELECT
	user.id,
	user.createdAt,
	user.origin_img as `avatar`,
	COALESCE(dpi.nombre, dpe.nombre) as firstName,
	COALESCE(dpi.apellidos, dpe.apellidos) as lastName,
	COALESCE(dpi.telefono, dpe.telefono) as phone,
	COALESCE(dpi.correo, dpe.correo) as email,
	CASE
		WHEN a.id IS NOT NULL THEN JSON_OBJECT ('role', 'Admin')
		WHEN pi.id IS NOT NULL THEN JSON_OBJECT (
			'role', 'InternalProfessor',
			'knowledgeAreas', COALESCE((
				SELECT JSON_ARRAYAGG(acp.id_area)
				FROM areaconocimiento_profesor acp
				WHERE acp.id_profesor = p.id
			), JSON_ARRAY()),
			'degrees', COALESCE((
				SELECT JSON_ARRAYAGG(tl_pi.id_titulacion)
				FROM titulacionlocal_profesor tl_pi
				WHERE tl_pi.id_profesor = p.id
			), JSON_ARRAY())
		)
		WHEN pe.id IS NOT NULL THEN JSON_OBJECT (
			'role', 'ExternalProfessor',
			'university', pe.universidad,
			'faculty', pe.facultad,
			'knowledgeAreas', COALESCE((
				SELECT JSON_ARRAYAGG(acp.id_area)
				FROM areaconocimiento_profesor acp
				WHERE acp.id_profesor = p.id
			), JSON_ARRAY())
		)
		WHEN ei.id IS NOT NULL THEN JSON_OBJECT (
			'role', 'InternalStudent',
			'degree', ei.titulacion_local
		)
		WHEN ee.id IS NOT NULL THEN JSON_OBJECT (
			'role', 'ExternalStudent',
			'degree', ee.titulacion,
			'university', ee.universidad
		)
		WHEN oa.id IS NOT NULL THEN JSON_OBJECT ('role', 'ApSOffice')
		WHEN sc.id IS NOT NULL THEN JSON_OBJECT (
			'role', 'CommunityPartner',
			'mission', sc.mision,
			'name', sc.nombre_socioComunitario,
			'sector', sc.sector,
			'url', sc.url
		)
		WHEN t.id IS NOT NULL THEN JSON_OBJECT ('role', 'Tutor')
		WHEN c.id IS NOT NULL THEN JSON_OBJECT (
			'role', 'Collaborator',
			'university', c.universidad,
			'faculty', c.facultad
		)
	END as `data`
FROM
	usuario user
	LEFT JOIN admin a ON user.id = a.id
	LEFT JOIN profesor p ON user.id = p.id
	LEFT JOIN profesor_interno pi ON p.id = pi.id
	LEFT JOIN profesor_externo pe ON p.id = pe.id
	LEFT JOIN estudiante e ON user.id = e.id
	LEFT JOIN estudiante_interno ei ON e.id = ei.id
	LEFT JOIN estudiante_externo ee ON e.id = ee.id
	LEFT JOIN oficinaaps oa ON user.id = oa.id
	LEFT JOIN socio_comunitario sc ON user.id = sc.id
	LEFT JOIN tutor t ON user.id = t.id
	LEFT JOIN colaborador c ON user.id = c.id
	LEFT JOIN datos_personales_interno dpi ON COALESCE(
		a.datos_personales_Id,
		pi.datos_personales_Id,
		ei.datos_personales_Id,
		oa.datos_personales_Id,
		t.datos_personales_Id
	) = dpi.id
	LEFT JOIN datos_personales_externo dpe ON COALESCE(
		pe.datos_personales_Id,
		ee.datos_personales_Id,
		sc.datos_personales_Id,
		c.datos_personales_Id
	) = dpe.id;

-- Admin
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_admin AS
SELECT
	user.id,
	user.createdAt,
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'Admin' as `role`
FROM
	admin
	INNER JOIN usuario user ON admin.id = user.id
	INNER JOIN datos_personales_interno user_data ON admin.datos_personales_Id = user_data.id;

-- Internal Professor
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_internal_professor AS
SELECT
	user.id,
	user.createdAt,
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'InternalProfessor' as `role`,
	COALESCE((
		SELECT JSON_ARRAYAGG(acp.id_area)
		FROM areaconocimiento_profesor acp
		WHERE acp.id_profesor = professor.id
	), JSON_ARRAY()) as `knowledgeAreas`,
    COALESCE((
        SELECT JSON_ARRAYAGG(tl_pi.id_titulacion)
        FROM titulacionlocal_profesor tl_pi
        WHERE tl_pi.id_profesor = internal_professor.id
    ), JSON_ARRAY()) as `degrees`
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
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'ExternalProfessor' as `role`,
	external_professor.universidad as `university`,
	external_professor.facultad as `faculty`,
	COALESCE((
		SELECT JSON_ARRAYAGG(acp.id_area)
		FROM areaconocimiento_profesor acp
		WHERE acp.id_profesor = professor.id
	), JSON_ARRAY()) as `knowledgeAreas`
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
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'InternalStudent' as `role`,
	internal_student.titulacion_local as `degree`
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
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'ExternalStudent' as `role`,
	external_student.titulacion as `degree`,
	external_student.universidad as `university`
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
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'ApSOffice' as `role`
FROM
	oficinaaps office
	INNER JOIN usuario user ON office.id = user.id
	INNER JOIN datos_personales_interno user_data ON office.datos_personales_Id = user_data.id;

-- Community Partner
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_community_partner AS
SELECT
	user.id,
	user.createdAt,
	user.origin_img as `avatar`,
	dpe.nombre as `firstName`,
	dpe.apellidos as `lastName`,
	dpe.telefono as `phone`,
	dpe.correo as `email`,
	'CommunityPartner' as `role`,
	sc.mision as `mission`,
	sc.nombre_socioComunitario as `name`,
	sc.sector as `sector`,
	sc.url as `url`
FROM
	usuario user
	INNER JOIN socio_comunitario sc ON user.id = sc.id
	INNER JOIN datos_personales_externo dpe ON sc.datos_personales_Id = dpe.id;

-- Internal Tutor
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_tutor AS
SELECT
	user.id,
	user.createdAt,
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'Tutor' as `role`
FROM
	tutor
	INNER JOIN profesor professor ON tutor.id = professor.id
	INNER JOIN usuario user ON professor.id = user.id
	INNER JOIN datos_personales_interno user_data ON tutor.datos_personales_Id = user_data.id;

-- Collaborator
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_collaborator AS
SELECT
	user.id,
	user.createdAt,
	user.origin_img as `avatar`,
	user_data.nombre as `firstName`,
	user_data.apellidos as `lastName`,
	user_data.telefono as `phone`,
	user_data.correo as `email`,
	'Collaborator' as `role`,
	collaborator.universidad as `university`,
	collaborator.facultad as `faculty`
FROM
	colaborador collaborator
	INNER JOIN profesor professor ON collaborator.id = professor.id
	INNER JOIN usuario user ON professor.id = user.id
	INNER JOIN datos_personales_externo user_data ON collaborator.datos_personales_Id = user_data.id;


-- Privileged view to get users with the password, please do **NOT** use this
-- view in the application outside of the authentication process.
CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_user_privileged AS
SELECT
	user.id,
	user.origin_img as `avatar`,
	COALESCE(dpi.correo, dpe.correo) as `email`,
	COALESCE(dpi.nombre, dpe.nombre) as `firstName`,
	COALESCE(dpi.apellidos, dpe.apellidos) as `lastName`,
	COALESCE(dpi.password, dpe.password) as `password`,
	CASE
		WHEN a.id IS NOT NULL THEN 'Admin'
		WHEN pi.id IS NOT NULL THEN 'InternalProfessor'
		WHEN pe.id IS NOT NULL THEN 'ExternalProfessor'
		WHEN ei.id IS NOT NULL THEN 'InternalStudent'
		WHEN ee.id IS NOT NULL THEN 'ExternalStudent'
		WHEN oa.id IS NOT NULL THEN 'ApSOffice'
		WHEN sc.id IS NOT NULL THEN 'CommunityPartner'
		WHEN t.id IS NOT NULL THEN 'Tutor'
		WHEN c.id IS NOT NULL THEN 'Collaborator'
	END as `role`
FROM
	usuario user
	LEFT JOIN admin a ON user.id = a.id
	LEFT JOIN profesor p ON user.id = p.id
	LEFT JOIN profesor_interno pi ON p.id = pi.id
	LEFT JOIN profesor_externo pe ON p.id = pe.id
	LEFT JOIN estudiante e ON user.id = e.id
	LEFT JOIN estudiante_interno ei ON e.id = ei.id
	LEFT JOIN estudiante_externo ee ON e.id = ee.id
	LEFT JOIN oficinaaps oa ON user.id = oa.id
	LEFT JOIN socio_comunitario sc ON user.id = sc.id
	LEFT JOIN tutor t ON user.id = t.id
	LEFT JOIN colaborador c ON user.id = c.id
	LEFT JOIN datos_personales_interno dpi ON COALESCE(
		a.datos_personales_Id,
		pi.datos_personales_Id,
		ei.datos_personales_Id,
		oa.datos_personales_Id,
		t.datos_personales_Id
	) = dpi.id
	LEFT JOIN datos_personales_externo dpe ON COALESCE(
		pe.datos_personales_Id,
		ee.datos_personales_Id,
		sc.datos_personales_Id,
		c.datos_personales_Id
	) = dpe.id;
