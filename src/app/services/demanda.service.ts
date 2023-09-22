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

  constructor( private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) { }

  obtenerDemanda(){
    return this.http.get<{ ok: boolean, demanda: any}>(`${ base_url }/demandas/demanda/136`,this.usuarioService.headers)
    .pipe(
      map( (resp) => resp)
    );
  }

  crearDemanda(body: Object) {
    return this.http.post<{ ok: boolean, Demanda: Demanda}>(`${ base_url }/demandas`, body, this.usuarioService.headers)
                    .pipe(
                      map( (resp) => { return resp; } )
                    );
  }

  obtenerAreasServicio(){
    return this.http.get<{ ok: boolean, areaServicio: any}>(`${ base_url }/demandas/areasservicio`,this.usuarioService.headers)
    .pipe(
      map( (resp) => resp)
    );
  }
  obtenerNecesidades(){
    return this.http.get<{ ok: boolean, necesidadSocial: any}>(`${ base_url }/demandas/necesidadsocial`,this.usuarioService.headers)
    .pipe(
      map( (resp) => resp)
    );
  }
  obtenerTitulaciones(){
    return this.http.get<{ ok: boolean, titulacionLocal: any}>(`${ base_url }/demandas/titulacionlocal`,this.usuarioService.headers)
    .pipe(
      map( (resp) => resp)
    );
  }
}