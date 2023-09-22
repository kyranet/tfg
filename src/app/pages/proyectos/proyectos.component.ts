import { Component, OnInit } from '@angular/core';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Proyecto } from 'src/app/models/proyecto.model';
import Swal from 'sweetalert2';

import { RAMAS } from '../../models/rama.model';
import { CIUDADES } from '../../models/ciudad.model';
import { ESTADOS_PROYECTOS } from '../../models/estado-proyecto.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  public RAMAS = RAMAS;
  public CIUDADES = CIUDADES;
  public ESTADOS_PROYECTOS = ESTADOS_PROYECTOS;

  public skip: number = 0;
  public limit: number = 5;
  public pagina_actual: number = 1;

  public totalProyectos: number = 0;
  public proyectos: Proyecto[];

  public terminoBusqueda: string = '';
  public totalProyectosBuscados: number = 0;

  public cargando: boolean = false;
  public cargandoTimeOut;

  public filterRamas = {};
  public filterCiudades = {};

  public filterEstado = '';
  public filterFaltando = '';
  public filterCreador = '';


  constructor( public proyectoService: ProyectoService, public usuarioService: UsuarioService, private router: Router) {
    RAMAS.forEach(RAMA => {this.filterRamas[RAMA] = false;});
    CIUDADES.forEach(CIUDAD => {this.filterCiudades[CIUDAD] = false;});

    if(this.router.url === '/mis-proyectos') {
      this.filterCreador = this.usuarioService.usuario.uid;
    }
   }


  tienePermisoEdicion(proyecto: Proyecto) {

      if( !this.usuarioService.usuario ) {
        return false;
      }

      if(    ! this.usuarioService.usuario.esGestor
          && ! this.usuarioService.usuario.esProfesor
          && ! this.usuarioService.usuario.esSocioComunitario
      ) {
        return false;
      }

      if( this.usuarioService.usuario.esGestor ) {
        return true;
      }

      if(!proyecto) {
        return false;
      }

      let acceso_permitido = false;
      proyecto.profesores.forEach(profesor => {
        if(profesor.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      proyecto.sociosComunitarios.forEach(entidad => {
        if(entidad.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      proyecto.estudiantes.forEach(estudiante => {
        if(estudiante.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      return acceso_permitido;

  }

  get prevLimit() {
    return -1 * this.limit;
  }

  get nextLimit() {
    return this.limit;
  }

  get firstPageRecord() {
    const minResultados = Math.min(this.totalProyectos, this.totalProyectosBuscados);

    if(minResultados === 0) {
      return 0;
    }

    return this.skip + 1;
  }

  get lastPageRecord() {
    return Math.min(Math.min(this.totalProyectos, this.totalProyectosBuscados), this.skip + this.limit);
  }


  ngOnInit(): void {
    this.cargarProyectos();
  }

  cambiarPagina( per_page: number ) {
    this.skip += per_page;

    if(this.skip < 0) { this.skip = 0; }
    if(this.skip >= Math.min(this.totalProyectos, this.totalProyectosBuscados)) { this.skip -= per_page; }

    this.cargarProyectos();
  }


  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
      ramas: this.filterRamas,
      ciudades: this.filterCiudades,
      estado: this.filterEstado,
      faltando: this.filterFaltando,
      creador: this.filterCreador,
    };
  }

  cargarProyectos() {
    this.proyectoService.cargarProyectos(this.skip, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, proyectos}) => {
          this.totalProyectos = total.valueOf();
          this.totalProyectosBuscados = filtradas.valueOf();
          this.proyectos = proyectos;
          this.cargando = false;
        });
  }

  notNull(e) {
    return e !== null;
  }

}
