import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IniciativaService } from 'src/app/services/iniciativa.service';
import { Iniciativa } from 'src/app/models/iniciativa.model';
import { Partenariado } from 'src/app/models/partenariado.model';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iniciativas-ver',
  templateUrl: './iniciativas-ver.component.html',
  styleUrls: ['./iniciativas-ver.component.scss']
})
export class IniciativasVerComponent implements OnInit {

  public iniciativa: Iniciativa;
  public partenariados: Partenariado[];

  constructor(public iniciativaService: IniciativaService, public usuarioService: UsuarioService, public router: Router, public activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarIniciativa(id);
    });
  }

  cargarIniciativa(id: string) {

    // ver o editar la iniciativa
    this.iniciativaService.cargarIniciativa(id).subscribe( (iniciativa: Iniciativa) => {

      // si no hay iniciativa, le devuelvo al listado de iniciativas
      if (!iniciativa) {
        return this.router.navigateByUrl(`/iniciativas`);
      }

      this.iniciativa = this.iniciativaService.mapearIniciativas([iniciativa])[0];
    });
  }

  respaldar() {
    this.iniciativaService.respaldarIniciativa(this.iniciativa)
        .subscribe( (resp: any) => {
          if(resp.ok) {
            Swal.fire( 'Partenariado creado', 'La iniciativa ha sido respaldada correctamente y se ha creado el partenariado correspondiente.', 'success' );
            this.cargarIniciativa(this.iniciativa._id);
          } else {
            Swal.fire('Error', resp?.msg || 'No se ha podido respaldar la iniciativa', 'error');
          }
        } );
  }
}
