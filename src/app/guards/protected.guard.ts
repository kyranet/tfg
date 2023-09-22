import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedGuard implements CanActivate {

  constructor( private authService: AuthService,
               private usuarioService: UsuarioService,
               private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      if( !this.usuarioService.usuario ) {
        this.router.navigate(['login']);
        return false;
      }

      return true;
  }

}
