import type { Estudiante } from './Estudiante';

export interface EstudianteInterno extends Estudiante {
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	titulacion_local: string;
	telefono: string;
	rol: string;
}
