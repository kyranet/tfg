import { Usuario } from './Usuario';

export interface SocioComunitario extends Usuario {
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	sector: string;
	nombre_socioComunitario: string;
	telefono: string;
	url: string;
	mision: string;
}
