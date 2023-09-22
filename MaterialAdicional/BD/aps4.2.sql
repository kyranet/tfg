-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2021 a las 19:37:05
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aps`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

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
  `fecha_fin` date NOT NULL DEFAULT current_timestamp(),
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

--
-- Volcado de datos para la tabla `anuncio_servicio`
--

INSERT INTO `anuncio_servicio` (`id`, `titulo`, `descripcion`, `imagen`, `created_at`, `updated_at`, `dummy`) VALUES
(94, 'Anuncio 9', 'Prueba 9', NULL, '2021-04-30 17:01:04', '2021-04-30 16:39:27', 0),
(95, 'dADS', 'AADASD', 'ADASD', '2021-05-01 15:36:31', '2021-05-01 15:36:31', 0),
(99, 'Anuncio 9', 'Prueba 9', NULL, '2021-05-01 17:54:05', '2021-05-01 17:54:05', 0),
(100, 'Anuncio 9', 'Prueba 9', NULL, '2021-05-01 19:11:08', '2021-05-01 19:11:08', 0),
(101, 'Anuncio casa', 'Construir una casa', 'Prueba, aquí va la dirección de la imagen', '2021-05-03 15:04:09', '2021-05-03 15:04:09', 0),
(102, 'Anuncio casa', 'Construir una casa', 'Prueba, aquí va la dirección de la imagen', '2021-05-03 17:45:49', '2021-05-03 17:45:49', 0),
(104, 'Anuncio casa', 'Construir una casa', 'Prueba, aquí va la dirección de la imagen', '2021-05-03 20:03:59', '2021-05-03 20:03:59', 0),
(105, 'Anuncio casa', 'Construir una casa', 'Prueba, aquí va la dirección de la imagen', '2021-05-03 20:14:35', '2021-05-03 20:14:35', 0),
(106, 'patata', 'qweqweqweqweqwe', '', '2021-06-15 17:35:45', '2021-06-15 17:35:45', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areaconocimiento_profesor`
--

