interface TUpload {
	id: number;
	almacenamiento: string;
	campo: string;
	tipo: string;
	tipo_id: number;
	path: string;
	client_name: string;
	nombre: string;
	creador: string;
	createdAt: Date;
	updatedAt: Date;
}

export default TUpload;
