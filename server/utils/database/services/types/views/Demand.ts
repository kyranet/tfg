import { AnuncioServicio } from '../AnuncioServicio';
import { AreaServicio } from '../AreaServicio';
import type { DemandaServicio } from '../DemandaServicio';
import { NecesidadSocial } from '../NecesidadSocial';
import type { SocioComunitario } from '../SocioComunitario';
import { TitulacionLocal } from '../TitulacionLocal';
import { Usuario } from '../Usuario';
import { AsRaw, makeKeyFunction } from '../base/Shared';

export namespace ViewDemand {
	export const Name = 'view_demand';
	export const Key = makeKeyFunction(Name);

	export interface Value {
		id: DemandaServicio.Value['id'];
		city: DemandaServicio.Value['ciudad'];
		purpose: DemandaServicio.Value['finalidad'];
		periodDefinitionStart: DemandaServicio.Value['periodo_definicion_ini'];
		periodDefinitionEnd: DemandaServicio.Value['periodo_definicion_fin'];
		periodExecutionStart: DemandaServicio.Value['periodo_ejecucion_ini'];
		periodExecutionEnd: DemandaServicio.Value['periodo_ejecucion_ini'];
		periodDeadline: DemandaServicio.Value['fecha_fin'];
		temporaryObservations: DemandaServicio.Value['observaciones_temporales'];
		beneficiaryCommunity: DemandaServicio.Value['comunidad_beneficiaria'];
		title: AnuncioServicio.Value['titulo'];
		description: AnuncioServicio.Value['descripcion'];
		createdAt: AnuncioServicio.Value['created_at'];
		updatedAt: AnuncioServicio.Value['updated_at'];
		image: AnuncioServicio.Value['imagen'];
		socialNeedId: NecesidadSocial.Value['id'];
		socialNeedName: NecesidadSocial.Value['nombre'];
		creatorId: SocioComunitario.Value['id'];
		creatorName: SocioComunitario.Value['nombre_socioComunitario'];
		creatorMission: SocioComunitario.Value['mision'];
		creatorSector: SocioComunitario.Value['sector'];
		creatorUrl: SocioComunitario.Value['url'];
		creatorAvatar: Usuario.Value['origin_img'];
		serviceAreas: AreaServicio.Value['nombre'][];
		degrees: TitulacionLocal.Value['nombre'][];
	}

	export type RawValue = AsRaw<Value>;
}
