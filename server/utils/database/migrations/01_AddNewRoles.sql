CREATE TABLE `colaborador` (
  `id` int(11) NOT NULL,
  `universidad` int(11) NOT NULL,
  `facultad` varchar(200) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tutor` (
  `id` int(11) NOT NULL,
  `datos_personales_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