CREATE TABLE `areaconocimiento_profesor` (
  `id_area` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `areaconocimiento_profesor`
--

INSERT INTO `areaconocimiento_profesor` (`id_area`, `id_profesor`) VALUES
(1, 124),
(2, 124),
(2, 125),
(3, 120),
(4, 125),
(18, 120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areaservicio_anuncioservicio`
--

CREATE TABLE `areaservicio_anuncioservicio` (
  `id_area` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `areaservicio_anuncioservicio`
--

INSERT INTO `areaservicio_anuncioservicio` (`id_area`, `id_anuncio`) VALUES
(2, 106),
(5, 94),
(5, 99),
(5, 100),
(5, 101),
(5, 102),
(5, 104),
(5, 105),
(7, 94),
(7, 99),
(7, 100),
(7, 101),
(7, 102),
(7, 104),
(7, 105),
(29, 94),
(29, 99),
(29, 100),
(29, 101),
(29, 102),
(29, 104),
(29, 105),
(35, 94),
(35, 99),
(35, 100),
(35, 101),
(35, 102),
(35, 104),
(35, 105),
(36, 94),
(36, 99),
(36, 100),
(36, 101),
(36, 102),
(36, 104),
(36, 105),
(37, 94),
(37, 99),
(37, 100),
(37, 101),
(37, 102),
(37, 104),
(37, 105);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areaservicio_iniciativa`
--

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

--
-- Volcado de datos para la tabla `area_conocimiento`
--

INSERT INTO `area_conocimiento` (`id`, `nombre`) VALUES
(1, 'Álgebra'),
(2, 'Análisis Geográfico Regional'),
(3, 'Análisis Matemático'),
(4, 'Anatomía Patológica'),
(5, 'Anatomía y Anatomía Patológica Comparadas'),
(6, 'Anatomía y Embriología Humana'),
(7, 'Antropología Física'),
(8, 'Antropología Social'),
(9, 'Arqueología'),
(10, 'Arquitectura y Tecnología de Computadores'),
(11, 'Astronomía y Astrofísica'),
(12, 'Biblioteconomía y Documentación'),
(13, 'Biología Celular'),
(14, 'Bioquímica y Biología Molecular'),
(15, 'Botánica'),
(16, 'Ciencia de los Materiales e Ingeniería Metalúrgica'),
(17, 'Ciencia Política y de la Administración'),
(18, 'Ciencia de la Computación e Inteligencia Artificial'),
(19, 'Ciencias y Técnicas de la Navegación'),
(20, 'Ciencias y Técnicas Historiográficas'),
(21, 'Cirugía'),
(22, 'Comercialización e Investigación de Mercados'),
(23, 'Composición Arquitectónica'),
(24, 'Comunicación Audiovisual y Publicidad'),
(25, 'Construcciones Arquitectónicas'),
(26, 'Construcciones Navales'),
(27, 'Cristalografía y Mineralogía'),
(28, 'Derecho Administrativo'),
(29, 'Derecho Civil'),
(30, 'Derecho Constitucional'),
(31, 'Derecho del Trabajo y de la Seguridad Social'),
(32, 'Derecho Eclesiástico del Estado'),
(33, 'Derecho Financiero y Tributario'),
(34, 'Derecho Internacional Privado'),
(35, 'Derecho Internacional Público y Relaciones Internacionales'),
(36, 'Derecho Mercantil'),
(37, 'Derecho Penal'),
(38, 'Derecho Procesal'),
(39, 'Derecho Romano'),
(40, 'Dermatología'),
(41, 'Dibujo'),
(42, 'Didáctica de la Expresión Corporal'),
(43, 'Didáctica de la Expresión Musical'),
(44, 'Didáctica de la Expresión Plástica'),
(45, 'Didáctica de la Lengua y la Literatura'),
(46, 'Didáctica de la Matemática'),
(47, 'Didáctica de las Ciencias Experimentales'),
(48, 'Didáctica de las Ciencias Sociales'),
(49, 'Didáctica y Organización Escolar'),
(50, 'Ecología'),
(51, 'Economía Aplicada '),
(52, 'Economía Financiera y Contabilidad'),
(53, 'Economía, Sociología y Política Agraria'),
(54, 'Edafología y Química Agrícola'),
(55, 'Educación Física y Deportiva'),
(56, 'Electromagnetismo'),
(57, 'Electrónica'),
(58, 'Enfermería'),
(59, 'Escultura'),
(60, 'Estadística e Investigación Operativa'),
(61, 'Estética y Teoría de las Artes'),
(62, 'Estomatología'),
(63, 'Estratigrafía'),
(64, 'Estudios Árabes e Islámicos'),
(65, 'Estudios Hebreos y Arameos'),
(66, 'Explotación de Minas'),
(67, 'Expresión Gráfica Arquitectónica'),
(68, 'Expresión Gráfica en la Ingeniería'),
(69, 'Farmacia y Tecnología Farmacéutica'),
(70, 'Farmacología'),
(71, 'Filología Alemana'),
(72, 'Filología Catalana'),
(73, 'Filología Eslava'),
(74, 'Filología Francesa'),
(75, 'Filología Griega'),
(76, 'Filología Inglesa'),
(77, 'Filología Italiana'),
(78, 'Filología Latina'),
(79, 'Filología Románica'),
(80, 'Filología Vasca'),
(81, 'Filología Gallega y Portuguesa'),
(82, 'Filosofía'),
(83, 'Filosofía del Derecho'),
(84, 'Filosofía Moral'),
(85, 'Física Aplicada'),
(86, 'Física Atómica, Molecular y Nuclear'),
(87, 'Física de la Materia Condensada'),
(88, 'Física de la Tierra'),
(89, 'Física Teórica'),
(90, 'Fisiología'),
(91, 'Fisiología Vegetal'),
(92, 'Fisioterapia'),
(93, 'Fundamentos del Análisis Económico'),
(94, 'Genética'),
(95, 'Geodinámica Externa'),
(96, 'Geodinámica Interna'),
(97, 'Geografía Física'),
(98, 'Geografía Humana'),
(99, 'Geometría y Topología'),
(100, 'Histología'),
(101, 'Historia Antigua'),
(102, 'Historia Contemporánea'),
(103, 'Historia de América'),
(104, 'Historia de la Ciencia'),
(105, 'Historia del Arte'),
(106, 'Historia del Derecho y de las Instituciones'),
(107, 'Historia del Pensamiento y de los Movimientos Sociales'),
(108, 'Historia e Instituciones Económicas'),
(109, 'Historia Medieval'),
(110, 'Historia Moderna'),
(111, 'Ingeniería Aeroespacial'),
(112, 'Ingeniería Agroforestal'),
(113, 'Ingeniería Cartográfica, Geodésica y Fotogrametría'),
(114, 'Ingeniería de la Construcción'),
(115, 'Ingeniería de los Procesos de Fabricación'),
(116, 'Ingeniería de Sistemas y Automática'),
(117, 'Ingeniería del Terreno'),
(118, 'Ingeniería e Infraestructura de los Transportes'),
(119, 'Ingeniería Eléctrica'),
(120, 'Ingeniería Hidráulica'),
(121, 'Ingeniería Mecánica'),
(122, 'Ingeniería Nuclear'),
(123, 'Ingeniería Química'),
(124, 'Ingeniería Telemática'),
(125, 'Ingeniería Textil y Papelera'),
(126, 'Inmunología'),
(127, 'Lengua Española'),
(128, 'Estudios de Asia oriental '),
(129, 'Lenguajes y Sistemas Informáticos'),
(130, 'Lingüística General'),
(131, 'Lingüística Indoeuropea'),
(132, 'Literatura Española'),
(133, 'Lógica y Filosofía de la Ciencia'),
(134, 'Máquinas y Motores Térmicos'),
(135, 'Matemática Aplicada'),
(136, 'Mecánica de Fluidos'),
(137, 'Mecánica de Medios Continuos y Teoría de Estructuras'),
(138, 'Medicina'),
(139, 'Medicina Legal y Forense'),
(140, 'Medicina Preventiva y Salud Pública'),
(141, 'Medicina y Cirugía Animal'),
(142, 'Metodología de las Ciencias del Comportamiento'),
(143, 'Métodos cuantitativos para la Economía y la Empresa '),
(144, 'Métodos de Investigación y Diagnóstico en Educación'),
(145, 'Microbiología'),
(146, 'Música'),
(147, 'Nutrición y Bromatología'),
(148, 'Obstetricia y Ginecología'),
(149, 'Oftalmología'),
(150, 'Óptica'),
(151, 'Organización de Empresas'),
(152, 'Otorrinolaringología'),
(153, 'Paleontología'),
(154, 'Parasitología'),
(155, 'Pediatría'),
(156, 'Periodismo'),
(157, 'Personalidad, Evaluación y Tratamiento Psicológico'),
(158, 'Petrología y Geoquímica'),
(159, 'Pintura'),
(160, 'Prehistoria'),
(161, 'Producción Animal'),
(162, 'Producción Vegetal'),
(163, 'Prospección e Investigación Minera'),
(164, 'Proyectos Arquitectónicos'),
(165, 'Proyectos de Ingeniería'),
(166, 'Psicobiología'),
(167, 'Psicología Básica'),
(168, 'Psicología Evolutiva y de la Educación'),
(169, 'Psicología Social'),
(170, 'Psiquiatría'),
(171, 'Química Analítica'),
(172, 'Química Física'),
(173, 'Química Inorgánica'),
(174, 'Química Orgánica'),
(175, 'Radiología y Medicina Física'),
(176, 'Sanidad Animal'),
(177, 'Sociología'),
(178, 'Tecnología de Alimentos'),
(179, 'Tecnología Electrónica'),
(180, 'Tecnologías del Medio Ambiente'),
(181, 'Teoría de la Literatura y Literatura Comparada'),
(182, 'Teoría de la Señal y Comunicaciones'),
(183, 'Teoría e Historia de la Educación'),
(184, 'Toxicología'),
(185, 'Trabajo Social y Servicios Sociales'),
(186, 'Traducción e Interpretación'),
(187, 'Urbanística y Ordenación del Territorio'),
(188, 'Urología'),
(189, 'Zoología'),
(190, 'Traumatología y Ortopedia ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_servicio`
--

CREATE TABLE `area_servicio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `area_servicio`
--

INSERT INTO `area_servicio` (`id`, `nombre`) VALUES
(1, 'Teoría actor-red'),
(2, 'Ciencias administrativas'),
(3, 'Ciencias Agogicas'),
(4, 'Antropología'),
(5, 'Arqueología'),
(6, 'Arte por la biodiversidad'),
(7, 'Letras'),
(8, 'Desorden del espectro autista'),
(9, 'Biología'),
(10, 'Negocio'),
(11, 'Administracion de Negocios'),
(12, 'Química'),
(13, 'Clínico'),
(14, 'Comunicación'),
(15, 'Ciencias de la Computación'),
(16, 'Psicología histórica cultural'),
(17, 'Inteligencia cultural'),
(18, 'Cultura democrática'),
(19, 'Odontología'),
(20, 'Desarrollo'),
(21, 'Didáctico'),
(22, 'Tecnología digital'),
(23, 'Tecnologías digitales-Educación'),
(24, 'Ciencias de la Tierra'),
(25, 'Ciencias económicas'),
(26, 'Educación'),
(27, 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(28, 'Educación. Sevicio de aprendizaje'),
(29, 'Educación. Sevicio de aprendizaje. Investigar.'),
(30, 'Políticas educativas'),
(31, 'Involucrar el aprendizaje'),
(32, 'Ingeniería y Tecnología'),
(33, 'Evaluación'),
(34, 'Fundamentos de la protección social y jurídica'),
(35, 'General'),
(36, 'Geografía'),
(37, 'Historia'),
(38, 'Geografía Humana'),
(39, 'TIC'),
(40, 'Ciencias de la información y la comunicación'),
(41, 'Ciencias de la información; Educación'),
(42, 'Innovación'),
(43, 'Política de idiomas'),
(44, 'Idiomas y literatura'),
(45, 'Ley'),
(46, 'Administración'),
(47, 'Matemáticas'),
(48, 'Medicamento'),
(49, 'Medicina y salud'),
(50, 'Metodología'),
(51, 'Microbiología'),
(52, 'Estudios de migración'),
(53, 'Enfermería'),
(54, 'Abierto a diferentes disciplinas'),
(55, 'Otro'),
(56, 'Pedagogía'),
(57, 'Pedagogía y Economía'),
(58, 'Las artes escénicas'),
(59, 'Filosofía'),
(60, 'Educación Física'),
(61, 'Educación física y deporte'),
(62, 'Física'),
(63, 'Fisioterapia'),
(64, 'Ciencias Políticas'),
(65, 'Psicología'),
(66, 'Gestión pública'),
(67, 'Evaluación de la calidad'),
(68, 'Economia social'),
(69, 'Educación Social'),
(70, 'Justicia social'),
(71, 'Trabajo Social'),
(72, 'Sociología'),
(73, 'Ciencias espaciales'),
(74, 'Estadísticas'),
(75, 'Teología'),
(76, 'Tercer Sector'),
(77, 'Competencias transversales'),
(78, 'Política de juventud');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `id_oferta` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignatura`
--

INSERT INTO `asignatura` (`id_oferta`, `nombre`) VALUES
(99, 'Ampliación de Matemáticas'),
(99, 'Matemáticas'),
(100, 'Ampliación de Matemáticas'),
(100, 'Matemáticas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colaboracion`
--

CREATE TABLE `colaboracion` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` varchar(1200) NOT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `admite_externos` tinyint(1) NOT NULL DEFAULT 0,
  `responsable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `colaboracion`
--

INSERT INTO `colaboracion` (`id`, `titulo`, `descripcion`, `imagen`, `admite_externos`, `responsable`) VALUES
(27, 'Partenariado 1 editado', 'Descripción partenariado 1', NULL, 1, 120),
(34, 'Anuncio casa | Anuncio 9', 'Construir una casa | Prueba 9', NULL, 0, 120),
(35, 'Anuncio casa | Anuncio 9', 'Construir una casa | Prueba 9', NULL, 1, 132);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_personales_externo`
--

CREATE TABLE `datos_personales_externo` (
  `id` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `telefono` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `datos_personales_externo`
--

INSERT INTO `datos_personales_externo` (`id`, `correo`, `password`, `apellidos`, `nombre`, `telefono`) VALUES
(14, 'entidad1', 'entidad1', 'entidad1', 'entidad1', 0),
(15, 'vgnatiuk@ucm.es', '$2a$10$o40kbL0U353Lyic/92xkzeAPVpo9gcxKnu/RBERXLHlQ1MHZwdco.', 'Gnatiuk', 'Viktoriia', 0),
(18, 'bb@ucm.es', '$2a$10$xVmhZ0MwyoxJKxIsEL3xH.xjzun/5pjeBDkxHISDC9h8BqGWbty/m', 'dfg', 'rfes', 0),
(19, 'pruebaprof@ucm.es', '$2a$10$7YcoonBko2Vajf3/MeOtuesuROta2466PnJL4Wn0zKEPMTm51Qpiy', 'jeje', 'hola', 0),
(24, 'vgnatiuk2@ucm.es', '$2a$10$j0zfUPeKr2thefc8eErDleBGm3pH9Oez6MPOAQa4UZn4T7XdNPFWy', 'Gnatiuk', 'Victoria', 0),
(27, 'jesuss07@ucm.es', '$2a$10$3Ld3ywclrvFNYOl.YBJM8OsL7Dv.YFJ3QcmHzv9W2RlTW6kdaF/IS', 'Sanchez', 'Jesus', 695111461);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_personales_interno`
--

CREATE TABLE `datos_personales_interno` (
  `id` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `telefono` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `datos_personales_interno`
--

INSERT INTO `datos_personales_interno` (`id`, `correo`, `password`, `apellidos`, `nombre`, `telefono`) VALUES
(115, 'profesorInterno1@ucm.es', 'profesorInterno1', 'profesorInterno1', 'profesorInterno1', 0),
(116, 'profesor2', 'profesor2', 'profesor2', 'profesor2', 0),
(117, 'profesor3', 'profesor3', 'profesor3', 'profesor3', 0),
(118, 'profesor4', 'profesor4', 'profesor4', 'profesor4', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `demanda_servicio`
--

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

--
-- Volcado de datos para la tabla `demanda_servicio`
--

INSERT INTO `demanda_servicio` (`id`, `creador`, `ciudad`, `finalidad`, `periodo_definicion_ini`, `periodo_definicion_fin`, `periodo_ejecucion_ini`, `periodo_ejecucion_fin`, `fecha_fin`, `observaciones_temporales`, `necesidad_social`, `comunidad_beneficiaria`) VALUES
(101, 119, 'Madrid', 'Construir una casa', '2020-06-04', '2020-07-04', '2020-07-05', '2021-03-11', '2021-08-01', 'NADA', 18, ''),
(102, 119, 'Madrid', 'Construir una casa', '2020-06-04', '2020-07-04', '2020-07-05', '2021-03-11', '2021-08-01', 'NADA', 18, '0'),
(104, 119, 'Madrid', 'Construir una casa', '2020-06-04', '2020-07-04', '2020-07-05', '2021-03-11', '2021-08-01', 'NADA', 18, '0'),
(105, 119, 'Madrid', 'Construir una casa', '2020-06-04', '2020-07-04', '2020-07-05', '2021-03-11', '2021-08-01', 'NADA', 18, '0'),
(106, 136, 'Madrid', 'qweqweqwe', '2021-06-15', '2021-07-22', '2021-08-19', '2021-09-22', '2022-04-15', 'qweqweqwe', 6, 'ewqwqeqwqwe');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_externo`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_proyecto`
--

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

--
-- Volcado de datos para la tabla `matching`
--

INSERT INTO `matching` (`id_oferta`, `id_demanda`, `procesado`, `emparejamiento`) VALUES
(99, 105, 1, '-9');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matching_areas`
--

CREATE TABLE `matching_areas` (
  `id` int(11) NOT NULL,
  `area_conocimiento` varchar(200) NOT NULL,
  `area_servicio` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `matching_areas`
--

INSERT INTO `matching_areas` (`id`, `area_conocimiento`, `area_servicio`) VALUES
(1, 'Álgebra', 'Ciencias Agogicas'),
(2, 'Álgebra', 'Negocio'),
(3, 'Álgebra', 'Ciencias de la Computación'),
(4, 'Álgebra', 'Didáctico'),
(5, 'Álgebra', 'Tecnología digital'),
(6, 'Álgebra', 'Tecnologías digitales-Educación'),
(7, 'Álgebra', 'Ciencias económicas'),
(8, 'Álgebra', 'Educación'),
(9, 'Álgebra', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(10, 'Álgebra', 'Educación. Sevicio de aprendizaje'),
(11, 'Álgebra', 'Educación. Sevicio de aprendizaje. Investigar.'),
(12, 'Álgebra', 'Involucrar el aprendizaje'),
(13, 'Álgebra', 'Ingeniería y Tecnología'),
(14, 'Álgebra', 'Evaluación'),
(15, 'Álgebra', 'General'),
(16, 'Álgebra', 'TIC'),
(17, 'Álgebra', 'Ciencias de la información y la comunicación'),
(18, 'Álgebra', 'Ciencias de la información; Educación'),
(19, 'Álgebra', 'Innovación'),
(20, 'Álgebra', 'Administración'),
(21, 'Álgebra', 'Matemáticas'),
(22, 'Álgebra', 'Metodología'),
(23, 'Álgebra', 'Abierto a diferentes disciplinas'),
(24, 'Álgebra', 'Otro'),
(25, 'Álgebra', 'Pedagogía'),
(26, 'Álgebra', 'Pedagogía y Economía'),
(27, 'Álgebra', 'Física'),
(28, 'Álgebra', 'Economia social'),
(29, 'Álgebra', 'Ciencias espaciales'),
(30, 'Álgebra', 'Estadísticas'),
(31, 'Análisis Geográfico Regional', 'Arqueología'),
(32, 'Análisis Geográfico Regional', 'Ciencias de la Tierra'),
(33, 'Análisis Geográfico Regional', 'Educación'),
(34, 'Análisis Geográfico Regional', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(35, 'Análisis Geográfico Regional', 'Educación. Sevicio de aprendizaje'),
(36, 'Análisis Geográfico Regional', 'Educación. Sevicio de aprendizaje. Investigar.'),
(37, 'Análisis Geográfico Regional', 'Evaluación'),
(38, 'Análisis Geográfico Regional', 'General'),
(39, 'Análisis Geográfico Regional', 'Geografía'),
(40, 'Análisis Geográfico Regional', 'Historia'),
(41, 'Análisis Geográfico Regional', 'Metodología'),
(42, 'Análisis Geográfico Regional', 'Estudios de migración'),
(43, 'Análisis Geográfico Regional', 'Abierto a diferentes disciplinas'),
(44, 'Análisis Geográfico Regional', 'Otro'),
(45, 'Análisis Matemático', 'Ciencias administrativas'),
(46, 'Análisis Matemático', 'Negocio'),
(47, 'Análisis Matemático', 'Ciencias de la Computación'),
(48, 'Análisis Matemático', 'Desarrollo'),
(49, 'Análisis Matemático', 'Didáctico'),
(50, 'Análisis Matemático', 'Tecnología digital'),
(51, 'Análisis Matemático', 'Tecnologías digitales-Educación'),
(52, 'Análisis Matemático', 'Ciencias económicas'),
(53, 'Análisis Matemático', 'Educación'),
(54, 'Análisis Matemático', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(55, 'Análisis Matemático', 'Educación. Sevicio de aprendizaje'),
(56, 'Análisis Matemático', 'Educación. Sevicio de aprendizaje. Investigar.'),
(57, 'Análisis Matemático', 'Involucrar el aprendizaje'),
(58, 'Análisis Matemático', 'Ingeniería y Tecnología'),
(59, 'Análisis Matemático', 'Evaluación'),
(60, 'Análisis Matemático', 'General'),
(61, 'Análisis Matemático', 'TIC'),
(62, 'Análisis Matemático', 'Ciencias de la información y la comunicación'),
(63, 'Análisis Matemático', 'Ciencias de la información; Educación'),
(64, 'Análisis Matemático', 'Innovación'),
(65, 'Análisis Matemático', 'Administración'),
(66, 'Análisis Matemático', 'Matemáticas'),
(67, 'Análisis Matemático', 'Metodología'),
(68, 'Análisis Matemático', 'Abierto a diferentes disciplinas'),
(69, 'Análisis Matemático', 'Otro'),
(70, 'Análisis Matemático', 'Pedagogía'),
(71, 'Análisis Matemático', 'Pedagogía y Economía'),
(72, 'Análisis Matemático', 'Física'),
(73, 'Análisis Matemático', 'Economia social'),
(74, 'Análisis Matemático', 'Educación Social'),
(75, 'Análisis Matemático', 'Ciencias espaciales'),
(76, 'Análisis Matemático', 'Estadísticas'),
(77, 'Anatomía Patológica', 'Antropología'),
(78, 'Anatomía Patológica', 'Biología'),
(79, 'Anatomía Patológica', 'Química'),
(80, 'Anatomía Patológica', 'Clínico'),
(81, 'Anatomía Patológica', 'Didáctico'),
(82, 'Anatomía Patológica', 'Educación'),
(83, 'Anatomía Patológica', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(84, 'Anatomía Patológica', 'Educación. Sevicio de aprendizaje'),
(85, 'Anatomía Patológica', 'Educación. Sevicio de aprendizaje. Investigar.'),
(86, 'Anatomía Patológica', 'General'),
(87, 'Anatomía Patológica', 'Medicamento'),
(88, 'Anatomía Patológica', 'Medicina y salud'),
(89, 'Anatomía Patológica', 'Microbiología'),
(90, 'Anatomía Patológica', 'Enfermería'),
(91, 'Anatomía Patológica', 'Abierto a diferentes disciplinas'),
(92, 'Anatomía Patológica', 'Otro'),
(93, 'Anatomía y Anatomía Patológica Comparadas', 'Antropología'),
(94, 'Anatomía y Anatomía Patológica Comparadas', 'Biología'),
(95, 'Anatomía y Anatomía Patológica Comparadas', 'Química'),
(96, 'Anatomía y Anatomía Patológica Comparadas', 'Clínico'),
(97, 'Anatomía y Anatomía Patológica Comparadas', 'Didáctico'),
(98, 'Anatomía y Anatomía Patológica Comparadas', 'Educación'),
(99, 'Anatomía y Anatomía Patológica Comparadas', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(100, 'Anatomía y Anatomía Patológica Comparadas', 'Educación. Sevicio de aprendizaje'),
(101, 'Anatomía y Anatomía Patológica Comparadas', 'Educación. Sevicio de aprendizaje. Investigar.'),
(102, 'Anatomía y Anatomía Patológica Comparadas', 'General'),
(103, 'Anatomía y Anatomía Patológica Comparadas', 'Medicamento'),
(104, 'Anatomía y Anatomía Patológica Comparadas', 'Medicina y salud'),
(105, 'Anatomía y Anatomía Patológica Comparadas', 'Microbiología'),
(106, 'Anatomía y Anatomía Patológica Comparadas', 'Enfermería'),
(107, 'Anatomía y Anatomía Patológica Comparadas', 'Abierto a diferentes disciplinas'),
(108, 'Anatomía y Anatomía Patológica Comparadas', 'Otro'),
(109, 'Anatomía y Embriología Humana', 'Antropología'),
(110, 'Anatomía y Embriología Humana', 'Biología'),
(111, 'Anatomía y Embriología Humana', 'Química'),
(112, 'Anatomía y Embriología Humana', 'Clínico'),
(113, 'Anatomía y Embriología Humana', 'Didáctico'),
(114, 'Anatomía y Embriología Humana', 'Educación'),
(115, 'Anatomía y Embriología Humana', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(116, 'Anatomía y Embriología Humana', 'Educación. Sevicio de aprendizaje'),
(117, 'Anatomía y Embriología Humana', 'Educación. Sevicio de aprendizaje. Investigar.'),
(118, 'Anatomía y Embriología Humana', 'General'),
(119, 'Anatomía y Embriología Humana', 'Medicamento'),
(120, 'Anatomía y Embriología Humana', 'Medicina y salud'),
(121, 'Anatomía y Embriología Humana', 'Microbiología'),
(122, 'Anatomía y Embriología Humana', 'Enfermería'),
(123, 'Anatomía y Embriología Humana', 'Abierto a diferentes disciplinas'),
(124, 'Anatomía y Embriología Humana', 'Otro'),
(125, 'Antropología Física', 'Antropología'),
(126, 'Antropología Física', 'Arqueología'),
(127, 'Antropología Física', 'Biología'),
(128, 'Antropología Física', 'Odontología'),
(129, 'Antropología Física', 'Desarrollo'),
(130, 'Antropología Física', 'Didáctico'),
(131, 'Antropología Física', 'Ciencias de la Tierra'),
(132, 'Antropología Física', 'Educación'),
(133, 'Antropología Física', 'General'),
(134, 'Antropología Física', 'Abierto a diferentes disciplinas'),
(135, 'Antropología Física', 'Otro'),
(136, 'Antropología Física', 'Educación Física'),
(137, 'Antropología Física', 'Educación física y deporte'),
(138, 'Antropología Física', 'Fisioterapia'),
(139, 'Antropología Social', 'Ciencias Agogicas'),
(140, 'Antropología Social', 'Antropología'),
(141, 'Antropología Social', 'Biología'),
(142, 'Antropología Social', 'Comunicación'),
(143, 'Antropología Social', 'Psicología histórica cultural'),
(144, 'Antropología Social', 'Inteligencia cultural'),
(145, 'Antropología Social', 'Cultura democrática'),
(146, 'Antropología Social', 'Desarrollo'),
(147, 'Antropología Social', 'Ciencias de la Tierra'),
(148, 'Antropología Social', 'Ciencias económicas'),
(149, 'Antropología Social', 'Educación'),
(150, 'Antropología Social', 'General'),
(151, 'Antropología Social', 'Historia'),
(152, 'Antropología Social', 'Geografía Humana'),
(153, 'Antropología Social', 'Innovación'),
(154, 'Antropología Social', 'Estudios de migración'),
(155, 'Antropología Social', 'Abierto a diferentes disciplinas'),
(156, 'Antropología Social', 'Otro'),
(157, 'Antropología Social', 'Pedagogía'),
(158, 'Antropología Social', 'Pedagogía y Economía'),
(159, 'Antropología Social', 'Psicología'),
(160, 'Antropología Social', 'Economia social'),
(161, 'Antropología Social', 'Educación Social'),
(162, 'Antropología Social', 'Justicia social'),
(163, 'Antropología Social', 'Sociología'),
(164, 'Antropología Social', 'Tercer Sector'),
(165, 'Antropología Social', 'Competencias transversales'),
(166, 'Arqueología', 'Antropología'),
(167, 'Arqueología', 'Arqueología'),
(168, 'Arqueología', 'Biología'),
(169, 'Arqueología', 'Didáctico'),
(170, 'Arqueología', 'Ciencias de la Tierra'),
(171, 'Arqueología', 'Educación'),
(172, 'Arqueología', 'General'),
(173, 'Arqueología', 'Historia'),
(174, 'Arqueología', 'Geografía Humana'),
(175, 'Arqueología', 'Estudios de migración'),
(176, 'Arqueología', 'Abierto a diferentes disciplinas'),
(177, 'Arqueología', 'Otro'),
(178, 'Arquitectura y Tecnología de Computadores', 'Teoría actor-red'),
(179, 'Arquitectura y Tecnología de Computadores', 'Ciencias de la Computación'),
(180, 'Arquitectura y Tecnología de Computadores', 'Desarrollo'),
(181, 'Arquitectura y Tecnología de Computadores', 'Didáctico'),
(182, 'Arquitectura y Tecnología de Computadores', 'Tecnología digital'),
(183, 'Arquitectura y Tecnología de Computadores', 'Tecnologías digitales-Educación'),
(184, 'Arquitectura y Tecnología de Computadores', 'Educación'),
(185, 'Arquitectura y Tecnología de Computadores', 'Ingeniería y Tecnología'),
(186, 'Arquitectura y Tecnología de Computadores', 'General'),
(187, 'Arquitectura y Tecnología de Computadores', 'TIC'),
(188, 'Arquitectura y Tecnología de Computadores', 'Ciencias de la información y la comunicación'),
(189, 'Arquitectura y Tecnología de Computadores', 'Ciencias de la información; Educación'),
(190, 'Arquitectura y Tecnología de Computadores', 'Innovación'),
(191, 'Arquitectura y Tecnología de Computadores', 'Matemáticas'),
(192, 'Arquitectura y Tecnología de Computadores', 'Abierto a diferentes disciplinas'),
(193, 'Arquitectura y Tecnología de Computadores', 'Otro'),
(194, 'Arquitectura y Tecnología de Computadores', 'Ciencias espaciales'),
(195, 'Arquitectura y Tecnología de Computadores', 'Estadísticas'),
(196, 'Astronomía y Astrofísica', 'Desarrollo'),
(197, 'Astronomía y Astrofísica', 'Tecnología digital'),
(198, 'Astronomía y Astrofísica', 'Ingeniería y Tecnología'),
(199, 'Astronomía y Astrofísica', 'General'),
(200, 'Astronomía y Astrofísica', 'TIC'),
(201, 'Astronomía y Astrofísica', 'Innovación'),
(202, 'Astronomía y Astrofísica', 'Matemáticas'),
(203, 'Astronomía y Astrofísica', 'Abierto a diferentes disciplinas'),
(204, 'Astronomía y Astrofísica', 'Otro'),
(205, 'Astronomía y Astrofísica', 'Física'),
(206, 'Astronomía y Astrofísica', 'Ciencias espaciales'),
(207, 'Astronomía y Astrofísica', 'Estadísticas'),
(208, 'Biblioteconomía y Documentación', 'Ciencias administrativas'),
(209, 'Biblioteconomía y Documentación', 'Letras'),
(210, 'Biblioteconomía y Documentación', 'Comunicación'),
(211, 'Biblioteconomía y Documentación', 'Inteligencia cultural'),
(212, 'Biblioteconomía y Documentación', 'General'),
(213, 'Biblioteconomía y Documentación', 'Idiomas y literatura'),
(214, 'Biblioteconomía y Documentación', 'Abierto a diferentes disciplinas'),
(215, 'Biblioteconomía y Documentación', 'Otro'),
(216, 'Biblioteconomía y Documentación', 'Gestión pública'),
(217, 'Biblioteconomía y Documentación', 'Trabajo Social'),
(218, 'Biología Celular', 'Biología'),
(219, 'Biología Celular', 'Química'),
(220, 'Biología Celular', 'Ciencias de la Tierra'),
(221, 'Biología Celular', 'Educación'),
(222, 'Biología Celular', 'General'),
(223, 'Biología Celular', 'Medicamento'),
(224, 'Biología Celular', 'Microbiología'),
(225, 'Biología Celular', 'Abierto a diferentes disciplinas'),
(226, 'Biología Celular', 'Otro'),
(227, 'Bioquímica y Biología Molecular', 'Biología'),
(228, 'Bioquímica y Biología Molecular', 'Química'),
(229, 'Bioquímica y Biología Molecular', 'Ciencias de la Tierra'),
(230, 'Bioquímica y Biología Molecular', 'Educación'),
(231, 'Bioquímica y Biología Molecular', 'General'),
(232, 'Bioquímica y Biología Molecular', 'Medicamento'),
(233, 'Bioquímica y Biología Molecular', 'Microbiología'),
(234, 'Bioquímica y Biología Molecular', 'Abierto a diferentes disciplinas'),
(235, 'Bioquímica y Biología Molecular', 'Otro'),
(236, 'Botánica', 'Biología'),
(237, 'Botánica', 'Ciencias de la Tierra'),
(238, 'Botánica', 'Involucrar el aprendizaje'),
(239, 'Botánica', 'General'),
(240, 'Botánica', 'Abierto a diferentes disciplinas'),
(241, 'Botánica', 'Otro'),
(242, 'Botánica', 'Trabajo Social'),
(243, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'Antropología'),
(244, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'Inteligencia cultural'),
(245, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'Desarrollo'),
(246, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'Ingeniería y Tecnología'),
(247, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'General'),
(248, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'Abierto a diferentes disciplinas'),
(249, 'Ciencia de los Materiales e Ingeniería Metalúrgica', 'Otro'),
(250, 'Ciencia Política y de la Administración', 'Ciencias administrativas'),
(251, 'Ciencia Política y de la Administración', 'Administracion de Negocios'),
(252, 'Ciencia Política y de la Administración', 'Comunicación'),
(253, 'Ciencia Política y de la Administración', 'Inteligencia cultural'),
(254, 'Ciencia Política y de la Administración', 'Cultura democrática'),
(255, 'Ciencia Política y de la Administración', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(256, 'Ciencia Política y de la Administración', 'Educación. Sevicio de aprendizaje'),
(257, 'Ciencia Política y de la Administración', 'Políticas educativas'),
(258, 'Ciencia Política y de la Administración', 'General'),
(259, 'Ciencia Política y de la Administración', 'Ciencias de la información; Educación'),
(260, 'Ciencia Política y de la Administración', 'Política de idiomas'),
(261, 'Ciencia Política y de la Administración', 'Ley'),
(262, 'Ciencia Política y de la Administración', 'Administración'),
(263, 'Ciencia Política y de la Administración', 'Abierto a diferentes disciplinas'),
(264, 'Ciencia Política y de la Administración', 'Otro'),
(265, 'Ciencia Política y de la Administración', 'Ciencias Políticas'),
(266, 'Ciencia Política y de la Administración', 'Gestión pública'),
(267, 'Ciencia Política y de la Administración', 'Economia social'),
(268, 'Ciencia Política y de la Administración', 'Educación Social'),
(269, 'Ciencia Política y de la Administración', 'Justicia social'),
(270, 'Ciencia Política y de la Administración', 'Sociología'),
(271, 'Ciencia Política y de la Administración', 'Política de juventud'),
(272, 'Ciencia de la Computación e Inteligencia Artificial', 'Ciencias de la Computación'),
(273, 'Ciencia de la Computación e Inteligencia Artificial', 'Desarrollo'),
(274, 'Ciencia de la Computación e Inteligencia Artificial', 'Didáctico'),
(275, 'Ciencia de la Computación e Inteligencia Artificial', 'Tecnología digital'),
(276, 'Ciencia de la Computación e Inteligencia Artificial', 'Tecnologías digitales-Educación'),
(277, 'Ciencia de la Computación e Inteligencia Artificial', 'Ingeniería y Tecnología'),
(278, 'Ciencia de la Computación e Inteligencia Artificial', 'General'),
(279, 'Ciencia de la Computación e Inteligencia Artificial', 'TIC'),
(280, 'Ciencia de la Computación e Inteligencia Artificial', 'Ciencias de la información y la comunicación'),
(281, 'Ciencia de la Computación e Inteligencia Artificial', 'Ciencias de la información; Educación'),
(282, 'Ciencia de la Computación e Inteligencia Artificial', 'Innovación'),
(283, 'Ciencia de la Computación e Inteligencia Artificial', 'Matemáticas'),
(284, 'Ciencia de la Computación e Inteligencia Artificial', 'Abierto a diferentes disciplinas'),
(285, 'Ciencia de la Computación e Inteligencia Artificial', 'Otro'),
(286, 'Ciencia de la Computación e Inteligencia Artificial', 'Evaluación de la calidad'),
(287, 'Ciencia de la Computación e Inteligencia Artificial', 'Ciencias espaciales'),
(288, 'Ciencias y Técnicas de la Navegación', 'Biología'),
(289, 'Ciencias y Técnicas de la Navegación', 'Química'),
(290, 'Ciencias y Técnicas de la Navegación', 'Ciencias de la Computación'),
(291, 'Ciencias y Técnicas de la Navegación', 'Inteligencia cultural'),
(292, 'Ciencias y Técnicas de la Navegación', 'Desarrollo'),
(293, 'Ciencias y Técnicas de la Navegación', 'Ciencias de la Tierra'),
(294, 'Ciencias y Técnicas de la Navegación', 'Ciencias económicas'),
(295, 'Ciencias y Técnicas de la Navegación', 'General'),
(296, 'Ciencias y Técnicas de la Navegación', 'Ciencias de la información y la comunicación'),
(297, 'Ciencias y Técnicas de la Navegación', 'Ciencias de la información; Educación'),
(298, 'Ciencias y Técnicas de la Navegación', 'Matemáticas'),
(299, 'Ciencias y Técnicas de la Navegación', 'Metodología'),
(300, 'Ciencias y Técnicas de la Navegación', 'Abierto a diferentes disciplinas'),
(301, 'Ciencias y Técnicas de la Navegación', 'Otro'),
(302, 'Ciencias y Técnicas de la Navegación', 'Evaluación de la calidad'),
(303, 'Ciencias y Técnicas Historiográficas', 'Antropología'),
(304, 'Ciencias y Técnicas Historiográficas', 'Arqueología'),
(305, 'Ciencias y Técnicas Historiográficas', 'Biología'),
(306, 'Ciencias y Técnicas Historiográficas', 'Inteligencia cultural'),
(307, 'Ciencias y Técnicas Historiográficas', 'Ciencias de la Tierra'),
(308, 'Ciencias y Técnicas Historiográficas', 'General'),
(309, 'Ciencias y Técnicas Historiográficas', 'Geografía'),
(310, 'Ciencias y Técnicas Historiográficas', 'Historia'),
(311, 'Ciencias y Técnicas Historiográficas', 'Geografía Humana'),
(312, 'Ciencias y Técnicas Historiográficas', 'Matemáticas'),
(313, 'Ciencias y Técnicas Historiográficas', 'Metodología'),
(314, 'Ciencias y Técnicas Historiográficas', 'Estudios de migración'),
(315, 'Ciencias y Técnicas Historiográficas', 'Abierto a diferentes disciplinas'),
(316, 'Ciencias y Técnicas Historiográficas', 'Otro'),
(317, 'Ciencias y Técnicas Historiográficas', 'Sociología'),
(318, 'Ciencias y Técnicas Historiográficas', 'Estadísticas'),
(319, 'Ciencias y Técnicas Historiográficas', 'Competencias transversales'),
(320, 'Cirugía', 'Biología'),
(321, 'Cirugía', 'Clínico'),
(322, 'Cirugía', 'Inteligencia cultural'),
(323, 'Cirugía', 'Odontología'),
(324, 'Cirugía', 'Desarrollo'),
(325, 'Cirugía', 'Didáctico'),
(326, 'Cirugía', 'General'),
(327, 'Cirugía', 'Medicamento'),
(328, 'Cirugía', 'Medicina y salud'),
(329, 'Cirugía', 'Metodología'),
(330, 'Cirugía', 'Microbiología'),
(331, 'Cirugía', 'Enfermería'),
(332, 'Cirugía', 'Abierto a diferentes disciplinas'),
(333, 'Cirugía', 'Otro'),
(334, 'Cirugía', 'Evaluación de la calidad'),
(335, 'Cirugía', 'Competencias transversales'),
(336, 'Comercialización e Investigación de Mercados', 'Ciencias administrativas'),
(337, 'Comercialización e Investigación de Mercados', 'Negocio'),
(338, 'Comercialización e Investigación de Mercados', 'Administracion de Negocios'),
(339, 'Comercialización e Investigación de Mercados', 'Comunicación'),
(340, 'Comercialización e Investigación de Mercados', 'Ciencias económicas'),
(341, 'Comercialización e Investigación de Mercados', 'General'),
(342, 'Comercialización e Investigación de Mercados', 'Administración'),
(343, 'Comercialización e Investigación de Mercados', 'Abierto a diferentes disciplinas'),
(344, 'Comercialización e Investigación de Mercados', 'Otro'),
(345, 'Comercialización e Investigación de Mercados', 'Ciencias Políticas'),
(346, 'Comercialización e Investigación de Mercados', 'Evaluación de la calidad'),
(347, 'Comercialización e Investigación de Mercados', 'Economia social'),
(348, 'Comercialización e Investigación de Mercados', 'Estadísticas'),
(349, 'Comunicación Audiovisual y Publicidad', 'Comunicación'),
(350, 'Comunicación Audiovisual y Publicidad', 'Ciencias económicas'),
(351, 'Comunicación Audiovisual y Publicidad', 'Evaluación'),
(352, 'Comunicación Audiovisual y Publicidad', 'General'),
(353, 'Comunicación Audiovisual y Publicidad', 'Ciencias de la información y la comunicación'),
(354, 'Comunicación Audiovisual y Publicidad', 'Ciencias de la información; Educación'),
(355, 'Comunicación Audiovisual y Publicidad', 'Política de idiomas'),
(356, 'Comunicación Audiovisual y Publicidad', 'Idiomas y literatura'),
(357, 'Comunicación Audiovisual y Publicidad', 'Abierto a diferentes disciplinas'),
(358, 'Comunicación Audiovisual y Publicidad', 'Otro'),
(359, 'Comunicación Audiovisual y Publicidad', 'Psicología'),
(360, 'Comunicación Audiovisual y Publicidad', 'Economia social'),
(361, 'Comunicación Audiovisual y Publicidad', 'Sociología'),
(362, 'Comunicación Audiovisual y Publicidad', 'Estadísticas'),
(363, 'Comunicación Audiovisual y Publicidad', 'Competencias transversales'),
(364, 'Derecho Civil', 'Letras'),
(365, 'Derecho Civil', 'Comunicación'),
(366, 'Derecho Civil', 'Psicología histórica cultural'),
(367, 'Derecho Civil', 'Cultura democrática'),
(368, 'Derecho Civil', 'Políticas educativas. Educación. Sevicio de aprendizaje'),
(369, 'Derecho Civil', 'Políticas educativas'),
(370, 'Derecho Civil', 'General'),
(371, 'Derecho Civil', 'Ciencias de la información y la comunicación'),
(372, 'Derecho Civil', 'Ley'),
(373, 'Derecho Civil', 'Abierto a diferentes disciplinas'),
(374, 'Derecho Civil', 'Otro'),
(375, 'Derecho Civil', 'Gestión pública'),
(376, 'Derecho Civil', 'Justicia social'),
(377, 'Derecho Civil', 'Trabajo Social'),
(378, 'Derecho Civil', 'Sociología'),
(379, 'Derecho Civil', 'Competencias transversales'),
(380, 'Dibujo', 'Arte por la biodiversidad'),
(381, 'Dibujo', 'Didáctico'),
(382, 'Dibujo', 'General'),
(383, 'Dibujo', 'Abierto a diferentes disciplinas'),
(384, 'Dibujo', 'Otro'),
(385, 'Dibujo', 'Las artes escénicas'),
(386, 'Economía Aplicada ', 'Ciencias administrativas'),
(387, 'Economía Aplicada ', 'Administracion de Negocios'),
(388, 'Economía Aplicada ', 'Comunicación'),
(389, 'Economía Aplicada ', 'Inteligencia cultural'),
(390, 'Economía Aplicada ', 'Ciencias económicas'),
(391, 'Economía Aplicada ', 'General'),
(392, 'Economía Aplicada ', 'Administración'),
(393, 'Economía Aplicada ', 'Matemáticas'),
(394, 'Economía Aplicada ', 'Abierto a diferentes disciplinas'),
(395, 'Economía Aplicada ', 'Otro'),
(396, 'Economía Aplicada ', 'Pedagogía y Economía'),
(397, 'Economía Aplicada ', 'Gestión pública'),
(398, 'Economía Aplicada ', 'Economia social'),
(399, 'Economía Aplicada ', 'Estadísticas'),
(400, 'Electrónica', 'Comunicación'),
(401, 'Electrónica', 'Ciencias de la Computación'),
(402, 'Electrónica', 'Desarrollo'),
(403, 'Electrónica', 'Tecnología digital'),
(404, 'Electrónica', 'Tecnologías digitales-Educación'),
(405, 'Electrónica', 'Ingeniería y Tecnología'),
(406, 'Electrónica', 'General'),
(407, 'Electrónica', 'TIC'),
(408, 'Electrónica', 'Matemáticas'),
(409, 'Electrónica', 'Metodología'),
(410, 'Electrónica', 'Abierto a diferentes disciplinas'),
(411, 'Electrónica', 'Otro'),
(412, 'Electrónica', 'Física'),
(413, 'Filología Inglesa', 'Letras'),
(414, 'Filología Inglesa', 'General'),
(415, 'Filología Inglesa', 'Historia'),
(416, 'Filología Inglesa', 'Política de idiomas'),
(417, 'Filología Inglesa', 'Idiomas y literatura'),
(418, 'Filología Inglesa', 'Abierto a diferentes disciplinas'),
(419, 'Filología Inglesa', 'Otro'),
(420, 'Medicina', 'Biología'),
(421, 'Medicina', 'Química'),
(422, 'Medicina', 'Clínico'),
(423, 'Medicina', 'Odontología'),
(424, 'Medicina', 'Desarrollo'),
(425, 'Medicina', 'Ciencias de la Tierra'),
(426, 'Medicina', 'General'),
(427, 'Medicina', 'Medicamento'),
(428, 'Medicina', 'Medicina y salud'),
(429, 'Medicina', 'Abierto a diferentes disciplinas'),
(430, 'Medicina', 'Otro'),
(431, 'Medicina', 'Fisioterapia'),
(432, 'Medicina', 'Psicología'),
(433, 'Pediatría', 'Ciencias Agogicas'),
(434, 'Pediatría', 'Desorden del espectro autista'),
(435, 'Pediatría', 'Clínico'),
(436, 'Pediatría', 'Psicología histórica cultural'),
(437, 'Pediatría', 'General'),
(438, 'Pediatría', 'Medicamento'),
(439, 'Pediatría', 'Medicina y salud'),
(440, 'Pediatría', 'Abierto a diferentes disciplinas'),
(441, 'Pediatría', 'Otro'),
(442, 'Pediatría', 'Pedagogía'),
(443, 'Pediatría', 'Pedagogía y Economía'),
(444, 'Pediatría', 'Psicología'),
(445, 'Pediatría', 'Competencias transversales'),
(446, 'Periodismo', 'Letras'),
(447, 'Periodismo', 'Comunicación'),
(448, 'Periodismo', 'Psicología histórica cultural'),
(449, 'Periodismo', 'General'),
(450, 'Periodismo', 'Ciencias de la información y la comunicación'),
(451, 'Periodismo', 'Ciencias de la información; Educación'),
(452, 'Periodismo', 'Idiomas y literatura'),
(453, 'Periodismo', 'Abierto a diferentes disciplinas'),
(454, 'Periodismo', 'Otro'),
(455, 'Periodismo', 'Economia social'),
(456, 'Periodismo', 'Educación Social'),
(457, 'Periodismo', 'Justicia social'),
(458, 'Periodismo', 'Sociología'),
(459, 'Psiquiatría', 'Desorden del espectro autista'),
(460, 'Psiquiatría', 'Clínico'),
(461, 'Psiquiatría', 'General'),
(462, 'Psiquiatría', 'Medicamento'),
(463, 'Psiquiatría', 'Medicina y salud'),
(464, 'Psiquiatría', 'Enfermería'),
(465, 'Psiquiatría', 'Abierto a diferentes disciplinas'),
(466, 'Psiquiatría', 'Otro'),
(469, 'Psiquiatría', 'Psicología'),
(471, 'Psiquiatría', 'Sociología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matching_areaservicio_titulacion`
--

CREATE TABLE `matching_areaservicio_titulacion` (
  `id` int(11) NOT NULL,
  `area_servicio` varchar(200) NOT NULL,
  `titulacion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `matching_areaservicio_titulacion`
--

INSERT INTO `matching_areaservicio_titulacion` (`id`, `area_servicio`, `titulacion`) VALUES
(1, 'Antropología', 'Grado en Geografía e Historia '),
(2, 'Letras', 'Grado en Geografía e Historia '),
(3, 'Educación', 'Grado en Geografía e Historia '),
(4, 'General', 'Grado en Geografía e Historia '),
(5, 'Geografía', 'Grado en Geografía e Historia '),
(6, 'Historia', 'Grado en Geografía e Historia '),
(7, 'Geografía Humana', 'Grado en Geografía e Historia '),
(8, 'Abierto a diferentes disciplinas', 'Grado en Geografía e Historia '),
(9, 'Otro', 'Grado en Geografía e Historia '),
(10, 'Arte por la biodiversidad', 'Grado en Historia del Arte '),
(11, 'General', 'Grado en Historia del Arte '),
(12, 'Abierto a diferentes disciplinas', 'Grado en Historia del Arte '),
(13, 'Otro', 'Grado en Historia del Arte '),
(14, 'Las artes escénicas', 'Grado en Historia del Arte '),
(15, 'Letras', 'Grado en Lengua y Literatura Españolas '),
(16, 'Comunicación', 'Grado en Lengua y Literatura Españolas '),
(17, 'Educación', 'Grado en Lengua y Literatura Españolas '),
(18, 'General', 'Grado en Lengua y Literatura Españolas '),
(19, 'Ciencias de la información y la comunicación', 'Grado en Lengua y Literatura Españolas '),
(20, 'Ciencias de la información; Educación', 'Grado en Lengua y Literatura Españolas '),
(21, 'Política de idiomas', 'Grado en Lengua y Literatura Españolas '),
(22, 'Idiomas y literatura', 'Grado en Lengua y Literatura Españolas '),
(23, 'Abierto a diferentes disciplinas', 'Grado en Lengua y Literatura Españolas '),
(24, 'Otro', 'Grado en Lengua y Literatura Españolas '),
(25, 'Filosofía', 'Grado en Lengua y Literatura Españolas '),
(26, 'Teoría actor-red', 'Grado en Psicología '),
(27, 'Ciencias Agogicas', 'Grado en Psicología '),
(28, 'Desorden del espectro autista', 'Grado en Psicología '),
(29, 'Clínico', 'Grado en Psicología '),
(30, 'Psicología histórica cultural', 'Grado en Psicología '),
(31, 'General', 'Grado en Psicología '),
(32, 'Medicina y salud', 'Grado en Psicología '),
(33, 'Abierto a diferentes disciplinas', 'Grado en Psicología '),
(34, 'Otro', 'Grado en Psicología '),
(35, 'Psicología', 'Grado en Psicología '),
(36, 'Sociología', 'Grado en Psicología '),
(37, 'Competencias transversales', 'Grado en Psicología '),
(38, 'Ciencias administrativas', 'Grado en Ciencia Política y de la Administración '),
(39, 'Administracion de Negocios', 'Grado en Ciencia Política y de la Administración '),
(40, 'Comunicación', 'Grado en Ciencia Política y de la Administración '),
(41, 'Inteligencia cultural', 'Grado en Ciencia Política y de la Administración '),
(42, 'Cultura democrática', 'Grado en Ciencia Política y de la Administración '),
(43, 'Políticas educativas. Educación. Sevicio de aprendizaje', 'Grado en Ciencia Política y de la Administración '),
(44, 'Políticas educativas', 'Grado en Ciencia Política y de la Administración '),
(45, 'Fundamentos de la protección social y jurídica', 'Grado en Ciencia Política y de la Administración '),
(46, 'General', 'Grado en Ciencia Política y de la Administración '),
(47, 'Política de idiomas', 'Grado en Ciencia Política y de la Administración '),
(48, 'Ley', 'Grado en Ciencia Política y de la Administración '),
(49, 'Administración', 'Grado en Ciencia Política y de la Administración '),
(50, 'Abierto a diferentes disciplinas', 'Grado en Ciencia Política y de la Administración '),
(51, 'Otro', 'Grado en Ciencia Política y de la Administración '),
(52, 'Ciencias Políticas', 'Grado en Ciencia Política y de la Administración '),
(53, 'Gestión pública', 'Grado en Ciencia Política y de la Administración '),
(54, 'Evaluación de la calidad', 'Grado en Ciencia Política y de la Administración '),
(55, 'Economia social', 'Grado en Ciencia Política y de la Administración '),
(56, 'Educación Social', 'Grado en Ciencia Política y de la Administración '),
(57, 'Justicia social', 'Grado en Ciencia Política y de la Administración '),
(58, 'Trabajo Social', 'Grado en Ciencia Política y de la Administración '),
(59, 'Sociología', 'Grado en Ciencia Política y de la Administración '),
(60, 'Tercer Sector', 'Grado en Ciencia Política y de la Administración '),
(61, 'Competencias transversales', 'Grado en Ciencia Política y de la Administración '),
(62, 'Política de juventud', 'Grado en Ciencia Política y de la Administración '),
(63, 'Ciencias administrativas', 'Grado en Economía '),
(64, 'Negocio', 'Grado en Economía '),
(65, 'Administracion de Negocios', 'Grado en Economía '),
(66, 'Inteligencia cultural', 'Grado en Economía '),
(67, 'Desarrollo', 'Grado en Economía '),
(68, 'Ciencias económicas', 'Grado en Economía '),
(69, 'Evaluación', 'Grado en Economía '),
(70, 'General', 'Grado en Economía '),
(71, 'Matemáticas', 'Grado en Economía '),
(72, 'Metodología', 'Grado en Economía '),
(73, 'Abierto a diferentes disciplinas', 'Grado en Economía '),
(74, 'Otro', 'Grado en Economía '),
(75, 'Economia social', 'Grado en Economía '),
(76, 'Estadísticas', 'Grado en Economía '),
(77, 'Ciencias Agogicas', 'Grado en Educación Social '),
(78, 'Desorden del espectro autista', 'Grado en Educación Social '),
(79, 'Comunicación', 'Grado en Educación Social '),
(80, 'Psicología histórica cultural', 'Grado en Educación Social '),
(81, 'Educación', 'Grado en Educación Social '),
(82, 'Políticas educativas. Educación. Sevicio de aprendizaje', 'Grado en Educación Social '),
(83, 'Educación. Sevicio de aprendizaje', 'Grado en Educación Social '),
(84, 'Educación. Sevicio de aprendizaje. Investigar.', 'Grado en Educación Social '),
(85, 'Involucrar el aprendizaje', 'Grado en Educación Social '),
(86, 'Fundamentos de la protección social y jurídica', 'Grado en Educación Social '),
(87, 'General', 'Grado en Educación Social '),
(88, 'Abierto a diferentes disciplinas', 'Grado en Educación Social '),
(89, 'Otro', 'Grado en Educación Social '),
(90, 'Pedagogía', 'Grado en Educación Social '),
(91, 'Pedagogía y Economía', 'Grado en Educación Social '),
(92, 'Ciencias Políticas', 'Grado en Educación Social '),
(93, 'Psicología', 'Grado en Educación Social '),
(94, 'Gestión pública', 'Grado en Educación Social '),
(95, 'Educación Social', 'Grado en Educación Social '),
(96, 'Sociología', 'Grado en Educación Social '),
(97, 'Ciencias Agogicas', 'Grado en Pedagogía '),
(98, 'Desorden del espectro autista', 'Grado en Pedagogía '),
(99, 'Comunicación', 'Grado en Pedagogía '),
(100, 'Didáctico', 'Grado en Pedagogía '),
(101, 'Educación', 'Grado en Pedagogía '),
(102, 'Políticas educativas. Educación. Sevicio de aprendizaje', 'Grado en Pedagogía '),
(103, 'Educación. Sevicio de aprendizaje', 'Grado en Pedagogía '),
(104, 'Educación. Sevicio de aprendizaje. Investigar.', 'Grado en Pedagogía '),
(105, 'Involucrar el aprendizaje', 'Grado en Pedagogía '),
(106, 'General', 'Grado en Pedagogía '),
(107, 'Abierto a diferentes disciplinas', 'Grado en Pedagogía '),
(108, 'Otro', 'Grado en Pedagogía '),
(109, 'Pedagogía', 'Grado en Pedagogía '),
(110, 'Desarrollo', 'Grado en Ingeniería Eléctrica '),
(111, 'Tecnología digital', 'Grado en Ingeniería Eléctrica '),
(112, 'Tecnologías digitales-Educación', 'Grado en Ingeniería Eléctrica '),
(113, 'Ingeniería y Tecnología', 'Grado en Ingeniería Eléctrica '),
(114, 'General', 'Grado en Ingeniería Eléctrica '),
(115, 'TIC', 'Grado en Ingeniería Eléctrica '),
(116, 'Ciencias de la información y la comunicación', 'Grado en Ingeniería Eléctrica '),
(117, 'Innovación', 'Grado en Ingeniería Eléctrica '),
(118, 'Matemáticas', 'Grado en Ingeniería Eléctrica '),
(119, 'Abierto a diferentes disciplinas', 'Grado en Ingeniería Eléctrica '),
(120, 'Otro', 'Grado en Ingeniería Eléctrica '),
(121, 'Física', 'Grado en Ingeniería Eléctrica '),
(122, 'Ciencias espaciales', 'Grado en Ingeniería Eléctrica '),
(123, 'Estadísticas', 'Grado en Ingeniería Eléctrica '),
(124, 'Desarrollo', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(125, 'Tecnología digital', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(126, 'Tecnologías digitales-Educación', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(127, 'Ingeniería y Tecnología', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(128, 'General', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(129, 'TIC', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(130, 'Ciencias de la información y la comunicación', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(131, 'Innovación', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(132, 'Matemáticas', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(133, 'Abierto a diferentes disciplinas', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(134, 'Otro', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(135, 'Física', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(136, 'Ciencias espaciales', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(137, 'Estadísticas', 'Grado en Ingeniería Electrónica Industrial y Automática '),
(138, 'Arte por la biodiversidad', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(139, 'Letras', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(140, 'Comunicación', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(141, 'Inteligencia cultural', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(142, 'General', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(143, 'Política de idiomas', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(144, 'Idiomas y literatura', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(145, 'Abierto a diferentes disciplinas', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(146, 'Otro', 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(147, 'Letras', 'Grado en Filosofía '),
(148, 'General', 'Grado en Filosofía '),
(149, 'Abierto a diferentes disciplinas', 'Grado en Filosofía '),
(150, 'Otro', 'Grado en Filosofía '),
(151, 'Filosofía', 'Grado en Filosofía '),
(152, 'Ingeniería y Tecnología', 'Grado en Ingeniería Mecánica '),
(153, 'Evaluación', 'Grado en Ingeniería Mecánica '),
(154, 'General', 'Grado en Ingeniería Mecánica '),
(155, 'Innovación', 'Grado en Ingeniería Mecánica '),
(156, 'Matemáticas', 'Grado en Ingeniería Mecánica '),
(157, 'Metodología', 'Grado en Ingeniería Mecánica '),
(158, 'Abierto a diferentes disciplinas', 'Grado en Ingeniería Mecánica '),
(159, 'Otro', 'Grado en Ingeniería Mecánica '),
(160, 'Ciencias espaciales', 'Grado en Ingeniería Mecánica '),
(161, 'Estadísticas', 'Grado en Ingeniería Mecánica '),
(162, 'Comunicación', 'Grado en Sociología '),
(163, 'Cultura democrática', 'Grado en Sociología '),
(164, 'Políticas educativas. Educación. Sevicio de aprendizaje', 'Grado en Sociología '),
(165, 'Educación. Sevicio de aprendizaje', 'Grado en Sociología '),
(166, 'Educación. Sevicio de aprendizaje. Investigar.', 'Grado en Sociología '),
(167, 'Políticas educativas', 'Grado en Sociología '),
(168, 'Fundamentos de la protección social y jurídica', 'Grado en Sociología '),
(169, 'General', 'Grado en Sociología '),
(170, 'Abierto a diferentes disciplinas', 'Grado en Sociología '),
(171, 'Otro', 'Grado en Sociología '),
(172, 'Gestión pública', 'Grado en Sociología '),
(173, 'Economia social', 'Grado en Sociología '),
(174, 'Educación Social', 'Grado en Sociología '),
(175, 'Justicia social', 'Grado en Sociología '),
(176, 'Trabajo Social', 'Grado en Sociología '),
(177, 'Sociología', 'Grado en Sociología '),
(178, 'Ciencias administrativas', 'Grado en Administración y Dirección de Empresas '),
(179, 'Negocio', 'Grado en Administración y Dirección de Empresas '),
(180, 'Administracion de Negocios', 'Grado en Administración y Dirección de Empresas '),
(181, 'Comunicación', 'Grado en Administración y Dirección de Empresas '),
(182, 'Ciencias económicas', 'Grado en Administración y Dirección de Empresas '),
(183, 'General', 'Grado en Administración y Dirección de Empresas '),
(184, 'Administración', 'Grado en Administración y Dirección de Empresas '),
(185, 'Matemáticas', 'Grado en Administración y Dirección de Empresas '),
(186, 'Metodología', 'Grado en Administración y Dirección de Empresas '),
(187, 'Abierto a diferentes disciplinas', 'Grado en Administración y Dirección de Empresas '),
(188, 'Otro', 'Grado en Administración y Dirección de Empresas '),
(189, 'Gestión pública', 'Grado en Administración y Dirección de Empresas '),
(190, 'Estadísticas', 'Grado en Administración y Dirección de Empresas '),
(191, 'Competencias transversales', 'Grado en Administración y Dirección de Empresas '),
(192, 'Comunicación', 'Grado en Turismo '),
(193, 'General', 'Grado en Turismo '),
(194, 'Geografía', 'Grado en Turismo '),
(195, 'Historia', 'Grado en Turismo '),
(196, 'Geografía Humana', 'Grado en Turismo '),
(197, 'Idiomas y literatura', 'Grado en Turismo '),
(198, 'Abierto a diferentes disciplinas', 'Grado en Turismo '),
(199, 'Otro', 'Grado en Turismo '),
(200, 'Sociología', 'Grado en Turismo '),
(201, 'Química', 'Grado en Química '),
(202, 'Clínico', 'Grado en Química '),
(203, 'Desarrollo', 'Grado en Química '),
(204, 'Ciencias de la Tierra', 'Grado en Química '),
(205, 'General', 'Grado en Química '),
(206, 'Matemáticas', 'Grado en Química '),
(207, 'Medicamento', 'Grado en Química '),
(208, 'Medicina y salud', 'Grado en Química '),
(209, 'Enfermería', 'Grado en Química '),
(210, 'Abierto a diferentes disciplinas', 'Grado en Química '),
(211, 'Otro', 'Grado en Química '),
(212, 'Estadísticas', 'Grado en Química '),
(213, 'Tecnología digital', 'Grado en Física '),
(214, 'Ciencias de la Tierra', 'Grado en Física '),
(215, 'General', 'Grado en Física '),
(216, 'TIC', 'Grado en Física '),
(217, 'Innovación', 'Grado en Física '),
(218, 'Matemáticas', 'Grado en Física '),
(219, 'Abierto a diferentes disciplinas', 'Grado en Física '),
(220, 'Otro', 'Grado en Física '),
(221, 'Física', 'Grado en Física '),
(222, 'Ciencias espaciales', 'Grado en Física '),
(223, 'Ciencias administrativas', 'Grado en Matemáticas '),
(224, 'Negocio', 'Grado en Matemáticas '),
(225, 'Desarrollo', 'Grado en Matemáticas '),
(226, 'Tecnología digital', 'Grado en Matemáticas '),
(227, 'Ingeniería y Tecnología', 'Grado en Matemáticas '),
(228, 'Evaluación', 'Grado en Matemáticas '),
(229, 'General', 'Grado en Matemáticas '),
(230, 'TIC', 'Grado en Matemáticas '),
(231, 'Innovación', 'Grado en Matemáticas '),
(232, 'Administración', 'Grado en Matemáticas '),
(233, 'Matemáticas', 'Grado en Matemáticas '),
(234, 'Abierto a diferentes disciplinas', 'Grado en Matemáticas '),
(235, 'Otro', 'Grado en Matemáticas '),
(236, 'Física', 'Grado en Matemáticas '),
(237, 'Evaluación de la calidad', 'Grado en Matemáticas '),
(238, 'Economia social', 'Grado en Matemáticas '),
(239, 'Ciencias espaciales', 'Grado en Matemáticas '),
(240, 'Estadísticas', 'Grado en Matemáticas '),
(241, 'Comunicación', 'Grado en Ingeniería en Tecnologías de la Información '),
(242, 'Ciencias de la Computación', 'Grado en Ingeniería en Tecnologías de la Información '),
(243, 'Tecnología digital', 'Grado en Ingeniería en Tecnologías de la Información '),
(244, 'Tecnologías digitales-Educación', 'Grado en Ingeniería en Tecnologías de la Información '),
(245, 'Ingeniería y Tecnología', 'Grado en Ingeniería en Tecnologías de la Información '),
(246, 'General', 'Grado en Ingeniería en Tecnologías de la Información '),
(247, 'TIC', 'Grado en Ingeniería en Tecnologías de la Información '),
(248, 'Ciencias de la información y la comunicación', 'Grado en Ingeniería en Tecnologías de la Información '),
(249, 'Ciencias de la información; Educación', 'Grado en Ingeniería en Tecnologías de la Información '),
(250, 'Innovación', 'Grado en Ingeniería en Tecnologías de la Información '),
(251, 'Matemáticas', 'Grado en Ingeniería en Tecnologías de la Información '),
(252, 'Abierto a diferentes disciplinas', 'Grado en Ingeniería en Tecnologías de la Información '),
(253, 'Otro', 'Grado en Ingeniería en Tecnologías de la Información '),
(254, 'Estadísticas', 'Grado en Ingeniería en Tecnologías de la Información '),
(255, 'Ciencias de la Computación', 'Grado en Ingeniería Informática '),
(256, 'Desarrollo', 'Grado en Ingeniería Informática '),
(257, 'Tecnología digital', 'Grado en Ingeniería Informática '),
(258, 'Tecnologías digitales-Educación', 'Grado en Ingeniería Informática '),
(259, 'Ingeniería y Tecnología', 'Grado en Ingeniería Informática '),
(260, 'General', 'Grado en Ingeniería Informática '),
(261, 'TIC', 'Grado en Ingeniería Informática '),
(262, 'Ciencias de la información y la comunicación', 'Grado en Ingeniería Informática '),
(263, 'Ciencias de la información; Educación', 'Grado en Ingeniería Informática '),
(264, 'Innovación', 'Grado en Ingeniería Informática '),
(265, 'Matemáticas', 'Grado en Ingeniería Informática '),
(266, 'Metodología', 'Grado en Ingeniería Informática '),
(267, 'Abierto a diferentes disciplinas', 'Grado en Ingeniería Informática '),
(268, 'Otro', 'Grado en Ingeniería Informática '),
(269, 'Física', 'Grado en Ingeniería Informática '),
(270, 'Ciencias espaciales', 'Grado en Ingeniería Informática '),
(271, 'Estadísticas', 'Grado en Ingeniería Informática '),
(272, 'Cultura democrática', 'Grado en Derecho '),
(273, 'Políticas educativas', 'Grado en Derecho '),
(274, 'Fundamentos de la protección social y jurídica', 'Grado en Derecho '),
(275, 'General', 'Grado en Derecho '),
(276, 'Ley', 'Grado en Derecho '),
(277, 'Abierto a diferentes disciplinas', 'Grado en Derecho '),
(278, 'Otro', 'Grado en Derecho '),
(279, 'Ciencias Políticas', 'Grado en Derecho '),
(280, 'Gestión pública', 'Grado en Derecho '),
(281, 'Justicia social', 'Grado en Derecho '),
(282, 'Sociología', 'Grado en Derecho '),
(283, 'Política de juventud', 'Grado en Derecho '),
(284, 'Desarrollo', 'Grado en Ingeniería en Tecnologías Industriales '),
(285, 'Tecnología digital', 'Grado en Ingeniería en Tecnologías Industriales '),
(286, 'Tecnologías digitales-Educación', 'Grado en Ingeniería en Tecnologías Industriales '),
(287, 'Ingeniería y Tecnología', 'Grado en Ingeniería en Tecnologías Industriales '),
(288, 'General', 'Grado en Ingeniería en Tecnologías Industriales '),
(289, 'TIC', 'Grado en Ingeniería en Tecnologías Industriales '),
(290, 'Ciencias de la información y la comunicación', 'Grado en Ingeniería en Tecnologías Industriales '),
(291, 'Ciencias de la información; Educación', 'Grado en Ingeniería en Tecnologías Industriales '),
(292, 'Innovación', 'Grado en Ingeniería en Tecnologías Industriales '),
(293, 'Matemáticas', 'Grado en Ingeniería en Tecnologías Industriales '),
(294, 'Metodología', 'Grado en Ingeniería en Tecnologías Industriales '),
(295, 'Abierto a diferentes disciplinas', 'Grado en Ingeniería en Tecnologías Industriales '),
(296, 'Otro', 'Grado en Ingeniería en Tecnologías Industriales '),
(297, 'Evaluación de la calidad', 'Grado en Ingeniería en Tecnologías Industriales '),
(298, 'Ciencias espaciales', 'Grado en Ingeniería en Tecnologías Industriales '),
(299, 'Estadísticas', 'Grado en Ingeniería en Tecnologías Industriales '),
(300, 'Desorden del espectro autista', 'Grado en Trabajo Social '),
(301, 'Comunicación', 'Grado en Trabajo Social '),
(302, 'Psicología histórica cultural', 'Grado en Trabajo Social '),
(303, 'Educación', 'Grado en Trabajo Social '),
(304, 'Políticas educativas. Educación. Sevicio de aprendizaje', 'Grado en Trabajo Social '),
(305, 'Educación. Sevicio de aprendizaje', 'Grado en Trabajo Social '),
(306, 'Educación. Sevicio de aprendizaje. Investigar.', 'Grado en Trabajo Social '),
(307, 'Políticas educativas', 'Grado en Trabajo Social '),
(308, 'Fundamentos de la protección social y jurídica', 'Grado en Trabajo Social '),
(309, 'General', 'Grado en Trabajo Social '),
(310, 'Abierto a diferentes disciplinas', 'Grado en Trabajo Social '),
(311, 'Otro', 'Grado en Trabajo Social '),
(312, 'Pedagogía', 'Grado en Trabajo Social '),
(313, 'Pedagogía y Economía', 'Grado en Trabajo Social '),
(314, 'Ciencias Políticas', 'Grado en Trabajo Social '),
(315, 'Educación Social', 'Grado en Trabajo Social '),
(316, 'Trabajo Social', 'Grado en Trabajo Social '),
(317, 'Teoría actor-red', 'Grado en Criminología '),
(318, 'Clínico', 'Grado en Criminología '),
(319, 'Evaluación', 'Grado en Criminología '),
(320, 'General', 'Grado en Criminología '),
(321, 'Metodología', 'Grado en Criminología '),
(322, 'Microbiología', 'Grado en Criminología '),
(323, 'Abierto a diferentes disciplinas', 'Grado en Criminología '),
(324, 'Otro', 'Grado en Criminología '),
(325, 'Evaluación de la calidad', 'Grado en Criminología '),
(326, 'Justicia social', 'Grado en Criminología '),
(327, 'Competencias transversales', 'Grado en Criminología ');

-- --------------------------------------------------------

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
-- Volcado de datos para la tabla `necesidad_social`
--

INSERT INTO `necesidad_social` (`id`, `nombre`) VALUES
(1, 'Energía limpia y asequible'),
(2, 'Saneamiento y agua limpia'),
(3, 'Acción climática'),
(4, 'Cultural'),
(5, 'Diversidad cultural'),
(6, 'Trabajo decente y crecimiento económico'),
(7, 'Diversidad'),
(8, 'Igualdad de género'),
(9, 'Buena salud y bienestar'),
(10, 'Preservación histórica / cultural'),
(11, 'Industria'),
(12, 'Industria, innovación e infraestructura'),
(13, 'Innovación e infraestructura'),
(14, 'Justicia e instituciones sólidas'),
(15, 'Vida bajo el agua'),
(16, 'Vida en la tierra'),
(17, 'Sin pobreza'),
(18, 'No aplicar'),
(19, 'Asociación para los objetivos'),
(20, 'Paz'),
(21, 'Paz, justicia e instituciones sólidas'),
(22, 'Educación de calidad'),
(23, 'Reducir las desigualdades'),
(24, 'Producción y consumo responsable'),
(25, 'Justicia social'),
(26, 'Ciudades y comunidades sostenibles'),
(27, 'Cero hambre');

-- --------------------------------------------------------

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
-- Volcado de datos para la tabla `oferta_servicio`
--

INSERT INTO `oferta_servicio` (`id`, `cuatrimestre`, `anio_academico`, `fecha_limite`, `observaciones_temporales`, `creador`) VALUES
(95, 1, 2020, '2020-12-31', 'adas', 120),
(99, 1, 2020, '2021-11-04', 'patata', 120),
(100, 1, 2020, '2021-11-04', NULL, 120);

-- --------------------------------------------------------

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

--
-- Volcado de datos para la tabla `partenariado`
--

INSERT INTO `partenariado` (`id`, `id_demanda`, `id_oferta`, `estado`) VALUES
(27, 101, 100, 'EN_NEGOCIACION'),
(34, 101, 100, 'EN_CREACION'),
(35, 101, 100, 'EN_CREACION');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `previo_partenariado`
--

CREATE TABLE `previo_partenariado` (
  `id` int(11) NOT NULL,
  `id_demanda` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL,
  `completado_profesor` tinyint(1) NOT NULL DEFAULT 0,
  `completado_socioComunitario` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `previo_partenariado`
--

INSERT INTO `previo_partenariado` (`id`, `id_demanda`, `id_oferta`, `completado_profesor`, `completado_socioComunitario`) VALUES
(1, 101, 100, 1, 0),
(2, 101, 100, 1, 0),
(3, 101, 100, 1, 0),
(4, 101, 100, 1, 0),
(5, 101, 100, 1, 0),
(6, 101, 100, 1, 0),
(7, 101, 100, 1, 0),
(8, 101, 100, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor`
--

CREATE TABLE `profesor` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesor`
--

INSERT INTO `profesor` (`id`) VALUES
(120),
(121),
(124),
(125),
(126),
(127),
(128),
(129),
(130),
(131),
(132),
(133);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesorinterno_oferta`
--

CREATE TABLE `profesorinterno_oferta` (
  `id_profesor` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesorinterno_oferta`
--

INSERT INTO `profesorinterno_oferta` (`id_profesor`, `id_oferta`) VALUES
(120, 95),
(120, 99),
(120, 100),
(133, 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor_colaboracion`
--

CREATE TABLE `profesor_colaboracion` (
  `id_profesor` int(11) NOT NULL,
  `id_colaboracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesor_colaboracion`
--

INSERT INTO `profesor_colaboracion` (`id_profesor`, `id_colaboracion`) VALUES
(120, 34),
(120, 35),
(132, 35),
(133, 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor_externo`
--

CREATE TABLE `profesor_externo` (
  `id` int(11) NOT NULL,
  `universidad` int(11) NOT NULL,
  `facultad` varchar(200) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `profesor_externo`
--

INSERT INTO `profesor_externo` (`id`, `universidad`, `facultad`, `datos_personales_Id`) VALUES
(124, 3, 'jjjg', 18),
(125, 10, 'ghhh', 19),
(130, 14, 'adasd', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor_interno`
--

CREATE TABLE `profesor_interno` (
  `id` int(11) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesor_interno`
--

INSERT INTO `profesor_interno` (`id`, `datos_personales_Id`) VALUES
(120, 115),
(131, 116),
(132, 117),
(133, 118);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `id` int(11) NOT NULL,
  `id_partenariado` int(11) NOT NULL,
  `estado` enum('EN_CREACION','ABIERTO_PROFESORES','ABIERTO_ESTUDIANTES','EN_CURSO','CERRADO') NOT NULL DEFAULT 'EN_CREACION',
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socio_comunitario`
--

CREATE TABLE `socio_comunitario` (
  `id` int(11) NOT NULL,
  `sector` varchar(200) NOT NULL,
  `nombre_socioComunitario` varchar(200) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL,
  `url` varchar(200) NOT NULL,
  `mision` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `socio_comunitario`
--

INSERT INTO `socio_comunitario` (`id`, `sector`, `nombre_socioComunitario`, `datos_personales_Id`, `url`, `mision`) VALUES
(119, 'entidada1', 'entidada1', 14, 'entidada1', ''),
(136, 'wqe', 'ewqeqwe', 27, 'qweqwe', 'qwe');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `titulacionlocal_demanda`
--

CREATE TABLE `titulacionlocal_demanda` (
  `id_titulacion` int(11) NOT NULL,
  `id_demanda` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `titulacionlocal_demanda`
--

INSERT INTO `titulacionlocal_demanda` (`id_titulacion`, `id_demanda`) VALUES
(1, 101),
(1, 102),
(1, 104),
(1, 105),
(2, 101),
(2, 102),
(2, 104),
(2, 105),
(7, 106);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `titulacionlocal_profesor`
--

CREATE TABLE `titulacionlocal_profesor` (
  `id_titulacion` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `titulacionlocal_profesor`
--

INSERT INTO `titulacionlocal_profesor` (`id_titulacion`, `id_profesor`) VALUES
(1, 120),
(2, 120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `titulacion_local`
--

CREATE TABLE `titulacion_local` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `titulacion_local`
--

INSERT INTO `titulacion_local` (`id`, `nombre`) VALUES
(1, 'Grado en Geografía e Historia '),
(2, 'Grado en Historia del Arte '),
(3, 'Grado en Lengua y Literatura Españolas '),
(4, 'Grado en Psicología '),
(5, 'Grado en Ciencia Política y de la Administración '),
(6, 'Grado en Economía '),
(7, 'Grado en Educación Social '),
(8, 'Grado en Pedagogía '),
(9, 'Grado en Ingeniería Eléctrica '),
(10, 'Grado en Ingeniería Electrónica Industrial y Automática '),
(11, 'Grado en Estudios Ingleses. Lengua, Literatura y Cultura '),
(12, 'Grado en Filosofía '),
(13, 'Grado en Ingeniería Mecánica '),
(14, 'Grado en Sociología '),
(15, 'Grado en Administración y Dirección de Empresas '),
(16, 'Grado en Turismo '),
(17, 'Grado en Química '),
(18, 'Grado en Ciencias Ambientales '),
(19, 'Grado en Física '),
(20, 'Grado en Matemáticas '),
(21, 'Grado en Ingeniería en Tecnologías de la Información '),
(22, 'Grado en Ingeniería Informática '),
(23, 'Grado en Ciencias Jurídicas de las Administraciones Públicas '),
(24, 'Grado en Antropología Social y Cultural '),
(25, 'Grado en Derecho '),
(26, 'Grado en Ingeniería en Tecnologías Industriales '),
(27, 'Grado en Trabajo Social '),
(28, 'Grado en Criminología '),
(29, 'Máster Universitario en Innovación e Investigación en Educación '),
(30, 'Máster Universitario en Derecho de Seguros '),
(31, 'Máster Universitario en Métodos y Técnicas Avanzadas de Investigación Histórica, Artística y Geográfica '),
(32, 'Máster Universitario en Problemas Sociales '),
(33, 'Máster Universitario en Tratamiento Educativo de la Diversidad '),
(34, 'Máster Universitario en Física de Sistemas Complejos '),
(35, 'Máster Universitario en Ingeniería Avanzada de Fabricación '),
(36, 'Máster Universitario en Ingeniería del Diseño '),
(37, 'Máster Universitario en Investigación en Ingeniería Eléctrica, Electrónica y Control Industrial '),
(38, 'Máster Universitario en Dirección Pública, Políticas Públicas y Tributación '),
(39, 'Máster Universitario en Física Médica '),
(40, 'Máster Universitario en Filosofía Teórica y Práctica '),
(41, 'Máster Universitario en Ciencia del Lenguaje y Lingüística Hispánica '),
(42, 'Máster Universitario en Ciencia y Tecnología Química '),
(43, 'Máster Universitario en Comunicación y Educación en la Red '),
(44, 'Máster Universitario en Derechos Fundamentales '),
(45, 'Máster Universitario en El Mundo Clásico y su Proyección en la Cultura Occidental '),
(46, 'Máster Universitario en Formación e Investigación Literaria y Teatral en el Contexto Europeo '),
(47, 'Máster Universitario en Investigación en Inteligencia Artificial '),
(48, 'Máster Universitario en Intervención de la Administración en la Sociedad '),
(49, 'Máster Universitario en Investigación en Psicología '),
(50, 'Máster Universitario en Investigación en Tecnologías Industriales '),
(51, 'Máster Universitario en Lingüística Inglesa Aplicada '),
(52, 'Máster Universitario en Literaturas Hispánicas (Catalana, Gallega y Vasca) en el Contexto Europeo '),
(53, 'Máster Universitario en Matemáticas Avanzadas '),
(54, 'Máster Universitario en Política y Democracia '),
(55, 'Máster Universitario en Seguridad '),
(56, 'Máster Universitario en Unión Europea '),
(57, 'Máster Universitario en Las Tecnologías de la Información y la Comunicación en la Enseñanza y el Tratamiento de Lenguas '),
(58, 'Máster Universitario en La España Contemporánea en el Contexto Internacional '),
(59, 'Máster Universitario en Orientación Profesional '),
(60, 'Máster Universitario en Paz, Seguridad y Defensa '),
(61, 'Máster Universitario en Derechos Humanos '),
(62, 'Máster Universitario en Investigación en Economía '),
(63, 'Máster Universitario en Estudios Franceses y Francófonos '),
(64, 'Máster Universitario en Estrategias y Tecnologías para la Función Docente en la Sociedad Multicultural '),
(65, 'Máster Universitario en Euro-Latinoamericano en Educación Intercultural '),
(66, 'Máster Universitario en Intervención Educativa en Contextos Sociales '),
(67, 'Máster Universitario en Investigación en Ingeniería de Software y Sistemas Informáticos '),
(68, 'Máster Universitario en Formación de Profesores de Español como Segunda Lengua '),
(69, 'Máster Universitario en Trabajo Social, Estado del Bienestar y Metodologías de Intervención Social '),
(70, 'Máster Universitario en Comunicación Audiovisual de Servicio Público '),
(71, 'Máster Universitario en Acceso a la Procura '),
(72, 'Máster Universitario en Administración Sanitaria '),
(73, 'Máster Universitario en Acceso a la Abogacía '),
(74, 'Máster Universitario en Estudios Literarios y Culturales Ingleses y su Proyección Social '),
(75, 'Máster Universitario en Investigación Antropológica y sus Aplicaciones '),
(76, 'Máster Universitario en Ingeniería Industrial '),
(77, 'Máster Universitario en Derecho de Familia y Sistemas Hereditarios '),
(78, 'Máster Universitario en Comunicación, Cultura, Sociedad y Política '),
(79, 'Máster Universitario en Políticas Sociales y Dependencia '),
(80, 'Máster Universitario en Protocolo '),
(81, 'Máster Universitario en Psicología General Sanitaria '),
(82, 'Máster Universitario en Hacienda Pública y Administración Financiera y Tributaria '),
(83, 'Máster Universitario en Arbitraje y Mediación: Alternativas a la Resolución Judicial de Conflictos '),
(84, 'Máster Universitario en Formación del Profesorado de Educación Secundaria de Ecuador '),
(85, 'Máster Universitario en Ingeniería Informática '),
(86, 'Máster Universitario en Estudios de Género '),
(87, 'Máster Universitario en Psicología de la Intervención Social '),
(88, 'Máster Universitario en Ciberseguridad '),
(89, 'Máster Universitario en Ingeniería y Ciencia de Datos '),
(90, 'Programa de Doctorado en Filosofía '),
(91, 'Programa de Doctorado en Tecnologías Industriales '),
(92, 'Programa de Doctorado en Educación '),
(93, 'Programa de Doctorado en Historia e Historia del Arte y Territorio '),
(94, 'Programa de Doctorado en Ingeniería de Sistemas y de Control '),
(95, 'Programa de Doctorado en Sistemas Inteligentes '),
(96, 'Programa de Doctorado en Análisis de Problemas Sociales '),
(97, 'Programa de Doctorado en Filología. Estudios Lingüísticos y Literarios: Teoría y Aplicaciones '),
(98, 'Programa de Doctorado en Seguridad Internacional '),
(99, 'Programa de Doctorado en Ciencias '),
(100, 'Programa de Doctorado en Sociología: Cambio Social en Sociedades Contemporáneas '),
(101, 'Programa de Doctorado en Psicología de la Salud '),
(102, 'Programa de Doctorado en Derecho y Ciencias Sociales '),
(103, 'Programa de Doctorado en Unión Europea '),
(104, 'Programa de Doctorado en Economía y Empresa '),
(105, 'Programa de Doctorado en Ciencia Política '),
(106, 'Máster Universitario en Análisis Gramatical y Estilístico del Español '),
(107, 'Máster Universitario en Comunicación, Redes y Gestión de Contenidos '),
(108, 'Máster Universitario en Tecnologías del Lenguaje '),
(109, 'Máster Universitario en Prevención de Riesgos Laborales ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `universidad`
--

CREATE TABLE `universidad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `provincia` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `universidad`
--

INSERT INTO `universidad` (`id`, `nombre`, `provincia`) VALUES
(1, 'Abat Oliba CEU', 'BARCELONA'),
(2, 'A Coruña', 'A CORUÑA'),
(3, 'A Distancia de Madrid', 'MADRID'),
(4, 'Alcalá', 'MADRID'),
(5, 'Alfonso X El Sabio', 'MADRID'),
(6, 'Alicante', 'ALICANTE/ALACANT'),
(7, 'Almería', 'ALMERÍA'),
(8, 'Antonio de Nebrija', 'MADRID'),
(9, 'Atlántico Medio', 'LAS PALMAS'),
(10, 'Autónoma de Barcelona', 'BARCELONA'),
(11, 'Autónoma de Madrid', 'MADRID'),
(12, 'Barcelona', 'BARCELONA'),
(13, 'Burgos', 'BURGOS'),
(14, 'Cádiz', 'CÁDIZ'),
(15, 'Camilo José Cela', 'MADRID'),
(16, 'Cantabria', 'CANTABRIA'),
(17, 'Cardenal Herrera-CEU ', 'VALENCIA/VALÈNCIA'),
(18, 'Carlos III de Madrid', 'MADRID'),
(19, 'Castilla-La Mancha', 'CIUDAD REAL'),
(20, 'Católica de Valencia San Vicente Mártir', 'VALENCIA/VALÈNCIA'),
(21, 'Católica San Antonio', 'MURCIA'),
(22, 'Católica Santa Teresa de Jesús de Ávila', 'ÁVILA'),
(23, 'Complutense de Madrid', 'MADRID'),
(24, 'Córdoba', 'CÓRDOBA'),
(25, 'Deusto', 'BIZKAIA'),
(26, 'Europea de Canarias', 'SANTA CRUZ DE TENERIFE'),
(27, 'Europea del Atlántico', 'CANTABRIA'),
(28, 'Europea de Madrid', 'MADRID'),
(29, 'Europea de Valencia', 'VALENCIA/VALÈNCIA'),
(30, 'Europea Miguel de Cervantes', 'VALLADOLID'),
(31, 'Extremadura', 'BADAJOZ'),
(32, 'Fernando Pessoa-Canarias (UFP-C)', 'LAS PALMAS'),
(33, 'Francisco de Vitoria', 'MADRID'),
(34, 'Girona', 'GIRONA'),
(35, 'Granada', 'GRANADA'),
(36, 'Huelva', 'HUELVA'),
(37, 'IE Universidad', 'SEGOVIA'),
(38, 'Illes Balears (Les)', 'ILLES BALEARS'),
(39, 'Internacional de Andalucía', 'SEVILLA'),
(40, 'Internacional de Catalunya', 'BARCELONA'),
(41, 'Internacional de La Rioja', 'LA RIOJA'),
(42, 'Internacional Isabel I de Castilla', 'BURGOS'),
(43, 'Internacional Menéndez Pelayo', 'MADRID'),
(44, 'Internacional Valenciana', 'VALENCIA/VALÈNCIA'),
(45, 'Jaén', 'JAÉN'),
(46, 'Jaume I de Castellón', 'CASTELLÓN/CASTELLÓ'),
(47, 'La Laguna', 'SANTA CRUZ DE TENERIFE'),
(48, 'La Rioja', 'LA RIOJA'),
(49, 'Las Palmas de Gran Canaria', 'LAS PALMAS'),
(50, 'León', 'LEÓN'),
(51, 'Lleida', 'LLEIDA'),
(52, 'Loyola Andalucía', 'SEVILLA'),
(53, 'Málaga', 'MÁLAGA'),
(54, 'Miguel Hernández de Elche', 'ALICANTE/ALACANT'),
(55, 'Mondragón Unibertsitatea', 'GIPUZKOA'),
(56, 'Murcia', 'MURCIA'),
(57, 'Nacional de Educación a Distancia', 'MADRID'),
(58, 'Navarra', 'NAVARRA'),
(59, 'Oberta de Catalunya', 'BARCELONA'),
(60, 'Oviedo', 'ASTURIAS'),
(61, 'Pablo de Olavide', 'SEVILLA'),
(62, 'País Vasco/Euskal Herriko Unibertsitatea', 'BIZKAIA'),
(63, 'Politécnica de Cartagena', 'MURCIA'),
(64, 'Politécnica de Catalunya', 'BARCELONA'),
(65, 'Politécnica de Madrid', 'MADRID'),
(66, 'Politècnica de València', 'VALENCIA/VALÈNCIA'),
(67, 'Pompeu Fabra', 'BARCELONA'),
(68, 'Pontificia Comillas', 'MADRID'),
(69, 'Pontificia de Salamanca', 'SALAMANCA'),
(70, 'Pública de Navarra', 'NAVARRA'),
(71, 'Ramón Llull', 'BARCELONA'),
(72, 'Rey Juan Carlos', 'MADRID'),
(73, 'Rovira i Virgili', 'TARRAGONA'),
(74, 'Salamanca', 'SALAMANCA'),
(75, 'San Jorge', 'ZARAGOZA'),
(76, 'San Pablo-CEU', 'MADRID'),
(77, 'Santiago de Compostela', 'A CORUÑA'),
(78, 'Sevilla', 'SEVILLA'),
(79, 'València (Estudi General)', 'VALENCIA/VALÈNCIA'),
(80, 'Valladolid', 'VALLADOLID'),
(81, 'Vic-Central de Catalunya', 'BARCELONA'),
(82, 'Vigo', 'PONTEVEDRA'),
(83, 'Zaragoza', 'ZARAGOZA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `upload`
--

CREATE TABLE `upload` (
  `id` int(11) NOT NULL,
  `almacenamiento` varchar(200) NOT NULL,
  `campo` varchar(200) NOT NULL,
  `tipo` varchar(200) NOT NULL,
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
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `origin_login`, `origin_img`, `createdAt`, `updatedAt`, `terminos_aceptados`) VALUES
(119, 'entidad1', 'entidad1', '2021-04-01 16:36:24', '2021-04-01 16:36:24', 1),
(120, 'profesorInterno1', 'profesorInterno1', '2021-04-01 16:36:53', '2021-04-01 16:36:53', 1),
(121, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(124, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(125, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(126, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(127, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(128, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(129, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(130, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1),
(131, 'profesor2', 'profesor2', '2021-05-03 20:08:44', '2021-05-03 20:08:44', 1),
(132, 'profesor4', 'profesor4', '2021-05-03 20:09:14', '2021-05-03 20:09:14', 1),
(133, 'profesor3', 'profesor3', '2021-05-03 20:09:14', '2021-05-03 20:09:14', 1),
(136, 'Portal ApS', 'imagen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1);

--
-- Índices para tablas volcadas
--

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
  
--
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
  
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
