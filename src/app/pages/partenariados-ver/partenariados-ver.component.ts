import { Component, OnInit } from '@angular/core';
import { PartenariadoService } from 'src/app/services/partenariado.service';
import { Partenariado } from 'src/app/models/partenariado.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-partenariados-ver',
  templateUrl: './partenariados-ver.component.html',
  styleUrls: ['./partenariados-ver.component.scss']
})
export class PartenariadosVerComponent implements OnInit {

  public partenariado: Partenariado;
  public partenariados: Partenariado[];
  public offset = 0;
  public limit = 50;
  public mensaje: string;

  public filterCreador = '';

  constructor(public partenariadoService: PartenariadoService, public fileUploadService: FileUploadService, public usuarioService: UsuarioService, public router: Router, public activatedRoute: ActivatedRoute) {
    this.mensaje = '';
    this.filterCreador = this.usuarioService.usuario.uid
  }

  ngOnInit(): void {
     this.activatedRoute.params.subscribe( ({ }) => {
      this.cargarPartenariado();
    }); 
  } 

  getFiltros() {
    return {
      creador: this.filterCreador
    }
  }

  
  cargarPartenariado() {

    // ver o editar la partenariado
    this.partenariadoService.cargarPartenariados(this.offset, this.limit, this.getFiltros())
    .subscribe(({ total, filtradas, partenariados }) => { 
      this.partenariados = partenariados 
    });
  }  
/* 
  cambiarEstado(estado: string) {
    this.partenariadoService.cambiarEstado(this.partenariado, estado)
        .subscribe( (resp: any) => {
          if(resp.ok) {
            if(estado === 'Acordado') {
              Swal.fire( 'Proyecto creado', 'El partenariado ha cambiado su estado a Acordado y se ha creado el proyecto correspondiente.', 'success' );
            } else {
              Swal.fire( 'Estado modificado', 'El partenariado ha cambiado su estado a ' + estado + ' correctamente.', 'success' );
            }
            this.cargarPartenariado(this.partenariado._id);
          } else {
            Swal.fire('Error', resp?.msg || 'No se ha podido cambiar el estado del partenariado', 'error');
          }
        } );
  }

  enviarMensaje() {
    this.partenariadoService.enviarMensaje(this.partenariado, this.mensaje)
        .subscribe( (resp: any) => {
          if(resp.ok) {
            this.mensaje = '';
            this.cargarPartenariado(this.partenariado._id);
          } else {
            Swal.fire('Error', resp?.msg || 'No se ha podido enviar el mensaje', 'error');
          }
        } );
  }

  numeroMensajes() {
    return Object.keys(this.partenariado?.mensajes || {}).length;
  }

  parseFecha(fecha:string) {
    return moment(fecha).format('DD/MM/YYYY HH:mm:ss')
  }


  subirFichero( file: File ) {
    if( !file ) { return; }

    this.fileUploadService
        .subirFichero(file, 'archivos', 'partenariados', this.partenariado._id)
        .then( resp => {
          const {ok, msg, upload_id} = resp;
          if(ok) {
            this.cargarPartenariado(this.partenariado._id);
            Swal.fire('Ok', 'Fichero subido correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
  } */

/*   borrarFichero( id: string ) {
    this.fileUploadService
        .borrarFichero(id)
        .then( resp => {
          const {ok, msg } = resp;
          if(ok) {
            this.cargarPartenariado(this.partenariado._id);
            Swal.fire('Ok', 'Fichero borrado correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
        (<HTMLInputElement>document.getElementById("file-upload-2")).value="";
  } */

}
