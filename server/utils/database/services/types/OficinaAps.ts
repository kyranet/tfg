import type { Usuario } from './Usuario';

export interface OficinaAps extends Usuario {
	id: number;
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	telefono: string;
	origin_login: string;
	origin_img: string;
	createdAt: Date;
	updatedAt: Date;
	terminos_aceptados: boolean;
	rol: string;
}
