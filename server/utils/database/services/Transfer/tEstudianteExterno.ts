import type TEstudiante from './tEstudiante';

interface TEstudianteExterno extends TEstudiante {
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	titulacion: string;
	nombreUniversidad: string;
	telefono: string;
	rol: string;
}

export default TEstudianteExterno;
