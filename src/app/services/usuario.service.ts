import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Profesor } from '../models/profesor.model';

declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  setTokenInfo(resp: any) {
    if(!resp.usuario) {
      this.usuario = null;
      localStorage.setItem('token', '');
      return;
    }
    const { uid, rol, email, nombre, apellidos, origin_login, origin_img, universidad, titulacion, sector,facultad, areaConocimiento, nombreSocioComunitario, terminos_aceptados , telefono, url, mision} = resp.usuario;
    this.usuario = new Usuario( uid, rol, email, nombre, apellidos, origin_login, origin_img || '', universidad || '', titulacion || '', sector || '', facultad || '',  areaConocimiento || null,nombreSocioComunitario || '', terminos_aceptados || false, telefono || null, url || '', mision || '');
    localStorage.setItem('token', resp.token);
  }



  crearUsuario(formData: RegisterForm ) {
    return this.http.post(`${ base_url }/usuarios`, formData)
               .pipe(
                 tap( (resp: any) => {
                    this.setTokenInfo(resp);
                 })
               );
  }

  cargarUsuarioPorEmail(email:string){
    return this.http.get<{ ok: boolean, usuario: Usuario}>(`${ base_url}/usuarios/email/${email}`, this.headers)
                    .pipe(
                      map((resp: {ok:boolean, usuario: Usuario}) => resp.usuario)
                    );
  }

  actualizarUsuario(usuario: Usuario) {
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }

  actualizarPerfil(formData: RegisterForm ) {
    return this.http.put(`${ base_url }/usuarios/${ this.usuario.uid }`, formData, this.headers)
               .pipe(
                 tap( (resp: any) => {
                    this.setTokenInfo(resp);
                 })
               );
  }

  loginExterno(formData: LoginForm ) {
    return this.http.post(`${ base_url }/auth/login`, formData)
               .pipe(
                 tap( (resp: any) => {
                    this.setTokenInfo(resp);
                 })
               );
  }

  loginUned(formData: LoginForm ) {
    return this.http.post(`${ base_url }/auth/login/uned`, formData)
               .pipe(
                 tap( (resp: any) => {
                    this.setTokenInfo(resp);
                 })
               );
  }

googleInit() {
    return new Promise( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '392312378943-7hunt8gk24in1hepdfmvgmk1ae4i7e26.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });

        //resolve();
      });
    });
}

  loginGoogle( token ) {
    return this.http.post(`${ base_url }/auth/login/google`, { token })
               .pipe(
                 tap( (resp: any) => {
                    this.setTokenInfo(resp);
                 })
               );
  }

  logout() {

    // salida google
    if(this.usuario.origin_login === 'google') {

      this.usuario = null;
      localStorage.removeItem('token');

      this.auth2.signOut().then(() => {
        this.ngZone.run(() => {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/']);

        });
      });
    }

    // salida normal
    else {
      this.usuario = null;
      localStorage.removeItem('token');

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/']);
    }
  }

  mapearUsuarios( usuarios: any ): Usuario[] {
    return usuarios.map(
      (user) => {
        if(!user) { return null; }
        //return new Usuario(user.uid || user.id || user._id, user.rol, user.email, user.nombre, user.apellidos, user.origin_login, user.origin_img || '', user.universidad || '', user.titulacion || '', user.sector || '',user.nombreS || '', user.terminos_aceptados || false, user.telefono || null);
        return new Usuario(user.uid || user.id || user._id,
          user.rol,
          user.correo,
          user.nombre, 
          user.apellidos,
          user.origin_login || '',
          user.origin_img || undefined,
          user.universidad || null,
          user.titulacion || null,
          user.sector || null,
          user.facultad || null,
          user.areaConocimiento || null,
          user.nombre_socioComunitario || null,
          user.terminos_aceptados,
          user.telefono || null,
          user.url || null,
          user.mision || null,
          user.avatar || null);
      }

    );
  }

  cargarUsuario(uid: string) {
    return this.http.get<{ ok: boolean, usuario: Usuario}>(`${ base_url }/usuarios/${ uid }`, this.headers)
                    .pipe(
                      map( (resp: {ok: boolean, usuario: Usuario}) => resp.usuario )
                    );
  }

  cargarUsuarios(skip: number, limit: number, filtros: Object) {
    return this.http.get<{ total: Number, filtradas: Number, usuarios: Usuario[]}>(`${ base_url }/usuarios?skip=${ skip }&limit=${ limit }&filtros=${ encodeURIComponent( JSON.stringify(filtros)) }`, this.headers)
                    .pipe(
                      map( resp => { return { total: resp.total, filtradas: resp.filtradas, usuarios: this.mapearUsuarios(resp.usuarios) }; })
                    );
  }

  borrarUsuario(usuario: Usuario) {
    return this.http.delete(`${ base_url }/usuarios/${ usuario.uid }`, this.headers);
  }

  getAvatar() {
    return this.http.get<{ ok: boolean, usuario: Usuario}>(`${ base_url }/usuarios`, this.headers)
                    .pipe(
                      map( (resp: {ok: boolean, usuario: Usuario}) => resp.usuario )
                    );
  }
 
  getAvatarPath(usuario: string) {
    return this.http.get<{ ok: boolean, path: string}>(`${ base_url }/usuarios/avatar/${usuario}`, this.headers)
                    .pipe(
                      map( (resp: {ok: boolean, path: string}) => resp.path )
                    );
  }

  getSocios(){
    return this.http.get<{ ok: boolean, socios: Profesor[]}>(`${ base_url }/usuarios/socios`, this.headers)
                    .pipe(
                      map(resp =>{return {ok:resp.ok, socios: resp.socios}}));
  }
 
}
