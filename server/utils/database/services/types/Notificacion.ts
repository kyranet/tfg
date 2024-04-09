export interface Notificacion {
	id: number;
	idDestino: number;
	leido: boolean;
	titulo: string;
	mensaje: string;
	fecha_fin: Date;
	emailOrigen: string;
	idOferta: number;
	tituloOferta: string;
	idDemanda: number;
	tituloDemanda: string;
	pendiente: boolean;
	idPartenariado: number;
	idMatching: number;
}
