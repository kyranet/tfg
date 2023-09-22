import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Iniciativa } from 'src/app/models/iniciativa.model';

import { RAMAS } from '../../models/rama.model';
import { CIUDADES } from '../../models/ciudad.model';
import { IniciativaService } from 'src/app/services/iniciativa.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iniciativas-crear',
  templateUrl: './iniciativas-crear.component.html',
  styleUrls: ['./iniciativas-crear.component.scss']
})
export class IniciativasCrearComponent implements OnInit {

  public formSubmitted = false;
  public formSending = false;

  public iniciativa_id: string = null;
  public iniciativa: Iniciativa;
  public imagenSubir: File;
  public imagenPreview: any = null;

  public crearIniciativaForm: FormGroup;

  public RAMAS = RAMAS;
  public CIUDADES = CIUDADES;
  public USUARIOS;

  constructor( public fb: FormBuilder, public iniciativaService: IniciativaService, public usuarioService: UsuarioService, public fileUploadService: FileUploadService, public router: Router, public activatedRoute: ActivatedRoute) {
    if(this.usuarioService.usuario.esGestor) {
      this.usuarioService.cargarUsuarios(0, 99999999, {terminoBusqueda: ''}).subscribe( ({total, filtradas, usuarios}) => {
        this.USUARIOS = usuarios.filter( usuario => ['ROL_SOCIO_COMUNITARIO', 'ROL_PROFESOR', 'ROL_GESTOR'].includes(usuario.rol));
      });
    }
  }

  async ngOnInit() {
    await this.cargarIniciativa();

    this.crearIniciativaForm = this.fb.group({
      estado: [this.iniciativa.estado || 'Abierta', Validators.required],
      titulo: [this.iniciativa.titulo || '', Validators.required],
      descripcion: [this.iniciativa.descripcion || '', Validators.required],
      rama: [this.iniciativa.rama || '', Validators.required],
      ciudad: [this.iniciativa.ciudad || '', Validators.required],
      proponedor: [this.iniciativa.proponedor?.uid || this.usuarioService.usuario.uid, Validators.required],
      terminos_aceptados: [false, Validators.requiredTrue],
    });
  }

  async cargarIniciativa() {
    this.iniciativa = new Iniciativa('', '', '', '', '', '', '', [], [], null, null, '');
  }

  observableEnviarIniciativa() {
    return this.iniciativaService.crearIniciativa(this.crearIniciativaForm.value);
  }

  enviarIniciativa() {

    this.formSubmitted = true;

    if(this.crearIniciativaForm.invalid) {
      return;
    }


    

    this.formSending = true;
    this.observableEnviarIniciativa()
          .subscribe( resp => {
            this. iniciativa_id
              ? Swal.fire('Ok', 'Iniciativa actualizada correctamente', 'success')
              : Swal.fire('Ok', 'Iniciativa creada correctamente', 'success');

            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/iniciativas']);

            this.formSubmitted = false;
            this.formSending = false;
          }, err => {
            console.log(err);

            let msg = [];
            if(err.error.errors) {
              Object.values(err.error.errors).forEach(error_entry => {
                msg.push(error_entry['msg']);
              });
            } else {
              msg.push(err.error.msg);
            }

            Swal.fire('Error', msg.join('<br>'), 'error');
            this.formSubmitted = false;
            this.formSending = false;
          });


  }


  campoNoValido(campo): String {

    let invalido = this.crearIniciativaForm.get(campo) && this.crearIniciativaForm.get(campo).invalid;

    if(invalido) {
      switch (campo) {
        case 'terminos_aceptados':
          return 'Es obligatorio aceptar las condiciones de uso';
          break;

        default:
          return `El campo ${ campo } es obligatorio`;
          break;
      }
    }

    return '';
  }

  subirFichero( file: File ) {
    if( !file ) { return; }

    this.fileUploadService
        .subirFichero(file, 'archivos', 'iniciativas', this.iniciativa._id)
        .then( resp => {
          const {ok, msg, upload_id} = resp;
          if(ok) {
            this.cargarIniciativa();
            Swal.fire('Ok', 'Fichero subido correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
  }

  borrarFichero( id: string ) {

    if(id == '') {
        Swal.fire('Error', 'No hay ninguna imagen definida para la iniciativa.', 'error');
        return;
    }

    this.fileUploadService
        .borrarFichero(id)
        .then( resp => {
          const {ok, msg } = resp;
          if(ok) {
            this.cargarIniciativa();
            Swal.fire('Ok', 'Fichero borrado correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
        (<HTMLInputElement>document.getElementById("file-upload-2")).value="";
  }

  cambiarImagen( file: File ) {

    if( !file ) { return; }

    this.imagenSubir = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imagenPreview = reader.result;
    }
  }

  actualizarImagen() {
    this.fileUploadService
        .subirFichero(this.imagenSubir, 'default', 'iniciativas', this.iniciativa._id)
        .then( resp => {
          const {ok, msg, upload_id} = resp;
          if(ok) {
            this.cargarIniciativa();
            Swal.fire('Ok', 'Imagen de iniciativa actualizada correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }

          this.imagenSubir = null;
          this.imagenPreview = null;
        });
  }

  borrarImagen() {

    if(this.iniciativa.imagen == '') {
        Swal.fire('Error', 'No hay ninguna imagen definida para la iniciativa.', 'error');
        return;
    }

    this.fileUploadService
        .borrarFichero(this.iniciativa.imagen)
        .then( resp => {
          const {ok, msg } = resp;
          if(ok) {
            this.cargarIniciativa();
            Swal.fire('Ok', 'Imagen de iniciativa borrada correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
        (<HTMLInputElement>document.getElementById("file-upload")).value="";
  }


}
