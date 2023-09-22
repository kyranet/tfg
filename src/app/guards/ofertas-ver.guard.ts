import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {OfertaService} from '../services/oferta.service';
import {UsuarioService} from '../services/usuario.service';

@Injectable({
    providedIn: 'root'
})
export class OfertaVerGuard implements CanActivate {

    constructor(private ofertaService: OfertaService, private usuarioService: UsuarioService, private _: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {

        return this.usuarioService.usuario && (this.usuarioService.usuario.esGestor
            || this.usuarioService.usuario.esProfesor
            || this.usuarioService.usuario.esSocioComunitario);
    }
}
