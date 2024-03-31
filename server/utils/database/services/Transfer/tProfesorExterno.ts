import type TProfesor from './tProfesor';

interface tProfesorExterno extends TProfesor {
	id: number;
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	universidad: string;
	facultad: string;
	area_conocimiento: string[];
	rol: string;
	telefono: string;
}

export default tProfesorExterno;
