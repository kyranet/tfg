import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Notificacion} from '../models/notificacion.model';
import {map, skip} from 'rxjs/operators';
import {UsuarioService} from './usuario.service';
import {FileUploadService} from './file-upload.service';


const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    constructor(private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {
    }

    mapearNotificaciones(notificaciones: any):Notificacion[]{
        return notificaciones.map(
            notificacion => new Notificacion(
                notificacion.id,
                notificacion.idDestino,
                notificacion.leido,
                notificacion.titulo,
                notificacion.mensaje,
                notificacion.fecha_fin,
                notificacion.emailOrigen,
                notificacion.idOferta,
                notificacion.tituloOferta,
                notificacion.pendiente,
                notificacion.idPartenariado,
                notificacion.idDemanda,
                notificacion.tituloDemanda
            )
        );
    }
    cargarNotificaciones(uid: string) {
        return this.http.get<{ total: Number, notificaciones: Notificacion[] }>(`${base_url}/notificaciones?idUser=${uid}`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return {total: resp.total, notificaciones: this.mapearNotificaciones(resp.notificaciones)};
                })
            );
    }

    cargarNotificacion(id:string){
        return this.http.get<{ok: boolean, notificacion:Notificacion}>(`${base_url}/notificaciones/ver/${id}`, this.usuarioService.headers)
        .pipe(
            map((resp:{ok:boolean, notificacion: Notificacion}) =>resp.notificacion)

        );
    }

    crearNotificacionOfertaAceptada(idOferta:string, uid:string){
        return this.http.get<{ok: boolean, notificacion:Notificacion}>(`${base_url}/notificaciones/crearOfertaAceptada?idOferta=${idOferta}&idSocio=${uid}`, this.usuarioService.headers)
        .pipe(
            map((resp:{ok:boolean, notificacion:Notificacion}) => resp.ok)
        );
    }

    rechazarSocio(idNotificacion){
        return this.http.get<{ok: boolean}>(`${base_url}/notificaciones/respuesta/rechazar?idNotificacion=${idNotificacion}`,this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }
    AceptarSocio(idNotificacion, idPartenariado){
        return this.http.get<{ok: boolean}>(`${base_url}/notificaciones/respuesta/aceptar?idNotificacion=${idNotificacion}&idPartenariado=${idPartenariado}`,this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }

    crearpartenariadoRellenado(idPartenariado: string) {
        return this.http.get<{ok: boolean}>(`${base_url}/notificaciones/partenariadohecho?idPartenariado=${idPartenariado}`,this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }

    RespaldarDemanda(body: object) {
        return this.http.post<{ok: boolean}>(`${base_url}/notificaciones/respaldarDemanda`,body, this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }

}