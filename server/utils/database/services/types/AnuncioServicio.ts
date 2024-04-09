import { AreaServicioAnuncio } from './AreaServicioAnuncio';

export interface AnuncioServicio {
	id: number;
	titulo: string;
	descripcion: string;
	imagen: string;
	created_at: Date;
	updated_at: Date;
	area_servicio: AreaServicioAnuncio[];
	dummy: any;
}
