import type TUsuario from './tUsuario';

interface TAdmin extends TUsuario {
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	telefono: string;
	rol: string;
}

export default TAdmin;
