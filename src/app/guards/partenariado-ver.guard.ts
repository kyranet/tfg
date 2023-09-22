import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PartenariadoService } from '../services/partenariado.service';
import { UsuarioService } from '../services/usuario.service';
import { Partenariado } from '../models/partenariado.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartenariadoVerGuard implements CanActivate {

  constructor( private partenariadoService: PartenariadoService, private usuarioService: UsuarioService, private router: Router ) {}

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

      /* // miro si el usuario actual es gestor o profesor/socio de este partenariado
      return this.partenariadoService.cargarPartenariado(next.paramMap.get('id')).pipe(
        map( (partenariado: Partenariado) => {
            partenariado = this.partenariadoService.mapearPartenariados([partenariado])[0];

            let acceso_permitido = false;
            partenariado.profesores.forEach(profesor => {
              if(profesor.uid == this.usuarioService.usuario.uid) {
                acceso_permitido = true;
              }
            });

            partenariado.entidades.forEach(entidad => {
              if(entidad.uid == this.usuarioService.usuario.uid) {
                acceso_permitido = true;
              }
            });
            return acceso_permitido;
          }
        )
      ); */

  }

}
