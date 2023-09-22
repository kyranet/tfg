import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {

  public skip: number = 0;
  public limit: number = 5;
  public pagina_actual: number = 1;

  public totalUsuarios: number = 0;
  public usuarios: Usuario[];

  public terminoBusqueda: string = '';
  public totalUsuariosBuscados: number = 0;

  public cargando: boolean = false;
  public cargandoTimeOut;


  constructor( private usuarioService: UsuarioService) { }

  get prevLimit() {
    return -1 * this.limit;
  }

  get nextLimit() {
    return this.limit;
  }

  get firstPageRecord() {
    const minResultados = Math.min(this.totalUsuarios, this.totalUsuariosBuscados);

    if(minResultados === 0) {
      return 0;
    }

    return this.skip + 1;
  }

  get lastPageRecord() {
    return Math.min(Math.min(this.totalUsuarios, this.totalUsuariosBuscados), this.skip + this.limit);
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cambiarPagina( per_page: number ) {
    this.skip += per_page;

    if(this.skip < 0) { this.skip = 0; }
    if(this.skip >= Math.min(this.totalUsuarios, this.totalUsuariosBuscados)) { this.skip -= per_page; }

    this.cargarUsuarios();
  }

  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
    };
  }

  cargarUsuarios() {
    this.usuarioService.cargarUsuarios(this.skip, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, usuarios}) => {
          this.totalUsuarios = total.valueOf();
          this.totalUsuariosBuscados = filtradas.valueOf();
          this.usuarios = usuarios;
          this.cargando = false;
        });
  }

  eliminarUsuario(usuario: Usuario) {

    if(usuario.uid == this.usuarioService.usuario.uid) {
      Swal.fire( 'Error', 'Un usuario no puede borrarse a sí mismo.', 'error' );
      return;
    }

    Swal.fire({
      title: 'Borrar usuario',
      html: `El usuario <b>${ usuario.email}</b> va a ser borrado. Esta acción no podrá ser deshecha. ¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, borrar usuario'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.borrarUsuario(usuario)
            .subscribe( (resp) => {
              this.cargarUsuarios();
              Swal.fire( 'Usuario borrado', 'El usuario ha sido borrado', 'success' );
            } );

      }
    });
  }

  esUsuarioActual(usuario: Usuario) {
    return usuario.uid === this.usuarioService.usuario.uid;
  }

  cambiarRol(usuario: Usuario) {
    if(usuario.uid === this.usuarioService.usuario.uid) {
      Swal.fire( 'Error', 'No se puede modificar el rol de uno mismo', 'error' );
      return;
    }
    this.usuarioService.actualizarUsuario(usuario)
        .subscribe( (resp: any) => {
          if(resp.ok) {
            Swal.fire( 'Rol modificado', 'El rol ha sido modificado correctamente', 'success' );
          } else {
            Swal.fire( 'Error', 'No se ha podido modificar el rol', 'error' );
          }
        } );
  }
}