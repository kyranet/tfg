SET autocommit = 0;
LOCK TABLES `oferta_servicio` WRITE;

ALTER TABLE `oferta_servicio`
    DROP FOREIGN KEY `oferta_servicio_ibfk_1`,
    ADD CONSTRAINT `oferta_servicio_creator_fk` FOREIGN KEY (`creador`) REFERENCES `usuario` (`id`);

COMMIT;
UNLOCK TABLES;
