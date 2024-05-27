CREATE OR REPLACE SQL SECURITY INVOKER VIEW view_service_offer AS
SELECT
    so.id,
    so.anio_academico as `academicYear`,
    so.observaciones_temporales as `remarks`,
    so.cuatrimestre as `quarter`,
    so.fecha_limite as `deadline`,
    sa.imagen as `image`,
    sa.titulo as `title`,
    sa.descripcion as `description`,
    sa.created_at as `createdAt`,
    sa.updated_at as `updatedAt`,
    JSON_OBJECT(
        'id', creator.id,
        'firstName', creator.firstName,
        'lastName', creator.lastName,
        'avatar', creator.avatar
    ) as `creator`,
    (
        SELECT COALESCE(JSON_ARRAYAGG(service.nombre), JSON_ARRAY())
        FROM areaservicio_anuncioservicio service_sa
        INNER JOIN area_servicio service ON service_sa.id_area = service.id
        WHERE service_sa.id_anuncio = sa.id
    ) as `services`,
    (
        SELECT COALESCE(JSON_ARRAYAGG(a.nombre), JSON_ARRAY())
        FROM asignatura a
        WHERE a.id_oferta = so.id
    ) as `subjects`,
    (
        SELECT COALESCE(JSON_ARRAYAGG(t.nombre), JSON_ARRAY())
        FROM oferta_demanda_tags so_tags
        INNER JOIN tags t on so_tags.tag_id = t.id
        WHERE so_tags.object_id = so.id
    ) as `tags`,
    (
        SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
            'id', dpi.id,
            'firstName', dpi.nombre,
            'lastName', dpi.apellidos,
            'avatar', u.origin_img
        )), JSON_ARRAY())
        FROM profesorinterno_oferta ip_so
        INNER JOIN profesor_interno ip ON ip_so.id_profesor = ip.id
        INNER JOIN profesor p ON ip.id = p.id
        INNER JOIN usuario u ON p.id = u.id
        INNER JOIN datos_personales_interno dpi ON ip.datos_personales_Id = dpi.id
        WHERE ip_so.id_oferta = so.id
    ) as `professors`
FROM oferta_servicio so
INNER JOIN anuncio_servicio sa ON sa.id = so.id
INNER JOIN view_user creator ON creator.id = so.creador;
