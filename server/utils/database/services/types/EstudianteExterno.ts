import type { Estudiante } from './Estudiante';

export interface EstudianteExterno extends Estudiante {
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	titulacion: string;
	nombreUniversidad: string;
	telefono: string;
	rol: string;
}
