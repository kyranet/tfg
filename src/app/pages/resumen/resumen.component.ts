import { Component, OnInit } from '@angular/core';
import { Oferta } from 'src/app/models/oferta.model';
import { OfertaService } from 'src/app/services/oferta.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'app-resumen',
    templateUrl: './resumen.component.html',
    styleUrls: ['./resumen.component.scss'],
})
export class ResumenComponent implements OnInit {
    public ofertas: Oferta[];
    public filterCreador = ''; 
    public limit = 100

    public terminoBusqueda = ''
    public totalOfertasBuscadas = 0
  
    public cargando = false
    public cargandoTimeOut
  
    public filterProfesores = {}
    public filterAreaServicio = {}
    public filterCuatrimestre = [1, 2, 3] 
    public tags = []
    public tagInput = []; 
    public totalOfertas = 0
    
    constructor(
        public ofertaService: OfertaService,
        public usuarioService: UsuarioService
    ) {
        this.filterCreador = this.usuarioService.usuario.uid;
        this.filterCreador = this.usuarioService.usuario.uid;
    }

    ngOnInit(): void {
      this.cargarOfertas();
    }

    cargarOfertas(): void {
      this.ofertaService
        .cargarOfertas(0, this.limit, this.getFiltros())
        .subscribe(({ total, filtradas, ofertas }) => {
          this.totalOfertas = total.valueOf()
          this.totalOfertasBuscadas = filtradas.valueOf()
          this.ofertas = ofertas
          this.cargando = false
        })
    }


  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
      profesores: this.filterProfesores,
      cuatrimestre: this.filterCuatrimestre.map((v, index, array) =>
        v ? index + 1 : 0,
      ),
      areaServicio: this.filterAreaServicio,
      creador: this.filterCreador,
      tags: this.tagInput.map(x => x.value),
    }
  }
}
