import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';
import { IniciativaService } from '../services/iniciativa.service';
import { first, map } from 'rxjs/operators';
import { Iniciativa } from '../models/iniciativa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IniciativaEditarGuard implements CanActivate {

  constructor( private iniciativaService: IniciativaService, private usuarioService: UsuarioService, private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

      if( !this.usuarioService.usuario ) {
        return false;
      }

      if(    ! this.usuarioService.usuario.esGestor
          && ! this.usuarioService.usuario.esProfesor
          && ! this.usuarioService.usuario.esSocioComunitario
      ) {
        return false;
      }

      if( this.usuarioService.usuario.esGestor ) {
        return true;
      }

      // miro si el proponedor es el usuario actual
      return this.iniciativaService.cargarIniciativa(next.paramMap.get('id')).pipe(
        map( (iniciativa: Iniciativa) => {
            iniciativa = this.iniciativaService.mapearIniciativas([iniciativa])[0];
            return iniciativa.proponedor.uid === this.usuarioService.usuario.uid;
          }
        )
      );
  }

}
