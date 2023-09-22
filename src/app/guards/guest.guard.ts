import { Injectable } from '@angular/core';
import { CanActivate, CanLoad,ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      // si está autenticado, redirigele a home. Sirve para que no entre en login ni registro, pero no valida nada!
      if( this.usuarioService.usuario ) {
        this.router.navigate(['/']);
      }

      return true;
  }
}
