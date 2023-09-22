import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Demanda } from '../models/demanda.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { FileUploadService } from './file-upload.service';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

export class DemandaService {

    constructor(private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {
    }

    obtenerDemanda(id: number) {
        return this.http.get<{ ok: boolean, demanda: any }>(`${base_url}/demandas/${id}`, this.usuarioService.headers)
            .pipe(
                map((resp) => resp)
            );
    }

    mapearDemandas(demandas: any): Demanda[] {
        return demandas.map(
            demanda => new Demanda(
                demanda.id,
                demanda.titulo,
                demanda.descripcion,
                demanda.imagen,
                demanda.ciudad,
                demanda.finalidad,
                demanda.area_servicio,
                demanda.periodo_definicion_ini,
                demanda.periodo_definicion_fin,
                demanda.periodo_ejecucion_ini,
                demanda.periodo_ejecucion_fin,
                demanda.fecha_fin,
                demanda.observaciones_temporales,
                demanda.necesidad_social,
                demanda.titulacionlocal,
                demanda.creador,
                demanda.comunidad_beneficiaria,
                demanda.createdAt,
                demanda.updatedAt || '')
        );
    }

    cargarDemanda(id: string) {
        return this.http.get<{ ok: boolean, demanda: Demanda }>(`${base_url}/demandas/${id}`, this.usuarioService.headers)
            .pipe(
                map((resp: { ok: boolean, demanda: Demanda }) => resp.demanda)
            );
    }

    cargarDemandas(skip: number, limit: number, filtros: Object) {
        return this.http.get<{ total: Number, filtradas: Number, demandas: Demanda[] }>(`${base_url}/demandas?skip=${skip}&limit=${limit}&filtros=${encodeURIComponent(JSON.stringify(filtros))}`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return { total: resp.total, filtradas: limit, demandas: this.mapearDemandas(resp.demandas) };
                })
            );
    }

    crearDemanda(body: Object) {
        return this.http.post<{ ok: boolean, demanda: Demanda }>(`${base_url}/demandas`, body, this.usuarioService.headers)
            .pipe(
                map((resp) => {
                    return resp;
                })
            );
    }

    obtenerAreasServicio() {
        return this.http.get<{ ok: boolean, areaServicio: any }>(`${base_url}/demandas/areasservicio`, this.usuarioService.headers)
            .pipe(
                map((resp) => resp)
            );
    }

    /**/
    cargarDemandasPorAreaServicio(id) {
        console.log('Dentro de demanda.service  areaServicio');
        return this.http.get<{ ok: Boolean, demandas: Demanda[] }>(`${base_url}/demandas/demandasAreaServicio/${id}`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return { ok: resp.ok, demandas: this.mapearDemandas(resp.demandas) };
                })
            );
    }

    /**/
    cargarDemandasPorNecesidadSocial(id) {
        console.log('Dentro de demanda.service  necesidadSocial');
        return this.http.get<{ ok: Boolean, demandas: Demanda[] }>(`${base_url}/demandas/demandasNecesidadSocial/${id}`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return { ok: resp.ok, demandas: this.mapearDemandas(resp.demandas) };
                })
            );
    }

    obtenerNecesidades() {
        return this.http.get<{ ok: boolean, necesidadSocial: any }>(`${base_url}/demandas/necesidadsocial`, this.usuarioService.headers)
            .pipe(
                map((resp) => resp)
            );
    }

    obtenerTitulaciones() {
        return this.http.get<{ ok: boolean, titulacionLocal: any }>(`${base_url}/demandas/titulacionlocal`, this.usuarioService.headers)
            .pipe(
                map((resp) => resp)
            );
    }
}
