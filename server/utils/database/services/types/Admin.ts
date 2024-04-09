import type { Usuario } from './Usuario';

export interface Admin extends Usuario {
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	telefono: string;
	rol: string;
}
