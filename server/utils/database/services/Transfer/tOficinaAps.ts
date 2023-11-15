import type tUsuario from './tUsuario';

interface tOficinaAps extends tUsuario {
	id: number;
	origin_login: string;
	origin_img: string;
	createdAt: Date;
	updatedAt: Date;
	terminos_aceptados: boolean;
	displayRol(): string;
	rol: string; // Asumiendo que 'rol' es una propiedad de solo lectura
}

export default tOficinaAps;
