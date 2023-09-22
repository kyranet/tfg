import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ROL_SOCIO_COMUNITARIO, ROL_PROFESOR, ROL_ESTUDIANTE } from './../../../../server/models/rol.model';
import { UsuarioService } from '../../services/usuario.service';
import { HomeService } from "../../services/home.service";
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SobreApsUnedContactaComponent } from 'src/app/pages/sobre-aps-uned-contacta/sobre-aps-uned-contacta.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  countries: Array<any> = [];
  selCountries = [
    {
      item_id: 1,
      item_text: "India",
      image: "http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg"
    },
    {
      item_id: 5,
      item_text: "Israel",
      image: "http://www.sciencekids.co.nz/images/pictures/flags96/Israel.jpg"
    }
  ];
  dropdownSettings: any = {};

  public formSubmitted = false;
  public codeList: any;
  public areasList: any;
  
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private registerService: HomeService, private router: Router) { 
    
  }

  public registerForm = this.fb.group({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    rol: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$&*<>()-])(?=.*[0-9])(?=.*[a-z]).{8,15}$")
    ]),
    password_2: new FormControl('',
      Validators.required
    ),

    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    universidad: new FormControl(''),
    titulacion: new FormControl(''),
    sector: new FormControl(''),
    url: new FormControl(''),
    mision: new FormControl(''),
    nombreSocioComunitario: new FormControl(''),
    facultad: new FormControl(''),
    areaConocimiento: new FormControl(''),
    terminos_aceptados: new FormControl(false, Validators.requiredTrue),

  }, {
    validators: [
      this.validarUniversidad(),
      this.validarTitulacion(),
      this.validarSector(),
      this.validarUrl(),
      this.validarMision(),
      this.validarNombreSocioComunitario(),
      this.validarFacultad(),
      this.validarAreaConocimiento(),
      this.match('password', 'password_2', 'password-mismatch'),
    ]
  });


  ngOnInit(): void {
    this.obtenerUniversidades();
    this.obtenerAreasConocimiento();
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

  

  async  obtenerUniversidades() {
     return this.registerService.obtenerUniversidades()
        .subscribe( (resp: any) => {
          this.codeList =resp.codeList
          return this.codeList;
        });
  }

  async  obtenerAreasConocimiento() {
    return this.registerService.obtenerAreasConocimiento()
       .subscribe( (resp: any) => {
         this.areasList =resp.areas;
         return this.areasList;
       });
 }

  get primEmail() {
    return this.registerForm.get('email')
  }

  get GetPassword() {
    return this.registerForm.get('password')
  }

  get GetPasswordConfirm() {
    return this.registerForm.get('password_2')
  }
  get getUniveridad() {
    return this.registerForm.get('universidad')
  }
  get getSector() {
    return this.registerForm.get('sector')
  }

  get getUrl() {
    return this.registerForm.get('url')
  }

  get getMision() {
    return this.registerForm.get('mision')
  }

  get getNombreSocioComunitario() {
    return this.registerForm.get('nombreSocioComunitario')
  }

  get getTitulacion() {
    return this.registerForm.get('titulacion')
  }
  get getNombre() {
    return this.registerForm.get('nombre')
  }
  get getAreaConocimiento() {
    return this.registerForm.get('areaConocimiento')
  }
  get getFacultad() {
    return this.registerForm.get('facultad')
  }
  get getApellidos() {
    return this.registerForm.get('apellidos')
  }
  get getTelefono() {
    return this.registerForm.get('telefono')
  }
  public roles = this.getRoles();
  

  register(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.usuarioService
      .crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        this.router.navigate(['/']);
      }, err => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }


  getRoles() {
    return [
      { id: ROL_SOCIO_COMUNITARIO, name: 'Socio comunitario' },
      { id: ROL_PROFESOR, name: 'Profesor' },
      { id: ROL_ESTUDIANTE, name: 'Estudiante' },
    ];
  }

  match(firstControlName: string | (string | number)[], secondControlName: string | (string | number)[], customError = 'mismatch') {
    return (fg: FormGroup) => {
      return fg.get(firstControlName).value === fg.get(secondControlName).value ? null : { [customError]: true };
    };

  }

   noListMatch() {
    let accept=true;
          for (let v of this.codeList) {
            if (v.nombre === this.registerForm.get('universidad').value || this.registerForm.get('universidad').value === '')
              accept = false;
          }
          return accept;

  } 

  passwordsNoCoinciden(): Boolean {
    return this.formSubmitted && (this.registerForm.get('password').value !== this.registerForm.get('password_2').value);
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

  passwordsVacias(): Boolean {
    return this.formSubmitted && (this.registerForm.get('password').value === '');
  }

  validacionPasswordsVacias() {
    return (formGroup: FormGroup) => {
      if (this.passwordsVacias()) {
        formGroup.get('password_2').setErrors({ required: true });
      } else {
        formGroup.get('password_2').setErrors(null);
      }
    }
  }

  validarCampoSegunPerfil(campo: string | (string | number)[], roles: string | any[]) {
    return (formGroup: FormGroup) => {
      const control_rol = formGroup.get('rol');
      const campo_bajo_validacion = formGroup.get(campo);

      if (campo_bajo_validacion.value === '' && roles.includes(control_rol.value)) {
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

  validarFacultad() {
    return this.validarCampoSegunPerfil('facultad', [ROL_PROFESOR]);
  }

  validarAreaConocimiento() {
    return this.validarCampoSegunPerfil('areaConocimiento', [ROL_PROFESOR]);
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
