import TAnuncioServicio from './tAnuncioServicio';
import TitulacionLocalDemanda from './tTitulacionLocalDemanda';

export interface DemandaServicio extends TAnuncioServicio {
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
