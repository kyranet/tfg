import {Component, OnDestroy} from '@angular/core';
import {Router, ActivationEnd} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {

    public routeExtraData$: Subscription;

    constructor(public usuarioService: UsuarioService, private router: Router) {
        this.routeExtraData$ = this.getRouteExtraData()
            .subscribe(({titulo}) => {
                document.title = titulo;
            });
    }

    ngOnDestroy(): void {
        this.routeExtraData$.unsubscribe();
    }


    get isLoggedIn() {
        return this.usuarioService.usuario != null;
    }

    get esGestor() {
        return this.usuarioService.usuario.esGestor != null;
    }

    getRouteExtraData() {
        return this.router.events
            .pipe(
                filter(event => event instanceof ActivationEnd),
                filter((event: ActivationEnd) => event.snapshot.firstChild === null),
                map((event: ActivationEnd) => event.snapshot.data),
            );
    }

    logout() {
        this.usuarioService.logout();
    }

    getUniversidad() {
        return this.usuarioService.usuario ? this.usuarioService.usuario.universidad : 'UNED';
    }

    mostrarOfertasDeServicio() {
        return this.usuarioService.usuario && (this.usuarioService.usuario.esGestor
            || this.usuarioService.usuario.esProfesor
            || this.usuarioService.usuario.esSocioComunitario);
    }

    mostrarDemandasDeServicio() {
        return this.usuarioService.usuario && (this.usuarioService.usuario.esGestor
            || this.usuarioService.usuario.esProfesor
            || this.usuarioService.usuario.esSocioComunitario);
    }

    mostrarPartenariados() {
        return this.usuarioService.usuario && (this.usuarioService.usuario.esGestor
            || this.usuarioService.usuario.esSocioComunitario);
    }
}
