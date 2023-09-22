-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 22-11-2021 a las 03:19:59
-- Versión del servidor: 8.0.13-4
-- Versión de PHP: 7.2.24-0ubuntu0.18.04.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lrXKmZQ8mG`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oferta_demanda_tags`
--

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
