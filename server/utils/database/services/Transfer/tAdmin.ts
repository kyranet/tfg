import TUsuario from './tUsuario';

class TAdmin extends TUsuario {
	private correo: string;
	private nombre: string;
	private apellidos: string;
	private password: string;
	private telefono: string;
	private rol: string;

	constructor(
		id: number,
		correo: string,
		nombre: string,
		apellidos: string,
		password: string,
		origin_login: string,
		origin_img: string,
		createdAt: Date,
		updatedAt: Date,
		terminos_aceptados: boolean,
		telefono: string
	) {
		super(id, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados);
		this.correo = correo;
		this.nombre = nombre;
		this.apellidos = apellidos;
		this.password = password;
		this.rol = 'ROL_GESTOR';
		this.telefono = telefono;
	}

	getTelefono(): string {
		return this.telefono;
	}

	setTelefono(telefono: string): void {
		this.telefono = telefono;
	}

	getNombre(): string {
		return this.nombre;
	}

	setNombre(nombre: string): void {
		this.nombre = nombre;
	}

	getCorreo(): string {
		return this.correo;
	}

	setCorreo(correo: string): void {
		this.correo = correo;
	}

	getApellidos(): string {
		return this.apellidos;
	}

	setApellidos(apellidos: string): void {
		this.apellidos = apellidos;
	}

	getPassword(): string {
		return this.password;
	}

	setPassword(password: string): void {
		this.password = password;
	}
}

export default TAdmin;