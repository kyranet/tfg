import { Component, OnInit } from '@angular/core';
import { Demanda } from 'src/app/models/demanda.model';
import { DemandaService } from 'src/app/services/demanda.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-demandas-ver',
    templateUrl: './demandas-ver.component.html',
    styleUrls: ['./demandas-ver.component.scss']
})
export class DemandasVerComponent implements OnInit {

    public demanda: Demanda;
    public area: any;

    constructor(public demandaService: DemandaService, public activatedRoute: ActivatedRoute, public router: Router, public usuarioService: UsuarioService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ id }) => {
            this.cargarDemanda(id);
        });
    }

    cargarDemanda(id: string) {
        this.demandaService.cargarDemanda(id).subscribe((demanda: Demanda) => {
            console.log('pesao -> ', demanda)

            if (!demanda) {
                return this.router.navigateByUrl(`/demandas`);
            }
            this.demanda = this.demandaService.mapearDemandas([demanda])[0];
            this.area = demanda.area_servicio;
            console.log(this.demanda)
        });
    }

    crearPartenariado() {
        return this.router.navigate(['/partenariados/profesor/crear'], { queryParams: { demanda_id: this.demanda.id } });
    }
}
