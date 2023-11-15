import type TProfesor from './tProfesor';

interface tProfesorExterno extends TProfesor {
	id: number;
	origin_login: string;
	origin_img: string;
	createdAt: Date;
	updatedAt: Date;
	terminos_aceptados: boolean;
	displayRol(): string;
	rol: string;
}

export default tProfesorExterno;
