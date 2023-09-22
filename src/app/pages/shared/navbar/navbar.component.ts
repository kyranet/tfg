import {Component, OnDestroy} from '@angular/core';
import {Router, ActivationEnd} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {UsuarioService} from '../../../services/usuario.service';
import { Notificacion } from 'src/app/models/notificacion.model';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'
            ]
})
export class NavbarComponent implements OnDestroy {
    public totalNotificaciones = 0;
    public routeExtraData$: Subscription;
    public notificaciones: Notificacion[];

    constructor(public usuarioService: UsuarioService, private router: Router, public notificacionService: NotificacionService) {
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
            || this.usuarioService.usuario.esProfesor);
    }

    mostrarPartenariados() {
        return this.usuarioService.usuario && (this.usuarioService.usuario.esGestor
            || this.usuarioService.usuario.esSocioComunitario);
    }

    cargarNotificacion(){
        this.notificacionService.cargarNotificaciones(this.usuarioService.usuario.uid).subscribe(({ total,  notificaciones }) => {
            this.totalNotificaciones = total.valueOf();
            this.notificaciones = notificaciones;
            this.notificaciones.map(n => n.leido == "1");
        });

    }

}
