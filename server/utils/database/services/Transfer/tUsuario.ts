class TUsuario {
	constructor(
		private id: number,
		private origin_login: string,
		private origin_img: string,
		private createdAt: Date,
		private updatedAt: Date,
		private terminos_aceptados: boolean
	) {}

	displayRol(): string {
		return 'Profesor'; // tiene diferentes roles para visualización de paginas (En este caso hay que cambiar agregar este metodo y atributo en todos los transfer de usuarios)
	}

	getId(): number {
		return this.id;
	}

	setId(id: number): void {
		this.id = id;
	}

	getOriginLogin(): string {
		return this.origin_login;
	}

	setOriginLogin(originL: string): void {
		this.origin_login = originL;
	}

	getOriginImg(): string {
		return this.origin_img;
	}

	setOriginImg(origin_img: string): void {
		this.origin_img = origin_img;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	setCreatedAt(createdAt: Date): void {
		this.createdAt = createdAt;
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}

	setUpdateAt(updatedAt: Date): void {
		this.updatedAt = updatedAt;
	}

	getTermAcept(): boolean {
		return this.terminos_aceptados;
	}

	setTermAcept(term: boolean): void {
		this.terminos_aceptados = term;
	}
}

export default TUsuario;
