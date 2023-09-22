import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { Partenariado } from '../../../models/partenariado.model';
import * as moment from 'moment';
import { RAMAS } from '../../../models/rama.model';
import { CIUDADES } from '../../../models/ciudad.model';
import { PartenariadoService } from '../../../services/partenariado.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Oferta } from 'src/app/models/oferta.model';
import { OfertaService } from 'src/app/services/oferta.service';
import { DemandaService } from 'src/app/services/demanda.service';
import { first } from 'rxjs/operators';
import { Demanda } from 'src/app/models/demanda.model';

@Component({
  selector: 'app-partenariado-crear-profesor',
  templateUrl: './partenariado-profesor-crear.component.html',
  styleUrls: ['./partenariado-profesor-crear.component.scss']
})
export class PartenariadoCrearProfesorComponent implements OnInit {

  public formSubmitted = false;
  public formSending = false;


  public parteneriado_id: string = null;
  public partenariado: Partenariado;
  public oferta: Oferta;
  public demanda: Demanda;
  public imagenSubir: File;
  public imagenPreview: any = null;
  public responsable_data:any;
  public crearPartenariadoProfesorForm: FormGroup;


  constructor(public fb: FormBuilder, public demandaService: DemandaService, public ofertaService: OfertaService, public partenariadoService: PartenariadoService, public usuarioService: UsuarioService, public fileUploadService: FileUploadService, public router: Router, public activatedRoute: ActivatedRoute) {
  }

  dropdownSettings: any = {};
  public profesoresList: any;
  public selProfesores: any;

  async ngOnInit() {
    await this.cargarPartenariado();
    await this.obtenerOferta();
    await this.obtenerDemanda();
    await this.obtenerProfesores();


    this.crearPartenariadoProfesorForm = this.fb.group({
      anioAcademico: [this.oferta.anio_academico || '', Validators.required ],
      titulo: [this.demanda.titulo + " | " + this.oferta.titulo || '',  Validators.required ],
      descripcion: [this.demanda.descripcion + " | " + this.oferta.descripcion || '' ,  Validators.required],
      socio: [this.demanda.creador || ''],
      necesidadSocial: [this.demanda.necesidad_social],
      finalidad: [this.demanda.objetivo],
      comunidadBeneficiaria: [this.demanda.comunidadBeneficiaria],
      cuatrimestre: [this.oferta.cuatrimestre || '', Validators.required ],
      responsable: ['',  Validators.required ],
      ciudad: [this.demanda.ciudad],
      externos: [false],
      id_demanda: [this.demanda.id],
      id_oferta: [this.oferta.id || ''],
      ofertaObservacionesTemporales: [this.oferta.observaciones, Validators.required ],
      demandaObservacionesTemporales: [this.demanda.observacionesTemporales],
      asignaturaObjetivo: [this.oferta.asignatura_objetivo, Validators.required ],
      titulacionesLocales: [this.demanda.titulacion_local],
      ofertaAreaServicio: [this.oferta.area_servicio, Validators.required ],
      demandaAreaServicio: [this.demanda.area_servicio],
      periodo_definicion_fin:[this.demanda.periodoDefinicionFin],
      periodo_definicion_ini: [this.demanda.periodoDefinicionIni],
      periodo_ejecucion_fin: [this.demanda.periodoEjecucionFin],
      periodo_ejecucion_ini: [this.demanda.periodoEjecucionIni],
      profesores: [new FormControl(''), Validators.required ],
      fecha_limite :[this.oferta.fecha_limite, Validators.required ],
      fecha_fin : [this.demanda.fechaFin],

    });


    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "nombreCompleto",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }



  async cargarPartenariado() {
    this.partenariado = new Partenariado('', '', '', '', '', '', '', '', null, null, null, null, null, null);
  }

  async obtenerOferta() {

    await this.ofertaService.obtenerOferta().pipe(first()).toPromise().then((resp: any) => {
      let value = resp.oferta;
      let arrayP =[]
      for(let val of value.profesores){
        arrayP.push({
          id: val.id,
          nombreCompleto: val.nombre + " " + val.apellidos
        })

      }
      this.selProfesores= arrayP;
    
      let fecha_fin = moment(value.fecha_limite).format('YYYY-MM-DD');
      this.oferta = new Oferta(value.id, value.titulo, value.descripcion, value.imagen, value.created_at, value.upload_at, value.cuatrimestre,
        value.anio_academico, fecha_fin, value.observaciones_temporales, value.creador, value.area_servicio, value.asignatura_objetivo, value.profesores)
        ;
    });
  }

  async obtenerProfesores() {
    return this.partenariadoService.obtenerProfesores()
      .subscribe((resp: any) => {
        let arrayProfesores = []
        for (let value of resp.profesores) {
          arrayProfesores.push({
            id: value.id,
            nombreCompleto: value.nombre + " " + value.apellidos
          })
        }
        this.profesoresList =arrayProfesores
        return arrayProfesores;
      });
  }

