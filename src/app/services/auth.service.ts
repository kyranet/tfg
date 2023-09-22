import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private usuarioService: UsuarioService, private http: HttpClient) { }

  solicitarToken(): Observable<boolean> {

    if(this.usuarioService.token === '') {
      return of(true);
    }

    return this.http.get(`${ base_url }/auth/renewToken`, this.usuarioService.headers)
                    .pipe(
                      map( (resp: any) => {
                        this.usuarioService.setTokenInfo(resp);
                        return true;
                      }),
                      catchError( error => {
                        console.log(error);
                        return of(true);
                      })
                    );
  }


  validarGuestToken(): Observable<boolean> {

    if(this.usuarioService.token === '') {
      return of(true);
    }

    return this.http.get(`${ base_url }/auth/renewToken`, this.usuarioService.headers)
                    .pipe(
                      map( (resp: any) => {
                        return false;
                      }),
                      catchError( error => {
                        console.log(error);
                        return of(true);
                      })
                    );
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${ base_url }/auth/renewToken`, this.usuarioService.headers)
                    .pipe(
                      map( (resp: any) => {
                        this.usuarioService.setTokenInfo(resp);
                        return true;
                      }),
                      catchError( error => {
                        console.log(error);
                        return of(false);
                      })
                    );
  }

}
