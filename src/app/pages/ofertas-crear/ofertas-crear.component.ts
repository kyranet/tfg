import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Oferta } from 'src/app/models/oferta.model';
import { OfertaService } from 'src/app/services/oferta.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

export interface AutoCompleteModel {
    value: any;
    display: string;
}

@Component({
    selector: 'app-ofertas-crear',
    templateUrl: './ofertas-crear.component.html',
    styleUrls: ['./ofertas-crear.component.scss']
})
export class OfertasCrearComponent implements OnInit {
    public formSubmitted = false;
    public formSending = false;

    public oferta_id: string = null;
    public oferta: Oferta;
    public imagenSubir: File;
    public imagenPreview: any = null;
    public areasServicio: any;
    public crearOfertaForm: FormGroup;
    public htmlStr: string;
    public aux_cuatrimestre: string;
    public dropdownSettings: any = {};
    public USUARIOS;
    public tags: any = [];

    constructor(
        public fb: FormBuilder,
        public ofertaService: OfertaService,
        public usuarioService: UsuarioService,
        public fileUploadService: FileUploadService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public utilsService: UtilsService
    ) {
        if (this.usuarioService.usuario.esGestor) {
            this.usuarioService
                .cargarUsuarios(0, 99999999, { terminoBusqueda: '' })
                .subscribe(({ total, filtradas, usuarios }) => {
                    this.USUARIOS = usuarios.filter((usuario) =>
                        [
                            'ROL_SOCIO_COMUNITARIO',
                            'ROL_PROFESOR',
                            'ROL_GESTOR'
                        ].includes(usuario.rol)
                    );
                });
        }
    }

    async ngOnInit() {

        this.obtenerAreasServicio();
        await this.cargarOferta();
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'nombre',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true
        };
        this.crearOfertaForm = this.fb.group({
            titulo: [this.oferta.titulo || '', Validators.required],
            descripcion: [this.oferta.descripcion || '', Validators.required],
            creador: [
                this.oferta.creador?.uid || this.usuarioService.usuario.uid,
                Validators.required
            ],
            area_servicio: [
                this.oferta.area_servicio || '',
                Validators.required
            ],
            asignatura: [
                this.oferta.asignatura_objetivo || '',
                Validators.required
            ],
            fecha_limite: [this.oferta.fecha_limite || '', Validators.required],
            cuatrimestre: [this.oferta.cuatrimestre || '', Validators.required],
            anio_academico: [
                this.oferta.anio_academico || '',
                Validators.required
            ],
            observaciones: this.oferta.observaciones,
            tags: this.tags
        });
    }

    async cargarOferta() {
        this.oferta = new Oferta(
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            null,
            null,
            [],
            [],
            [],
            []
        );
    }

    async obtenerAreasServicio() {
        return this.ofertaService
            .obtenerAreasServicio()
            .subscribe((resp: any) => {
                this.areasServicio = resp.areasServicio;
                return this.areasServicio;
            });
    }

    nuevaAsign() {
    }

    enviarOferta() {
        this.formSubmitted = true;

        if (this.crearOfertaForm.invalid) {
            return;
        }

        this.formSending = true;

        let cuatrimestre = this.crearOfertaForm.get('cuatrimestre').value;
        if (cuatrimestre == 'Primer cuatrimestre') {
            this.crearOfertaForm.get('cuatrimestre').setValue(1);
            this.aux_cuatrimestre = 'Primer cuatrimestre';
        } else if (cuatrimestre == 'segundo') {
            this.crearOfertaForm.get('Segundo cuatrimestre').setValue(2);
            this.aux_cuatrimestre = 'Segundo cuatrimestre';
        } else {
            this.crearOfertaForm.get('cuatrimestre').setValue(3);
            this.aux_cuatrimestre = 'Anual';
        }
        this.ofertaService.crearOferta(this.crearOfertaForm.value).subscribe(
            (resp) => {
                this.oferta_id
                    ? Swal.fire(
                        'Ok',
                        'Oferta actualizada correctamente',
                        'success'
                    )
                    : Swal.fire('Ok', 'Oferta creada correctamente', 'success');

                this.router.routeReuseStrategy.shouldReuseRoute = () => false;

                if (this.activatedRoute.snapshot.queryParams.demanda_id !== undefined) {
                    this.router.navigate(['/partenariados/profesor/crear'], { queryParams: { demanda: this.activatedRoute.snapshot.queryParams.demanda_id, oferta: resp.oferta.id } });
                    return;
                }

                // this.activatedRoute.params.this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/ofertas/crear']);
                this.formSubmitted = false;
                this.formSending = false;
            },
            (err) => {
                console.log(err);
                let msg = [];
                if (err.error.errors) {
                    Object.values(err.error.errors).forEach((error_entry) => {
                        msg.push(error_entry['msg']);
                    });
                } else {
                    msg.push(err.error.msg);
                }
                this.crearOfertaForm
                    .get('cuatrimestre')
                    .setValue(this.aux_cuatrimestre);
                Swal.fire('Error', msg.join('<br>'), 'error');
                this.formSubmitted = false;
                this.formSending = false;
            }
        );
    }

    get getItems() {
        return this.areasServicio.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});
    }

    campoNoValido(campo): String {
        let invalido =
            this.crearOfertaForm.get(campo) &&
            this.crearOfertaForm.get(campo).invalid;

        if (invalido) {
            // switch (campo) {
            //   case 'terminos_aceptados':
            //     return 'Es obligatorio aceptar las condiciones de uso';
            //     break;

            //   default:
            return `El campo ${campo} es obligatorio`;
            //     break;
            // }
        }

        return '';
    }

    async computeTags() {
        this.utilsService.computeTags(`${this.crearOfertaForm.value.titulo} ${this.crearOfertaForm.value.descripcion}`).subscribe((resp: any) => {
            this.tags = resp.tags;
        });
    }
}