  async obtenerDemanda() {
    await this.demandaService.obtenerDemanda().pipe(first()).toPromise().then((resp: any) => {
      let value = resp.demanda;
      let periodo_definicion_ini = moment(value.periodo_definicion_ini).format('YYYY-MM-DD');
      let periodo_definicion_fin = moment(value.periodo_definicion_fin).format('YYYY-MM-DD');
      let periodo_ejecucion_ini = moment(value.periodo_ejecucion_ini).format('YYYY-MM-DD');
      let periodo_ejecucion_fin = moment(value.periodo_ejecucion_fin).format('YYYY-MM-DD');
      let fecha_fin = moment(value.fecha_fin).format('YYYY-MM-DD');
      this.demanda = new Demanda(value.id, value.titulo, value.descripcion, value.imagen, value.ciudad, value.finalidad, value.area_servicio,
        periodo_definicion_ini, periodo_definicion_fin, periodo_ejecucion_ini, periodo_ejecucion_fin,
        fecha_fin, value.observaciones_temporales, value.necesidad_social, value.titulacionlocal,
        value.creador, value.comunidad_beneficiaria, value.created_at, value.upload_at);
    });

  }

  observableEnviarPartenariado() {
    return this.partenariadoService.crearPartenariadoProfesor(this.crearPartenariadoProfesorForm.value);
  }

  enviarPartenariado() {

    this.formSubmitted = true;

    if (this.crearPartenariadoProfesorForm.invalid) {
      return;
    }

    let id_responsable = this.obtenerIdResponsable();
    if(id_responsable == -1){
      let msg = [];
      msg.push("El responsable debe ser un valor válido");
      Swal.fire('Error', msg.join('<br>'), 'error');
      this.formSubmitted = false;
      this.formSending = false;
    }
    this.crearPartenariadoProfesorForm.get('responsable').setValue(id_responsable);
    this.formSending = true;
    this.observableEnviarPartenariado()
      .subscribe(resp => {
        this.parteneriado_id
          ? Swal.fire('Ok', 'Partenariado creado correctamente', 'success')
          : Swal.fire('Ok', 'Partenariado creado correctamente', 'success');

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/']);

        this.formSubmitted = false;
        this.formSending = false;
      }, err => {
        console.log(err);

        let msg = [];
        if (err.error.errors) {
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

  obtenerIdResponsable(){
    let i=0;
    let resp = this.crearPartenariadoProfesorForm.get('responsable').value;
    while(i < this.selProfesores.length && 
      this.selProfesores[i].nombreCompleto != resp){
        i++;
      }
    return (i < this.selProfesores.length) ? this.selProfesores[i].id : -1;
  }

  campoNoValido(campo): String {

    let invalido = this.crearPartenariadoProfesorForm.get(campo) && this.crearPartenariadoProfesorForm.get(campo).invalid;

    if (invalido) {
      switch (campo) {
        case 'terminos_aceptados':
          return 'Es obligatorio aceptar las condiciones de uso';
          break;

        default:
          return `El campo ${campo} es obligatorio`;
          break;
      }
    }

    return '';
  }

  subirFichero(file: File) {
    if (!file) { return; }

    this.fileUploadService
      .subirFichero(file, 'archivos', 'partenariados', this.partenariado._id)
      .then(resp => {
        const { ok, msg, upload_id } = resp;
        if (ok) {
          this.cargarPartenariado();
          Swal.fire('Ok', 'Fichero subido correctamente', 'success');
        } else {
          Swal.fire('Error', msg, 'error');
        }
      });
  }

  borrarFichero(id: string) {

    if (id == '') {
      Swal.fire('Error', 'No hay ninguna imagen definida para la iniciativa.', 'error');
      return;
    }

    this.fileUploadService
      .borrarFichero(id)
      .then(resp => {
        const { ok, msg } = resp;
        if (ok) {
          this.cargarPartenariado();
          Swal.fire('Ok', 'Fichero borrado correctamente', 'success');
        } else {
          Swal.fire('Error', msg, 'error');
        }
      });
    (<HTMLInputElement>document.getElementById("file-upload-2")).value = "";
  }

  cambiarImagen(file: File) {

    if (!file) { return; }

    this.imagenSubir = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imagenPreview = reader.result;
    }
  }

  actualizarImagen() {
    this.fileUploadService
      .subirFichero(this.imagenSubir, 'default', 'iniciativas', this.partenariado._id)
      .then(resp => {
        const { ok, msg, upload_id } = resp;
        if (ok) {
          this.cargarPartenariado();
          Swal.fire('Ok', 'Imagen de partenariado actualizada correctamente', 'success');
        } else {
          Swal.fire('Error', msg, 'error');
        }

        this.imagenSubir = null;
        this.imagenPreview = null;
      });
  }

  /* borrarImagen() {

    if(this.partenariado.imagen == '') {
        Swal.fire('Error', 'No hay ninguna imagen definida para la iniciativa.', 'error');
        return;
    }

    this.fileUploadService
        .borrarFichero(this.partenariado.imagen)
        .then( resp => {
          const {ok, msg } = resp;
          if(ok) {
            this.cargarPartenariado();
            Swal.fire('Ok', 'Imagen de partenariado borrada correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
        (<HTMLInputElement>document.getElementById("file-upload")).value="";
  } */
  get getItems() {
    return this.profesoresList.reduce((acc, curr) => {
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
