import { Component } from '@angular/core';
import { IniciativasCrearComponent } from '../iniciativas-crear/iniciativas-crear.component';
import { first } from 'rxjs/operators';
import { Iniciativa } from 'src/app/models/iniciativa.model';

@Component({
  selector: 'app-iniciativas-editar',
  templateUrl: './../iniciativas-crear/iniciativas-crear.component.html',
  styleUrls: ['./../iniciativas-crear/iniciativas-crear.component.scss']
})
export class IniciativasEditarComponent extends IniciativasCrearComponent {

  async cargarIniciativa() {

    await this.activatedRoute.params.pipe(first()).toPromise().then( (params) => { this.iniciativa_id = params.id; });

    await this.iniciativaService.cargarIniciativa(this.iniciativa_id).pipe(first()).toPromise().then( (iniciativa: Iniciativa) => {
      this.iniciativa = this.iniciativaService.mapearIniciativas([iniciativa])[0];
    });
  }

  observableEnviarIniciativa() {
    return this.iniciativaService.actualizarIniciativa(this.iniciativa, this.crearIniciativaForm.value);
  }

}
