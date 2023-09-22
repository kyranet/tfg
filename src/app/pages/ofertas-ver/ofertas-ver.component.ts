import { Component, OnInit } from '@angular/core';
import { Oferta } from 'src/app/models/oferta.model';
import { OfertaService } from 'src/app/services/oferta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-ofertas-ver',
    templateUrl: './ofertas-ver.component.html',
    styleUrls: ['./ofertas-ver.component.scss']
})
export class OfertasVerComponent implements OnInit {

    public oferta: Oferta;

    constructor(public ofertaService: OfertaService, public activatedRoute: ActivatedRoute, public router: Router, public usuarioService: UsuarioService) {
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
        });
    }

    crearPartenariado() {
        Swal.fire(
            'Atención',
            'Antes de crear un partenariado debes completar los datos de la demanda',
            'warning'
        );
        return this.router.navigate(['/demandas/crear'], { queryParams: { oferta_id: this.oferta.id } });
    }
}
