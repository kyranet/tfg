import type { Profesor } from './Profesor';

export interface ProfesorExterno extends Profesor {
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
