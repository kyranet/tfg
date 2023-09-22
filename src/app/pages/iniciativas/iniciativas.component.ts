import { Component, OnInit } from '@angular/core';
import { IniciativaService } from 'src/app/services/iniciativa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Iniciativa } from 'src/app/models/iniciativa.model';
import Swal from 'sweetalert2';

import { RAMAS } from '../../models/rama.model';
import { CIUDADES } from '../../models/ciudad.model';
import { ESTADOS_INICIATIVAS } from '../../models/estado-iniciativa.model';
import { IniciativaCrearGuard } from 'src/app/guards/iniciativa-crear.guard';
import { Router } from '@angular/router';


@Component({
  selector: 'app-iniciativas',
  templateUrl: './iniciativas.component.html',
  styleUrls: ['./iniciativas.component.scss']
})
export class IniciativasComponent implements OnInit {

  public RAMAS = RAMAS;
  public CIUDADES = CIUDADES;
  public ESTADOS_INICIATIVAS = ESTADOS_INICIATIVAS;

  public skip: number = 0;
  public limit: number = 5;
  public pagina_actual: number = 1;

  public totalIniciativas: number = 0;
  public iniciativas: Iniciativa[];

  public terminoBusqueda: string = '';
  public totalIniciativasBuscados: number = 0;

  public cargando: boolean = false;
  public cargandoTimeOut;

  public filterRamas = {};
  public filterCiudades = {};

  public filterEstado = 'Abierta';
  public filterProponedor = '';
  public filterCreador = '';

  constructor( public iniciativaCrearGuard: IniciativaCrearGuard, public iniciativaService: IniciativaService, public usuarioService: UsuarioService, private router: Router) {
    RAMAS.forEach(RAMA => {this.filterRamas[RAMA] = false;});
    CIUDADES.forEach(CIUDAD => {this.filterCiudades[CIUDAD] = false;});
    if(this.router.url === '/mis-iniciativas') {
      this.filterCreador =this.usuarioService.usuario.uid;
    }
   }

  get prevLimit() {
    return -1 * this.limit;
  }

  get nextLimit() {
    return this.limit;
  }

  get firstPageRecord() {
    const minResultados = Math.min(this.totalIniciativas, this.totalIniciativasBuscados);

    if(minResultados === 0) {
      return 0;
    }

    return this.skip + 1;
  }

  get lastPageRecord() {
    return Math.min(Math.min(this.totalIniciativas, this.totalIniciativasBuscados), this.skip + this.limit);
  }


  ngOnInit(): void {
    this.cargarIniciativas();
  }

  cambiarPagina( per_page: number ) {
    this.skip += per_page;

    if(this.skip < 0) { this.skip = 0; }
    if(this.skip >= Math.min(this.totalIniciativas, this.totalIniciativasBuscados)) { this.skip -= per_page; }

    this.cargarIniciativas();
  }


  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
      ramas: this.filterRamas,
      ciudades: this.filterCiudades,
      estado: this.filterEstado,
      proponedor: this.filterProponedor,
      creador: this.filterCreador,
    };
  }

  cargarIniciativas() {
    this.iniciativaService.cargarIniciativas(this.skip, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, iniciativas}) => {
          this.totalIniciativas = total.valueOf();
          this.totalIniciativasBuscados = filtradas.valueOf();
          this.iniciativas = iniciativas;
          this.cargando = false;
        });
  }


  archivarIniciativa(iniciativa: Iniciativa) {
    if(iniciativa.estado !== 'Abierta') {
      Swal.fire( 'Error', 'Esta iniciativa ya ha sido archivada.', 'error' );
      return;
    }

    Swal.fire({
      title: 'Archivar iniciativa',
      html: `La iniciativa <b>${ iniciativa.titulo}</b> va a ser archivada y no podrán generarse partenariados ni proyectos a partir de ella. Esta acción no podrá ser deshecha sin contactar con el gestor del portal. ¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, archivar iniciativa'
    }).then((result) => {
      if (result.value) {
        this.iniciativaService.archivarIniciativa(iniciativa)
            .subscribe( () => {
              this.cargarIniciativas();
              Swal.fire( 'Iniciativa archivada', 'El iniciativa ha sido archivada', 'success' );
            } );

      }
    });
  }

  desarchivarIniciativa(iniciativa: Iniciativa) {
    if(iniciativa.estado === 'Abierta') {
      Swal.fire( 'Error', 'Esta iniciativa no está archivada.', 'error' );
      return;
    }

    this.iniciativaService.desarchivarIniciativa(iniciativa)
        .subscribe( () => {
          this.cargarIniciativas();
          Swal.fire( 'Iniciativa reabierta', 'El iniciativa ha sido reabierta', 'success' );
        } );

  }


}
