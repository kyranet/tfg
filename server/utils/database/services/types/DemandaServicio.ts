import { AnuncioServicio } from './AnuncioServicio';
import { TitulacionLocalDemanda } from './TitulacionLocalDemanda';

export interface DemandaServicio extends AnuncioServicio {
	creador: any;
	ciudad: string;
	finalidad: string;
	periodo_definicion_ini: Date;
	periodo_definicion_fin: Date;
	periodo_ejecucion_ini: Date;
	periodo_ejecucion_fin: Date;
	fecha_fin: Date;
	observaciones_temporales: string;
	necesidad_social: string;
	titulacionlocal: TitulacionLocalDemanda[];
	comunidad_beneficiaria: string;
	dummy: any;
}
