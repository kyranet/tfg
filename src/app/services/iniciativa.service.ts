import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Iniciativa } from '../models/iniciativa.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { FileUploadService } from './file-upload.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class IniciativaService {

  constructor( private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) { }

  mapearIniciativas( iniciativas: any ): Iniciativa[] {
    return iniciativas.map(
      iniciativa => new Iniciativa(iniciativa._id, iniciativa.estado, iniciativa.titulo, iniciativa.descripcion, iniciativa.imagen || '', iniciativa.rama, iniciativa.ciudad, iniciativa.partenariados || [], this.fileUploadService.mapearUploads(iniciativa.archivos || []), this.usuarioService.mapearUsuarios([iniciativa.proponedor])[0], iniciativa.creador, iniciativa.createdAt)
    );
  }

  cargarIniciativa(id: string) {
    return this.http.get<{ ok: boolean, iniciativa: Iniciativa}>(`${ base_url }/iniciativas/${ id }`, this.usuarioService.headers)
                    .pipe(
                      map( (resp: {ok: boolean, iniciativa: Iniciativa}) => resp.iniciativa )
                    );
  }

  cargarIniciativas(skip: number, limit: number, filtros: Object) {

    return this.http.get<{ total: Number, filtradas: Number, iniciativas: Iniciativa[]}>(`${ base_url }/iniciativas?skip=${ skip }&limit=${ limit }&filtros=${ encodeURIComponent( JSON.stringify(filtros)) }`, this.usuarioService.headers)
                    .pipe(
                      map( resp => { return { total: resp.total, filtradas: resp.filtradas, iniciativas: this.mapearIniciativas(resp.iniciativas) }; })
                    );
  }

  respaldarIniciativa(iniciativa: Iniciativa) {
    return this.http.put<{ ok: boolean, iniciativa: Iniciativa}>(`${ base_url }/iniciativas/respaldar/${ iniciativa._id }`, {}, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }

  crearIniciativa(body: Object) {
    return this.http.post<{ ok: boolean, iniciativa: Iniciativa}>(`${ base_url }/iniciativas`, body, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }

  actualizarIniciativa(iniciativa: Iniciativa, body: Object) {
    return this.http.put<{ ok: boolean, iniciativa: Iniciativa}>(`${ base_url }/iniciativas/${ iniciativa._id }`, body, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }



  archivarIniciativa(iniciativa: Iniciativa) {
    return this.http.delete(`${ base_url }/iniciativas/${ iniciativa._id }`, this.usuarioService.headers);
  }


  desarchivarIniciativa(iniciativa: Iniciativa) {
    return this.http.put<{ ok: boolean, iniciativa: Iniciativa}>(`${ base_url }/iniciativas/reabrir/${ iniciativa._id }`, { estado: 'Abierta' }, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }


}
