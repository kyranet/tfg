import { Component, OnInit } from '@angular/core';
import { PartenariadoService } from 'src/app/services/partenariado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Partenariado } from 'src/app/models/partenariado.model';
import Swal from 'sweetalert2';

import { RAMAS } from '../../models/rama.model';
import { CIUDADES } from '../../models/ciudad.model';
import { ESTADOS_PARTENARIADOS } from '../../models/estado-partenariado.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-partenariados',
  templateUrl: './partenariados.component.html',
  styleUrls: ['./partenariados.component.scss']
})
export class PartenariadosComponent implements OnInit {

  public RAMAS = RAMAS;
  public CIUDADES = CIUDADES;
  public ESTADOS_PARTENARIADOS = ESTADOS_PARTENARIADOS;
  public pageTitle = 'Partenariados'

  public skip: number = 0;
  public limit: number = 5;
  public pagina_actual: number = 1;

  public totalPartenariados: number = 0;
  public partenariados: Partenariado[];

  public terminoBusqueda: string = '';
  public totalPartenariadosBuscados: number = 0;

  public cargando: boolean = false;
  public cargandoTimeOut;

  public filterRamas = {};
  public filterCiudades = {};

  public filterEstado = '';
  public filterFaltando = '';
  public filterCreador = '';


  constructor( public partenariadoService: PartenariadoService, public usuarioService: UsuarioService, private router: Router) {
    RAMAS.forEach(RAMA => {this.filterRamas[RAMA] = false;});
    CIUDADES.forEach(CIUDAD => {this.filterCiudades[CIUDAD] = false;});

    if(this.router.url === '/mis-partenariados') {
      this.filterCreador = this.usuarioService.usuario.uid;
      this.pageTitle = 'Mis Partenariados';
    }
   }

  tienePermisoEdicion(partenariado: Partenariado) {

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

      if(!partenariado) {
        return false;
      }

      let acceso_permitido = false;
      partenariado.profesores.forEach(profesor => {
        if(profesor.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      partenariado.sociosComunitarios.forEach(socio => {
        if(socio.uid == this.usuarioService.usuario.uid) {
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
    const minResultados = Math.min(this.totalPartenariados, this.totalPartenariadosBuscados);

    if(minResultados === 0) {
      return 0;
    }

    return this.skip + 1;
  }

  get lastPageRecord() {
    return Math.min(Math.min(this.totalPartenariados, this.totalPartenariadosBuscados), this.skip + this.limit);
  }


  ngOnInit(): void {
    this.cargarPartenariados();
  }

  cambiarPagina( per_page: number ) {
    this.skip += per_page;

    if(this.skip < 0) { this.skip = 0; }
    if(this.skip >= Math.min(this.totalPartenariados, this.totalPartenariadosBuscados)) { this.skip -= per_page; }

    this.cargarPartenariados();
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

  cargarPartenariados() {
    this.partenariadoService.cargarPartenariados(this.skip, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, partenariados}) => {
          this.totalPartenariados = total.valueOf();
          //this.totalPartenariadosBuscados = filtradas.valueOf();
          this.partenariados = partenariados;
          this.cargando = false;
        }); 
  }

  notNull(e) {
    return e !== null;
  }

}
