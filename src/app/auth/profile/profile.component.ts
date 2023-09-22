import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ROL_GESTOR, ROL_SOCIO_COMUNITARIO, ROL_PROFESOR, ROL_ESTUDIANTE } from './../../../../server/models/rol.model';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { take, tap, first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from "../../services/home.service";
//Para usar jQuery -> import * as $ from "jquery";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  dropdownSettings: any = {};
  public editUserTitle: string = 'Edición de perfil de usuario';
  public successMessage: string = 'El perfil ha sido actualizado correctamente';
  public usuario: Usuario;
  public codeList: any;
  public areasUsuario: any;

  public profileForm: FormGroup;
  public imagenSubir: File;
  public imagenPreview: any = null;

  public roles = this.getRoles();
  public areasList: any;

  constructor(public fb: FormBuilder, public authService: AuthService, public usuarioService: UsuarioService, public registerService: HomeService, public fileUploadService: FileUploadService, public router: Router, public activatedRoute: ActivatedRoute) {
  }
  async ngOnInit() {
    this.obtenerUniversidades();
    this.obtenerAreasConocimiento();
    this.obtenerAreasConocimientoUsuario();
    await this.actualizarInformacionOrigenDeUsuario();
    

    this.profileForm = this.fb.group({
      rol: [this.usuario.rol, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      password: [''],
      password_2: [''],
      nombre: [this.usuario.nombre, Validators.required],
      apellidos: [this.usuario.apellidos, Validators.required],
      telefono: [this.usuario.telefono, Validators.required],
      universidad: [this.usuario.universidad],
      titulacion: [this.usuario.titulacion],
      facultad: [this.usuario.facultad],
      areaConocimiento: [this.usuario.areaConocimiento],
      sector: [this.usuario.sector],
      url: [this.usuario.url],
      mision: [this.usuario.mision],
      nombreSocioComunitario: [this.usuario.nombreSocioComunitario],
    }, {
      validators: [
        this.validacionPasswordsNoCoinciden(),
        this.validarUniversidad(),
        this.validarFacultad(),
        this.validarAreaConocimiento(),
        this.validarTitulacion(),
        this.validarSector(),
        this.validarNombreSocioComunitario(),
      ]
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "nombre",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  async obtenerUniversidades() {
    return this.registerService.obtenerUniversidades()
      .subscribe((resp: any) => {
        this.codeList = resp.codeList
        return this.codeList;
      });
  }

  async obtenerAreasConocimientoUsuario() {
    return this.registerService.obtenerAreasConocimientoUsuario(this.usuarioService.usuario.uid)
      .subscribe((resp: any) => {
        this.areasUsuario = resp.areasUsuario;
        console.log(this.areasUsuario)
        return this.areasUsuario;
      });
  }

  async obtenerAreasConocimiento() {
    return this.registerService.obtenerAreasConocimiento()
      .subscribe((resp: any) => {
        this.areasList = resp.areas;
        return this.areasList;
      });
  }

  // reload usuario
  async actualizarInformacionOrigenDeUsuario() {
    await this.authService.solicitarToken().pipe(first()).toPromise().then(() => { this.usuario = this.usuarioService.usuario; });
  }

  observableActualizar() {
    return this.usuarioService.actualizarPerfil(this.profileForm.value);
  }

  async updateProfile() {

    if (this.profileForm.invalid) {
      Swal.fire('Error', 'Los datos enviados contienen errores', 'error');
    }

    await this.observableActualizar().pipe(first()).toPromise().then(() => {
      this.actualizarInformacionOrigenDeUsuario();
      Swal.fire('Ok', this.successMessage, 'success');
    })
      .catch((err) => {
        let msg = [];
        if (err.error.errors) {
          Object.values(err.error.errors).forEach(error_entry => {
            msg.push(error_entry['msg']);
          });
        } else {
          msg.push(err.error.msg);
        }

        Swal.fire('Error', msg.join('<br>'), 'error');
      });
  }

  cambiarImagen(file: File) {

    if (!file) { return; }

    this.imagenSubir = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imagenPreview = reader.result;
    }
    var inputImage = document.getElementById("file-upload");


  }

  actualizarImagen() {
    this.fileUploadService
      .subirFichero(this.imagenSubir, 'avatar', 'usuarios', this.usuario.uid)
      .then(resp => {
        const { ok, msg, upload_id } = resp;
        if (ok) {
          this.actualizarInformacionOrigenDeUsuario();
          Swal.fire('Ok', 'Imagen de usuario actualizada correctamente', 'success');
        } else {
          Swal.fire('Error', msg, 'error');
        }

        this.imagenSubir = null;
        this.imagenPreview = null;
      });
  }

  borrarImagen() {

    if (this.usuario.origin_img.includes('https')) {
      Swal.fire('Error', 'No se puede borrar la imagen proporcionada por el SSO. Si desea, puede actualizarla con una imagen personalizada.', 'error');
      return;
    }

    if (this.usuario.origin_img == '') {
      Swal.fire('Error', 'No hay ninguna imagen definida para el usuario.', 'error');
      return;
    }

    this.fileUploadService
      .borrarFichero(this.usuario.origin_img)
      .then(resp => {
        const { ok, msg } = resp;
        if (ok) {
          this.actualizarInformacionOrigenDeUsuario();
          Swal.fire('Ok', 'Imagen de usuario borrada correctamente', 'success');
        } else {
          Swal.fire('Error', msg, 'error');
        }
      });
    //En jQuery ->$("#file-upload").val("");
    (<HTMLInputElement>document.getElementById("file-upload")).value = "";
  }



  getRoles() {
    return [
      { id: ROL_SOCIO_COMUNITARIO, name: 'Socio comunitario' },
      { id: ROL_PROFESOR, name: 'Profesor' },
      { id: ROL_ESTUDIANTE, name: 'Estudiante' },
    ];
  }


  passwordsNoCoinciden(): Boolean {
    return this.profileForm && (this.profileForm.get('password').value !== this.profileForm.get('password_2').value);
  }

  validacionPasswordsNoCoinciden() {
    return (formGroup: FormGroup) => {
      if (this.passwordsNoCoinciden()) {
        formGroup.get('password').setErrors({ required: true });
      } else {
        formGroup.get('password').setErrors(null);
      }
    }
  }


  campoNoValido(campo): String {

    // para mostrar diferentes nombres en el mensaje de error
    let campo_real = campo === 'facultad' ? 'titulacion' : campo;

    let invalido = this.profileForm.get(campo_real) && this.profileForm.get(campo_real).invalid;

    if (invalido) {
      switch (campo) {
        case 'rol':
          return 'Debe elegir un tipo de perfil con el que será registrado en la aplicación: Estudiante, Profesor o Socio Comunitario';
          break;

        case 'email':
          return 'El campo correo electrónico es obligatorio y debe ser un correo válido';
          break;

        case 'titulacion':
          return `El campo titulación es obligatorio`;
          break;
        case 'facultad':
          return `El campo facultad es obligatorio`;
          break;

        case 'areaConocimiento':
          return `El campo area/s conocimiento es obligatorio`;
          break;


        case 'facultad':
          return `El campo facultad/escuela es obligatorio`;
          break;

        default:
          return `El campo ${campo} es obligatorio`;
          break;
      }
    }

    return '';
  }

  validarCampoSegunPerfil(campo, roles) {
    return (formGroup: FormGroup) => {
      const control_rol = this.usuario.rol;
      const campo_bajo_validacion = formGroup.get(campo);

      if (campo_bajo_validacion.value === '' && roles.includes(control_rol)) {
        campo_bajo_validacion.setErrors({ required: true });
      } else {
        campo_bajo_validacion.setErrors(null);
      }
    }
  }

  validarUniversidad() {
    return this.validarCampoSegunPerfil('universidad', [ROL_ESTUDIANTE, ROL_PROFESOR]);
  }

  validarTitulacion() {
    return this.validarCampoSegunPerfil('titulacion', [ROL_ESTUDIANTE]);
  }

  validarSector() {
    return this.validarCampoSegunPerfil('sector', [ROL_SOCIO_COMUNITARIO]);
  }

  validarUrl() {
    return this.validarCampoSegunPerfil('url', [ROL_SOCIO_COMUNITARIO]);
  }

  validarMision() {
    return this.validarCampoSegunPerfil('mision', [ROL_SOCIO_COMUNITARIO]);
  }

  validarNombreSocioComunitario() {
    return this.validarCampoSegunPerfil('nombreSocioComunitario', [ROL_SOCIO_COMUNITARIO]);
  }

  validarFacultad() {
    return this.validarCampoSegunPerfil('facultad', [ROL_PROFESOR]);
  }

  validarAreaConocimiento() {
    return this.validarCampoSegunPerfil('areaConocimiento', [ROL_PROFESOR]);
  }

  noListMatch() {
    let accept = true;
    for (let v of this.codeList) {
      if (v.nombre === this.profileForm.get('universidad').value || this.profileForm.get('universidad').value === '')
        accept = false;
    }
    return accept;

  }
  get getItems() {
    return this.areasList.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }
  
  onItemSelect(item: any) {
    console.log("onItemSelect", item);
  }
  onSelectAll(items: any) {
    console.log("onSelectAll", items);
  }
}
