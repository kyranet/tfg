import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {UsuarioService} from '../services/usuario.service';

@Injectable({
    providedIn: 'root'
})
export class ProfesorGuard implements CanActivate {

    constructor(private authService: AuthService, private usuarioService: UsuarioService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        return this.usuarioService.usuario && this.usuarioService.usuario.esProfesor;
    }
}
