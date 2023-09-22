import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Oferta} from '../models/oferta.model';
import {map} from 'rxjs/operators';
import {UsuarioService} from './usuario.service';
import {FileUploadService} from './file-upload.service';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class OfertaService {

    constructor(private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {
    }

    obtenerOferta(id: number) {
        return this.http.get<{ ok: boolean, oferta: any }>(`${base_url}/ofertas/${id}`, this.usuarioService.headers)
            .pipe(
                map((resp) => resp)
            );
    }

    mapearOfertas(ofertas: any): Oferta[] {
        return ofertas.map(
            oferta => new Oferta(
                oferta.id,
                oferta.titulo,
                oferta.descripcion,
                oferta.imagen,
                oferta.created_at,
                oferta.updated_at,
                oferta.cuatrimestre,
                oferta.anio_academico,
                oferta.fecha_limite,
                oferta.observaciones,
                oferta.creador,
                oferta.area_servicio,
                oferta.asignatura_objetivo,
                oferta.profesores || '',
                oferta.tags)
        );
    }


    cargarOferta(id: string) {
        return this.http.get<{ ok: boolean, oferta: Oferta }>(`${base_url}/ofertas/${id}`, this.usuarioService.headers)
            .pipe(
                map((resp: { ok: boolean, oferta: Oferta }) => resp.oferta)
            );
    }

    cargarOfertas(skip: number, limit: number, filtros: Object) {
        return this.http.get<{ total: Number, filtradas: Number, ofertas: Oferta[] }>(`${base_url}/ofertas?skip=${skip}&limit=${limit}&filtros=${encodeURIComponent(JSON.stringify(filtros))}`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return {total: resp.total, filtradas: limit, ofertas: this.mapearOfertas(resp.ofertas)};
                })
            );
    }

    crearOferta(body: Object) {
        return this.http.post<{ ok: boolean, oferta: Oferta }>(`${base_url}/ofertas`, body, this.usuarioService.headers)
            .pipe(
                map((resp) => {
                    return resp;
                })
            );
    }

    obtenerAreasServicio() {
        return this.http.get<{ ok: boolean, areasServicio: any }>(`${base_url}/ofertas/areasservicio`, this.usuarioService.headers)
            .pipe(
                map((resp) => resp)
            );
    }

    /****/
    cargarOfertasPorAreaServicio(id: string){
        return this.http.get<{ok: Boolean, ofertas: Oferta[] }>(`${base_url}/ofertas/ofertasAreaServicio/${id}`, this.usuarioService.headers)
        .pipe(
            map(resp => {
                return {ok: resp.ok, ofertas: this.mapearOfertas(resp.ofertas)};
            })
        );
    }

   /****/ 

    computeTags(id: string) {
        return this.http.get<{ ok: boolean, oferta: Oferta }>(`${base_url}/ofertas/${id}`, this.usuarioService.headers)
            .pipe(
                map((resp: { ok: boolean, oferta: Oferta }) => resp.oferta)
            );
    }
}
