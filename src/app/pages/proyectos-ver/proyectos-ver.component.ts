import { Component, OnInit } from '@angular/core';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { Proyecto } from 'src/app/models/proyecto.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-proyectos-ver',
  templateUrl: './proyectos-ver.component.html',
  styleUrls: ['./proyectos-ver.component.scss']
})
export class ProyectosVerComponent implements OnInit {

  public proyecto: Proyecto;
  public proyectos: Proyecto[];

  public mensaje: string;

  constructor(public proyectoService: ProyectoService, public fileUploadService: FileUploadService, public usuarioService: UsuarioService, public router: Router, public activatedRoute: ActivatedRoute) {
    this.mensaje = '';
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarProyecto(id);
    });
  }

  tienePermisoEdicion() {

      if( !this.usuarioService.usuario ) {
        return false;
      }

      if(    ! this.usuarioService.usuario.esGestor
          && ! this.usuarioService.usuario.esProfesor
          && ! this.usuarioService.usuario.esSocioComunitario
          && ! this.usuarioService.usuario.esEstudiante
      ) {
        return false;
      }

      if( this.usuarioService.usuario.esGestor ) {
        return true;
      }

      if(!this.proyecto) {
        return false;
      }

      let acceso_permitido = false;
      this.proyecto.profesores.forEach(profesor => {
        if(profesor.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      this.proyecto.sociosComunitarios.forEach(entidad => {
        if(entidad.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      this.proyecto.estudiantes.forEach(estudiante => {
        if(estudiante.uid == this.usuarioService.usuario.uid) {
          acceso_permitido = true;
        }
      });

      return acceso_permitido;

  }

  cargarProyecto(id: string) {

    // ver o editar la proyecto
    this.proyectoService.cargarProyecto(id).subscribe( (proyecto: Proyecto) => {

      // si no hay proyecto, le devuelvo al listado de proyectos
      if (!proyecto) {
        return this.router.navigateByUrl(`/mis-proyectos`);
      }

      this.proyecto = this.proyectoService.mapearProyectos([proyecto])[0];
    });
  }

  cambiarEstado(estado: string) {
    this.proyectoService.cambiarEstado(this.proyecto, estado)
        .subscribe( (resp: any) => {
          if(resp.ok) {
            Swal.fire( 'Estado modificado', 'El proyecto ha cambiado su estado a ' + estado + ' correctamente.', 'success' );
            this.cargarProyecto(this.proyecto._id);
          } else {
            Swal.fire('Error', resp?.msg || 'No se ha podido cambiar el estado del proyecto', 'error');
          }
        } );
  }

  enviarMensaje() {
    this.proyectoService.enviarMensaje(this.proyecto, this.mensaje)
        .subscribe( (resp: any) => {
          if(resp.ok) {
            this.mensaje = '';
            this.cargarProyecto(this.proyecto._id);
          } else {
            Swal.fire('Error', resp?.msg || 'No se ha podido enviar el mensaje', 'error');
          }
        } );
  }

  numeroMensajes() {
    return Object.keys(this.proyecto?.mensajes || {}).length;
  }

  parseFecha(fecha:string) {
    return moment(fecha).format('DD/MM/YYYY HH:mm:ss')
  }


  subirFichero( file: File ) {
    if( !file ) { return; }

    this.fileUploadService
        .subirFichero(file, 'archivos', 'proyectos', this.proyecto._id)
        .then( resp => {
          const {ok, msg, upload_id} = resp;
          if(ok) {
            this.cargarProyecto(this.proyecto._id);
            Swal.fire('Ok', 'Fichero subido correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
  }

  borrarFichero( id: string ) {
    this.fileUploadService
        .borrarFichero(id)
        .then( resp => {
          const {ok, msg } = resp;
          if(ok) {
            this.cargarProyecto(this.proyecto._id);
            Swal.fire('Ok', 'Fichero borrado correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
        (<HTMLInputElement>document.getElementById("file-upload-2")).value="";
  }

  pendienteImplementar() {
    Swal.fire('Funcionalidad pendiente', 'Esta funcionalidad está pendiente de implementar', 'info');
  }

}
