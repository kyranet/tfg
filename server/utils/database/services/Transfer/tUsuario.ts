interface TUsuario {
	id: number;
	origin_login: string;
	origin_img: string;
	createdAt: Date;
	updatedAt: Date;
	terminos_aceptados: boolean;
	rol: string; 
}

export default TUsuario;
