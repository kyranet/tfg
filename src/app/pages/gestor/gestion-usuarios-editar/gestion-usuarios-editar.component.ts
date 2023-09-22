import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HomeService } from 'src/app/services/home.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ProfileComponent } from 'src/app/auth/profile/profile.component';
import { FormBuilder } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { map, first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gestion-usuarios-editar',
  templateUrl: './../../../auth/profile/profile.component.html',
  styleUrls: ['./../../../auth/profile/profile.component.scss']
})
export class GestionUsuariosEditarComponent extends ProfileComponent {

  public uid:string;
  public usuario:Usuario;

  constructor( public fb: FormBuilder, public authService: AuthService, public usuarioService: UsuarioService,public homeService: HomeService, public fileUploadService: FileUploadService, public router: Router, public activatedRoute: ActivatedRoute) {
    super(fb, authService, usuarioService, homeService, fileUploadService, router, activatedRoute);

    this.editUserTitle = 'Edición de usuario';
    this.successMessage = 'El usuario ha sido actualizado correctamente';
  }

  // reload usuario
  async actualizarInformacionOrigenDeUsuario() {
    await this.activatedRoute.params.pipe(first()).toPromise().then( (params) => { this.uid = params.uid; });
    await this.usuarioService.cargarUsuario(this.uid).pipe(first()).toPromise().then( (usuario: Usuario) => {
      const { uid, rol, email, nombre, apellidos, origin_login, origin_img, universidad, titulacion, sector, facultad,areaConocimiento,nombreSocioComunitario, terminos_aceptados } = usuario;
      this.usuario = new Usuario( uid, rol, email, nombre, apellidos, origin_login, origin_img || '', universidad || '', titulacion || '', sector || '', facultad || '',  areaConocimiento || null,   nombreSocioComunitario || '',terminos_aceptados || false);
    });
  }

  observableActualizar() {
    const uid = this.usuario.uid;
    return this.usuarioService.actualizarUsuario( {uid, ...this.profileForm.value} );
  }

}
