import { Component, OnInit } from '@angular/core';
import { Oferta } from 'src/app/models/oferta.model';
import { OfertaService } from 'src/app/services/oferta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { NotificacionService } from './../../services/notificacion.service';

@Component({
    selector: 'app-ofertas-ver',
    templateUrl: './ofertas-ver.component.html',
    styleUrls: ['./ofertas-ver.component.scss']
})
export class OfertasVerComponent implements OnInit {

    public oferta: Oferta;

    constructor(public ofertaService: OfertaService, public activatedRoute: ActivatedRoute, public router: Router, public usuarioService: UsuarioService, public notificacionService : NotificacionService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ id }) => {
            this.cargarOferta(id);
        });
    }

    cargarOferta(id: string) {
        this.ofertaService.cargarOferta(id).subscribe((oferta: Oferta) => {
            if (!oferta) {
                return this.router.navigateByUrl(`/ofertas`);
            }
            this.oferta = this.ofertaService.mapearOfertas([oferta])[0];
            console.log(this.oferta);
        });
    }

    aceptarOferta() {
        this.notificacionService.crearNotificacionOfertaAceptada(this.oferta.id, this.usuarioService.usuario.uid).subscribe(res =>{
            if(res){
                Swal.fire(
                    'Enhorabuena ',
                    'Ya ha enviado su petición',
                    'success'
                );
            }
            else{
                Swal.fire(
                    'Error',
                    'No se ha enviado su petición',
                    'warning'
                );
            }
        });
    }
}
