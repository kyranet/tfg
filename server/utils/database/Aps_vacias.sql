
CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `aceptacionaceptada` (
  `idNotificacion` int(11) NOT NULL,
  `idPartenariado` int(11) NOT NULL,
  `idNotificacionAceptada` int(11) NOT NULL,
  PRIMARY KEY (`idNotificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idDestino` int(11) NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `titulo` varchar(200) NOT NULL,
  `mensaje` varchar(1200) NOT NULL,
  `fecha_fin` date NOT NULL DEFAULT '2023-10-17',
  `pendiente` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ofertaaceptada` (
  `idNotificacion` int(11) NOT NULL,
  `idOferta` int(11) NOT NULL,
  `idSocio` int(11) NOT NULL,
  PRIMARY KEY (`idNotificacion`,`idOferta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `aceptacionrechazado` (
  `idNotificacion` int(11) NOT NULL,
  `idNotificacionOferta` int(11) NOT NULL,
  PRIMARY KEY (`idNotificacion`, `idNotificacionOferta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `demandarespalda` (
  `idNotificacion` int(11) NOT NULL,
  `idPartenariado` int(11) NOT NULL,
  PRIMARY KEY (`idNotificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `partenariadorellenado` (
  `idNotificacion` int(11) NOT NULL,
  `idPartenariado` int(11) NOT NULL,
  PRIMARY KEY (`idNotificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notificacionmatching` (
  `idNotificacion` int(11) NOT NULL,
  `idOferta` int(11) NOT NULL,
  `idDemanda` int(11) NOT NULL,
  PRIMARY KEY (`idNotificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura de tabla para la tabla `anuncio_servicio`
--

CREATE TABLE `anuncio_servicio` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` varchar(1200) NOT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `dummy` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `areaconocimiento_profesor` (
  `id_area` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `areaservicio_anuncioservicio` (
  `id_area` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `areaservicio_iniciativa` (
  `id_area` int(11) NOT NULL,
  `id_iniciativa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_conocimiento`
--

CREATE TABLE `area_conocimiento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `area_servicio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `asignatura` (
  `id_oferta` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `colaboracion` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` varchar(1200) NOT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `admite_externos` tinyint(1) NOT NULL DEFAULT 0,
  `responsable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `datos_personales_externo` (
  `id` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `telefono` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `datos_personales_interno` (
  `id` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `telefono` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `demanda_servicio` (
  `id` int(11) NOT NULL,
  `creador` int(11) NOT NULL,
  `ciudad` varchar(200) NOT NULL,
  `finalidad` varchar(200) NOT NULL,
  `periodo_definicion_ini` date DEFAULT NULL,
  `periodo_definicion_fin` date DEFAULT NULL,
  `periodo_ejecucion_ini` date DEFAULT NULL,
  `periodo_ejecucion_fin` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `observaciones_temporales` varchar(1200) DEFAULT NULL,
  `necesidad_social` int(11) NOT NULL,
  `comunidad_beneficiaria` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `estudiante` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `estudiante_externo` (
  `id` int(11) NOT NULL,
  `universidad` int(11) NOT NULL,
  `titulacion` varchar(200) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_interno`
--

CREATE TABLE `estudiante_interno` (
  `id` int(11) NOT NULL,
  `titulacion_local` int(11) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `estudiante_proyecto` (
  `id_estudiante` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `iniciativa`
--

CREATE TABLE `iniciativa` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` varchar(1200) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_demanda` int(11) DEFAULT NULL,
  `necesidad_social` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mail`
--

CREATE TABLE `mail` (
  `id` int(11) NOT NULL,
  `mail_to` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  `mail_name` varchar(200) NOT NULL,
  `mail_from` varchar(200) NOT NULL,
  `subject` varchar(1200) NOT NULL,
  `html` varchar(1200) NOT NULL,
  `_to` varchar(200) NOT NULL,
  `usuario` varchar(200) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matching`
--

CREATE TABLE `matching` (
  `id_oferta` int(11) NOT NULL,
  `id_demanda` int(11) NOT NULL,
  `procesado` tinyint(1) NOT NULL,
  `emparejamiento` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matching_areas`
--

CREATE TABLE `matching_areas` (
  `id` int(11) NOT NULL,
  `area_conocimiento` varchar(200) NOT NULL,
  `area_servicio` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `matching_areaservicio_titulacion` (
  `id` int(11) NOT NULL,
  `area_servicio` varchar(200) NOT NULL,
  `titulacion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id` int(11) NOT NULL,
  `texto` varchar(1200) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje_anuncioservicio`
--

CREATE TABLE `mensaje_anuncioservicio` (
  `id_mensaje` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje_colaboracion`
--

CREATE TABLE `mensaje_colaboracion` (
  `id_mensaje` int(11) NOT NULL,
  `id_colaboracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `necesidad_social`
--

CREATE TABLE `necesidad_social` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura de tabla para la tabla `newsletter`
--

CREATE TABLE `newsletter` (
  `id` int(11) NOT NULL,
  `mail_to` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas`
--

CREATE TABLE `notas` (
  `id` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `nota` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oferta_servicio`
--

CREATE TABLE `oferta_servicio` (
  `id` int(11) NOT NULL,
  `cuatrimestre` int(11) DEFAULT NULL,
  `anio_academico` int(11) DEFAULT NULL,
  `fecha_limite` date DEFAULT NULL,
  `observaciones_temporales` varchar(1200) DEFAULT NULL,
  `creador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura de tabla para la tabla `oficinaaps`
--

CREATE TABLE `oficinaaps` (
  `id` int(11) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partenariado`
--

CREATE TABLE `partenariado` (
  `id` int(11) NOT NULL,
  `id_demanda` int(11),
  `id_oferta` int(11) NOT NULL,
  `estado` enum('EN_NEGOCIACION','ACORDADO','SUSPENDIDO','EN_CREACION') NOT NULL DEFAULT 'EN_CREACION'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `previo_partenariado` (
  `id` int(11) NOT NULL,
  `id_demanda` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL,
  `completado_profesor` tinyint(1) NOT NULL DEFAULT 0,
  `completado_socioComunitario` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `profesor` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `profesorinterno_oferta` (
  `id_profesor` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `profesor_colaboracion` (
  `id_profesor` int(11) NOT NULL,
  `id_colaboracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `profesor_externo` (
  `id` int(11) NOT NULL,
  `universidad` int(11) NOT NULL,
  `facultad` varchar(200) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `profesor_interno` (
  `id` int(11) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `proyecto` (
  `id` int(11) NOT NULL,
  `id_partenariado` int(11) NOT NULL,
  `estado` enum('EN_CREACION','ABIERTO_PROFESORES','ABIERTO_ESTUDIANTES','EN_CURSO','CERRADO') NOT NULL DEFAULT 'EN_CREACION',
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `socio_comunitario` (
  `id` int(11) NOT NULL,
  `sector` varchar(200) NOT NULL,
  `nombre_socioComunitario` varchar(200) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL,
  `url` varchar(200) NOT NULL,
  `mision` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `titulacionlocal_demanda` (
  `id_titulacion` int(11) NOT NULL,
  `id_demanda` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `titulacionlocal_profesor` (
  `id_titulacion` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `titulacion_local` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `universidad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `provincia` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `upload` (
  `id` int(11) NOT NULL,
  `almacenamiento` varchar(200) NOT NULL,
  `tipo` varchar(200) NOT NULL,
  `campo` varchar(200) NOT NULL,
  `tipo_id` varchar(200) NOT NULL,
  `path` varchar(200) NOT NULL,
  `client_name` varchar(200) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `creador` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `_v` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `uploads_colaboracion`
--

CREATE TABLE `uploads_colaboracion` (
  `id_upload` int(11) NOT NULL,
  `id_colaboracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `upload_anuncioservicio`
--

CREATE TABLE `upload_anuncioservicio` (
  `id_upload` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `origin_login` varchar(200) NOT NULL,
  `origin_img` varchar(200) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `terminos_aceptados` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_datos_interno` (`datos_personales_Id`);

--
-- Indices de la tabla `anuncio_servicio`
--
ALTER TABLE `anuncio_servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `areaconocimiento_profesor`
--
ALTER TABLE `areaconocimiento_profesor`
  ADD PRIMARY KEY (`id_area`,`id_profesor`) USING BTREE;

--
-- Indices de la tabla `areaservicio_anuncioservicio`
--
ALTER TABLE `areaservicio_anuncioservicio`
  ADD PRIMARY KEY (`id_area`,`id_anuncio`),
  ADD KEY `area_servicio-anuncio_servicio_ibfk_1` (`id_anuncio`);

--
-- Indices de la tabla `areaservicio_iniciativa`
--
ALTER TABLE `areaservicio_iniciativa`
  ADD PRIMARY KEY (`id_area`,`id_iniciativa`),
  ADD KEY `area_servicio-iniciativa_ibfk_2` (`id_iniciativa`);

--
-- Indices de la tabla `area_conocimiento`
--
ALTER TABLE `area_conocimiento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `area_servicio`
--
ALTER TABLE `area_servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD KEY `id_oferta` (`id_oferta`);

--
-- Indices de la tabla `colaboracion`
--
ALTER TABLE `colaboracion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responsable` (`responsable`) USING BTREE;

--
-- Indices de la tabla `datos_personales_externo`
--
ALTER TABLE `datos_personales_externo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_i` (`correo`);

--
-- Indices de la tabla `datos_personales_interno`
--
ALTER TABLE `datos_personales_interno`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniqu` (`correo`);

--
-- Indices de la tabla `demanda_servicio`
--
ALTER TABLE `demanda_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creador` (`creador`) USING BTREE,
  ADD KEY `necesidad_social` (`necesidad_social`) USING BTREE;

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiante_externo`
--
ALTER TABLE `estudiante_externo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `universidad` (`universidad`) USING BTREE,
  ADD KEY `FK_datos_p_e` (`datos_personales_Id`);

--
-- Indices de la tabla `estudiante_interno`
--
ALTER TABLE `estudiante_interno`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_datos_p_interno2` (`datos_personales_Id`),
  ADD KEY `FK_est_int` (`titulacion_local`);

--
-- Indices de la tabla `estudiante_proyecto`
--
ALTER TABLE `estudiante_proyecto`
  ADD PRIMARY KEY (`id_estudiante`,`id_proyecto`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `iniciativa`
--
ALTER TABLE `iniciativa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_demanda` (`id_demanda`) USING BTREE,
  ADD KEY `id_estudiante` (`id_estudiante`) USING BTREE,
  ADD KEY `necesidad_social` (`necesidad_social`) USING BTREE;

--
-- Indices de la tabla `mail`
--
ALTER TABLE `mail`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `matching`
--
ALTER TABLE `matching`
  ADD PRIMARY KEY (`id_oferta`,`id_demanda`),
  ADD KEY `id_demanda` (`id_demanda`),
  ADD KEY `id_oferta` (`id_oferta`);

--
-- Indices de la tabla `matching_areas`
--
ALTER TABLE `matching_areas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `matching_areaservicio_titulacion`
--
ALTER TABLE `matching_areaservicio_titulacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario` (`usuario`);

--
-- Indices de la tabla `mensaje_anuncioservicio`
--
ALTER TABLE `mensaje_anuncioservicio`
  ADD PRIMARY KEY (`id_mensaje`,`id_anuncio`),
  ADD KEY `id_anuncio` (`id_anuncio`);

--
-- Indices de la tabla `mensaje_colaboracion`
--
ALTER TABLE `mensaje_colaboracion`
  ADD PRIMARY KEY (`id_mensaje`,`id_colaboracion`),
  ADD KEY `id_colaboracion` (`id_colaboracion`);

--
-- Indices de la tabla `necesidad_social`
--
ALTER TABLE `necesidad_social`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notas`
--
ALTER TABLE `notas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estudiante` (`id_estudiante`) USING BTREE,
  ADD KEY `proyecto_notas` (`id_proyecto`) USING BTREE;

--
-- Indices de la tabla `oferta_servicio`
--
ALTER TABLE `oferta_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creador` (`creador`) USING BTREE;

--
-- Indices de la tabla `oficinaaps`
--
ALTER TABLE `oficinaaps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_datos_inter` (`datos_personales_Id`);

--
-- Indices de la tabla `partenariado`
--
ALTER TABLE `partenariado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_demanda` (`id_demanda`) USING BTREE,
  ADD KEY `id_oferta` (`id_oferta`) USING BTREE;

--
-- Indices de la tabla `previo_partenariado`
--
ALTER TABLE `previo_partenariado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_demanda_2` (`id_demanda`,`id_oferta`),
  ADD KEY `id_oferta` (`id_oferta`);

--
-- Indices de la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `profesorinterno_oferta`
--
ALTER TABLE `profesorinterno_oferta`
  ADD PRIMARY KEY (`id_profesor`,`id_oferta`),
  ADD KEY `id_profesor` (`id_profesor`),
  ADD KEY `id_oferta` (`id_oferta`);

--
-- Indices de la tabla `profesor_colaboracion`
--
ALTER TABLE `profesor_colaboracion`
  ADD PRIMARY KEY (`id_profesor`,`id_colaboracion`),
  ADD KEY `profesor_colaboracion_ibfk_1` (`id_colaboracion`);

--
-- Indices de la tabla `profesor_externo`
--
ALTER TABLE `profesor_externo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `universidad` (`universidad`) USING BTREE,
  ADD KEY `FK_datos_p_ex` (`datos_personales_Id`);

--
-- Indices de la tabla `profesor_interno`
--
ALTER TABLE `profesor_interno`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_datos_internos` (`datos_personales_Id`);

--
-- Indices de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_partenariado` (`id_partenariado`) USING BTREE;

--
-- Indices de la tabla `socio_comunitario`
--
ALTER TABLE `socio_comunitario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_datos_int` (`datos_personales_Id`);

--
-- Indices de la tabla `titulacionlocal_demanda`
--
ALTER TABLE `titulacionlocal_demanda`
  ADD PRIMARY KEY (`id_titulacion`,`id_demanda`),
  ADD KEY `titulacion_local-demanda_ibfk_2` (`id_demanda`);

--
-- Indices de la tabla `titulacionlocal_profesor`
--
ALTER TABLE `titulacionlocal_profesor`
  ADD PRIMARY KEY (`id_titulacion`,`id_profesor`),
  ADD KEY `titulacion_local-profesor` (`id_profesor`);

--
-- Indices de la tabla `titulacion_local`
--
ALTER TABLE `titulacion_local`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `universidad`
--
ALTER TABLE `universidad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `upload`
--
ALTER TABLE `upload`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creador` (`creador`);

--
-- Indices de la tabla `uploads_colaboracion`
--
ALTER TABLE `uploads_colaboracion`
  ADD PRIMARY KEY (`id_upload`,`id_colaboracion`),
  ADD KEY `id_upload` (`id_upload`),
  ADD KEY `id_colaboracion` (`id_colaboracion`);

--
-- Indices de la tabla `upload_anuncioservicio`
--
ALTER TABLE `upload_anuncioservicio`
  ADD PRIMARY KEY (`id_upload`,`id_anuncio`),
  ADD KEY `id_upload` (`id_upload`),
  ADD KEY `id_anuncio` (`id_anuncio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `anuncio_servicio`
--
ALTER TABLE `anuncio_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `area_conocimiento`
--
ALTER TABLE `area_conocimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT de la tabla `area_servicio`
--
ALTER TABLE `area_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT de la tabla `colaboracion`
--
ALTER TABLE `colaboracion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `datos_personales_externo`
--
ALTER TABLE `datos_personales_externo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `datos_personales_interno`
--
ALTER TABLE `datos_personales_interno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT de la tabla `iniciativa`
--
ALTER TABLE `iniciativa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `mail`
--
ALTER TABLE `mail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `matching_areas`
--
ALTER TABLE `matching_areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=473;

--
-- AUTO_INCREMENT de la tabla `matching_areaservicio_titulacion`
--
ALTER TABLE `matching_areaservicio_titulacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=328;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `necesidad_social`
--
ALTER TABLE `necesidad_social`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `notas`
--
ALTER TABLE `notas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `previo_partenariado`
--
ALTER TABLE `previo_partenariado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `titulacion_local`
--
ALTER TABLE `titulacion_local`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT de la tabla `universidad`
--
ALTER TABLE `universidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT de la tabla `upload`
--
ALTER TABLE `upload`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;


--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FKEY_Admin` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_datos_interno` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_interno` (`id`);

--
-- Filtros para la tabla `areaconocimiento_profesor`
--
ALTER TABLE `areaconocimiento_profesor`
  ADD CONSTRAINT `area_conoc` FOREIGN KEY (`id_area`) REFERENCES `area_conocimiento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `areaservicio_anuncioservicio`
--
ALTER TABLE `areaservicio_anuncioservicio`
  ADD CONSTRAINT `area_servicio` FOREIGN KEY (`id_area`) REFERENCES `area_servicio` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `area_servicio-anuncio_servicio_ibfk_1` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `areaservicio_iniciativa`
--
ALTER TABLE `areaservicio_iniciativa`
  ADD CONSTRAINT `area_servicio-iniciativa_ibfk_1` FOREIGN KEY (`id_area`) REFERENCES `area_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `area_servicio-iniciativa_ibfk_2` FOREIGN KEY (`id_iniciativa`) REFERENCES `iniciativa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD CONSTRAINT `asignatura_ibfk_1` FOREIGN KEY (`id_oferta`) REFERENCES `oferta_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `colaboracion`
--
ALTER TABLE `colaboracion`
  ADD CONSTRAINT `colaboracion_ibfk_1` FOREIGN KEY (`responsable`) REFERENCES `profesor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `demanda_servicio`
--
ALTER TABLE `demanda_servicio`
  ADD CONSTRAINT `demanda_anuncio` FOREIGN KEY (`id`) REFERENCES `anuncio_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `demanda_servicio_ibfk_1` FOREIGN KEY (`necesidad_social`) REFERENCES `necesidad_social` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `demanda_servicio_ibfk_2` FOREIGN KEY (`creador`) REFERENCES `socio_comunitario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `FKEY_Estudiante` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante_externo`
--
ALTER TABLE `estudiante_externo`
  ADD CONSTRAINT `FKEY_Estudiante_externo` FOREIGN KEY (`id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_datos_p_e` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_externo` (`id`),
  ADD CONSTRAINT `est_uni` FOREIGN KEY (`universidad`) REFERENCES `universidad` (`id`);

--
-- Filtros para la tabla `estudiante_interno`
--
ALTER TABLE `estudiante_interno`
  ADD CONSTRAINT `FKEY_Estudiante_interno` FOREIGN KEY (`id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_datos_p_interno2` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_interno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_est_int` FOREIGN KEY (`titulacion_local`) REFERENCES `titulacion_local` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante_proyecto`
--
ALTER TABLE `estudiante_proyecto`
  ADD CONSTRAINT `estudiante_proyecto_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_proyecto_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `iniciativa`
--
ALTER TABLE `iniciativa`
  ADD CONSTRAINT `iniciativa_ibfk_1` FOREIGN KEY (`necesidad_social`) REFERENCES `necesidad_social` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `iniciativa_ibfk_2` FOREIGN KEY (`id_demanda`) REFERENCES `demanda_servicio` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `iniciativa_ibfk_3` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `matching`
--
ALTER TABLE `matching`
  ADD CONSTRAINT `matching_ibfk_1` FOREIGN KEY (`id_demanda`) REFERENCES `demanda_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `matching_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `oferta_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensaje_anuncioservicio`
--
ALTER TABLE `mensaje_anuncioservicio`
  ADD CONSTRAINT `mensaje_anuncioservicio_ibfk_1` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensaje_anuncioservicio_ibfk_2` FOREIGN KEY (`id_mensaje`) REFERENCES `mensaje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensaje_colaboracion`
--
ALTER TABLE `mensaje_colaboracion`
  ADD CONSTRAINT `mensaje_colaboracion_ibfk_1` FOREIGN KEY (`id_colaboracion`) REFERENCES `colaboracion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensaje_colaboracion_ibfk_2` FOREIGN KEY (`id_mensaje`) REFERENCES `mensaje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notas`
--
ALTER TABLE `notas`
  ADD CONSTRAINT `FKEY_Estudiante_notas` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKEY_proyecto_notas` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `oferta_servicio`
--
ALTER TABLE `oferta_servicio`
  ADD CONSTRAINT `oferta-anuncio` FOREIGN KEY (`id`) REFERENCES `anuncio_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `oferta_servicio_ibfk_1` FOREIGN KEY (`creador`) REFERENCES `profesor_interno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `oficinaaps`
--
ALTER TABLE `oficinaaps`
  ADD CONSTRAINT `FKEY_Oficina` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_datos_inter` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_interno` (`id`);

--
-- Filtros para la tabla `partenariado`
--
ALTER TABLE `partenariado`
  ADD CONSTRAINT `partenariado-colaboracion` FOREIGN KEY (`id`) REFERENCES `colaboracion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partenariado-demanda` FOREIGN KEY (`id_demanda`) REFERENCES `demanda_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partenariado-oferta` FOREIGN KEY (`id_oferta`) REFERENCES `oferta_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `previo_partenariado`
--
ALTER TABLE `previo_partenariado`
  ADD CONSTRAINT `previo_partenariado_ibfk_1` FOREIGN KEY (`id_demanda`) REFERENCES `demanda_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `previo_partenariado_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `oferta_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD CONSTRAINT `FKEY_Profesor` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `profesorinterno_oferta`
--
ALTER TABLE `profesorinterno_oferta`
  ADD CONSTRAINT `profesorinterno_oferta_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `profesor_interno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profesorinterno_oferta_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `oferta_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `profesor_colaboracion`
--
ALTER TABLE `profesor_colaboracion`
  ADD CONSTRAINT `FKEY_Profesor_colaboracion1` FOREIGN KEY (`id_profesor`) REFERENCES `profesor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profesor_colaboracion_ibfk_1` FOREIGN KEY (`id_colaboracion`) REFERENCES `colaboracion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `profesor_externo`
--
ALTER TABLE `profesor_externo`
  ADD CONSTRAINT `FK_datos_p_ex` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_externo` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profesor_externo_ibfk_1` FOREIGN KEY (`id`) REFERENCES `profesor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uni_prof` FOREIGN KEY (`universidad`) REFERENCES `universidad` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `profesor_interno`
--
ALTER TABLE `profesor_interno`
  ADD CONSTRAINT `FKEY_Profesor_interno` FOREIGN KEY (`id`) REFERENCES `profesor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_datos_internos` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_interno` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD CONSTRAINT `proyecto-colaboracion` FOREIGN KEY (`id`) REFERENCES `colaboracion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `proyecto-partenariado` FOREIGN KEY (`id_partenariado`) REFERENCES `partenariado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `socio_comunitario`
--
ALTER TABLE `socio_comunitario`
  ADD CONSTRAINT `FKEY_Entidad` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_datos_int` FOREIGN KEY (`datos_personales_Id`) REFERENCES `datos_personales_externo` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `titulacionlocal_demanda`
--
ALTER TABLE `titulacionlocal_demanda`
  ADD CONSTRAINT `titulacion_local-demanda_ibfk1` FOREIGN KEY (`id_titulacion`) REFERENCES `titulacion_local` (`id`),
  ADD CONSTRAINT `titulacion_local-demanda_ibfk_2` FOREIGN KEY (`id_demanda`) REFERENCES `demanda_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `titulacionlocal_profesor`
--
ALTER TABLE `titulacionlocal_profesor`
  ADD CONSTRAINT `titulacion_local-profesor` FOREIGN KEY (`id_profesor`) REFERENCES `profesor_interno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `titulacionlocal_profesor_ibfk_1` FOREIGN KEY (`id_titulacion`) REFERENCES `titulacion_local` (`id`);

--
-- Filtros para la tabla `upload`
--
ALTER TABLE `upload`
  ADD CONSTRAINT `upload_ibfk_1` FOREIGN KEY (`creador`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `uploads_colaboracion`
--
ALTER TABLE `uploads_colaboracion`
  ADD CONSTRAINT `uploads_colaboracion_ibfk_1` FOREIGN KEY (`id_upload`) REFERENCES `upload` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uploads_colaboracion_ibfk_2` FOREIGN KEY (`id_colaboracion`) REFERENCES `colaboracion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `upload_anuncioservicio`
--
ALTER TABLE `upload_anuncioservicio`
  ADD CONSTRAINT `upload_anuncioservicio_ibfk_1` FOREIGN KEY (`id_upload`) REFERENCES `upload` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `upload_anuncioservicio_ibfk_2` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `aceptacionaceptada`
--
ALTER TABLE `aceptacionaceptada`
  ADD CONSTRAINT `aceptacionaceptada_ibfk_1` FOREIGN KEY (`idNotificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `aceptacionaceptada_ibfk_2` FOREIGN KEY (`idPartenariado`) REFERENCES `partenariado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ofertaaceptada`
--
ALTER TABLE `ofertaaceptada`
  ADD CONSTRAINT `ofertaaceptada_ibfk_1` FOREIGN KEY (`idNotificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ofertaaceptada_ibfk_2` FOREIGN KEY (`idOferta`) REFERENCES `oferta_servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`idDestino`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `aceptacionrechazado`
--
ALTER TABLE `aceptacionrechazado`
  ADD CONSTRAINT `aceptacionrechazado_ibfk_1` FOREIGN KEY (`idNotificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `aceptacionrechazado_ibfk_2` FOREIGN KEY (`idNotificacionOferta`) REFERENCES `ofertaaceptada` (`idNotificacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `demandarespalda`
--
ALTER TABLE `demandarespalda`
  ADD CONSTRAINT `demandarespalda_ibfk_1` FOREIGN KEY (`idNotificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `demandarespalda_ibfk_2` FOREIGN KEY (`idPartenariado`) REFERENCES `partenariado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--º
-- Filtros para la tabla `partenariadorellenado`
--
ALTER TABLE `partenariadorellenado`
  ADD CONSTRAINT `partenariadorellenado_ibfk_1` FOREIGN KEY (`idNotificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partenariadorellenado_ibfk_2` FOREIGN KEY (`idPartenariado`) REFERENCES `partenariado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificacionmatching`
--
ALTER TABLE `notificacionmatching`
  ADD CONSTRAINT `notificacionmatching_ibfk_1` FOREIGN KEY (`idNotificacion`) REFERENCES `notificaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notificacionmatching_ibfk_2` FOREIGN KEY (`idOferta`) REFERENCES `matching` (`id_oferta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notificacionmatching_ibfk_3` FOREIGN KEY (`idDemanda`) REFERENCES `matching` (`id_demanda`) ON DELETE CASCADE ON UPDATE CASCADE;

 CREATE TABLE `tags` (
  `id` int(11) NOT NULL COMMENT 'clave ',
  `nombre` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'nombre del tag'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--
--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'clave ';


CREATE TABLE `oferta_demanda_tags` (
  `object_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `tipo` varchar(8) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `oferta_demanda_tags`
--
ALTER TABLE `oferta_demanda_tags`
  ADD PRIMARY KEY (`object_id`,`tag_id`,`tipo`),
  ADD KEY `tag_id_fg` (`tag_id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `oferta_demanda_tags`
--
ALTER TABLE `oferta_demanda_tags`
  ADD CONSTRAINT `tag_id_fg` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;
