import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Proyecto } from '../models/proyecto.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { FileUploadService } from './file-upload.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor( private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) { }

  mapearProyectos( proyectos: any ): Proyecto[] {
    return proyectos.map( (proyecto) => {
        return new Proyecto(
          proyecto._id,
          proyecto.estado,
          proyecto.titulo,
          proyecto.descripcion,
          proyecto.rama,
          proyecto.ciudad,
          proyecto.partenariado,
          this.usuarioService.mapearUsuarios(proyecto.profesores),
          this.usuarioService.mapearUsuarios(proyecto.sociosComunitarios),
          this.usuarioService.mapearUsuarios(proyecto.estudiantes),
          proyecto.mensajes || {},
          this.fileUploadService.mapearUploads(proyecto.archivos || []),
          this.usuarioService.mapearUsuarios([proyecto.proponedor])[0],
          proyecto.creador,
          proyecto.createdAt
        );
    });
  }

  cargarProyecto(id: string) {
    return this.http.get<{ ok: boolean, proyecto: Proyecto}>(`${ base_url }/proyectos/${ id }`, this.usuarioService.headers)
                    .pipe(
                      map( (resp: {ok: boolean, proyecto: Proyecto}) => this.mapearProyectos([resp.proyecto])[0] )
                    );
  }

  cargarProyectos(skip: number, limit: number, filtros: Object) {

    return this.http.get<{ total: Number, filtradas: Number, proyectos: Proyecto[]}>(`${ base_url }/proyectos?skip=${ skip }&limit=${ limit }&filtros=${ encodeURIComponent( JSON.stringify(filtros)) }`, this.usuarioService.headers)
                    .pipe(
                      map( resp => { return { total: resp.total, filtradas: resp.filtradas, proyectos: this.mapearProyectos(resp.proyectos) }; })
                    );
  }

  cambiarEstado(proyecto: Proyecto, estado: string) {
    return this.http.put<{ ok: boolean, proyecto: Proyecto}>(`${ base_url }/proyectos/modificar-estado/${ proyecto._id }`, {estado}, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }

  enviarMensaje(proyecto: Proyecto, mensaje: string) {
    return this.http.post<{ ok: boolean, proyecto: Proyecto}>(`${ base_url }/proyectos/enviar-mensaje/${ proyecto._id }`, {mensaje}, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }




}
