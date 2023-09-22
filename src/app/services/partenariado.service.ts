import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Partenariado } from '../models/partenariado.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { FileUploadService } from './file-upload.service';
import { Profesor } from '../models/profesor.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PartenariadoService {

  constructor( private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) { }
 
   mapearPartenariados( partenariados: any ): Partenariado[] {
    return partenariados.map( (partenariado) => {
  
        return new Partenariado( 
          '',
          partenariado._id,
          partenariado.estado,
          partenariado.titulo,
          partenariado.descripcion,
          partenariado.rama,
          partenariado.ciudad,
          //meter atributos 
          '',
          [],
          null,
          '',
          [],  
          partenariado.creador,
          partenariado.createdAt,
          partenariado.id_demanda,
          partenariado.id_oferta,

        );
    });
  }  

  crearPartenariadoProfesor(body: Object) {
    return this.http.post<{ ok: boolean, parteneriado: Partenariado}>(`${ base_url }/partenariados/crearProfesor`, body, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }

 /*  cargarPartenariado(id: string) {
    return this.http.get<{ ok: boolean, partenariado: Partenariado}>(`${ base_url }/partenariados/${ id }`, this.usuarioService.headers)
                    .pipe(
                      map( (resp: {ok: boolean, partenariado: Partenariado}) => this.mapearPartenariados([resp.partenariado])[0] )
                    );
  } */

  cargarPartenariados(skip: number, limit: number, filtros: Object) {
    return this.http.get<{ total: Number, filtradas: Number, partenariados: Partenariado[]}>(`${ base_url }/partenariados?skip=${ skip }&limit=${ limit }&filtros=${ encodeURIComponent( JSON.stringify(filtros)) }`, this.usuarioService.headers)
                    .pipe(
                      map( resp => {
                         return { total: resp.total, filtradas: resp.filtradas, partenariados: this.mapearPartenariados(resp.partenariados) }; 
                        })
                    );
  } 

  cambiarEstado(partenariado: Partenariado, estado: string) {
    return this.http.put<{ ok: boolean, partenariado: Partenariado}>(`${ base_url }/partenariados/modificar-estado/${ partenariado._id }`, {estado}, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }

  enviarMensaje(partenariado: Partenariado, mensaje: string) {
    return this.http.post<{ ok: boolean, partenariado: Partenariado}>(`${ base_url }/partenariados/enviar-mensaje/${ partenariado._id }`, {mensaje}, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }


  obtenerProfesores() {
    return this.http.get<{ ok: boolean, profesores: Profesor[]}>(`${ base_url }/usuarios/profesores`, this.usuarioService.headers)
                    .pipe(
                      map( 
                        resp => {return {ok: resp.ok, profesores: resp.profesores}} )
                    );
  }

}
