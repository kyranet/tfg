import { Component, OnInit } from '@angular/core';
import { DemandaService } from 'src/app/services/demanda.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import {Demanda} from '../../models/demanda.model';
import Swal from 'sweetalert2';

import { AREA_SERVICIO } from '../../models/areaServicio.model';
import { NECESIDAD_SOCIAL } from '../../models/necesidadSocial.model';
import { ENTIDAD_DEMANDANTE} from '../../models/entidadDemandante.model';
import { DemandaCrearGuard } from 'src/app/guards/demanda-crear.guard';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    selector: 'app-demandas', // Selector para definir objetos de la clase
    templateUrl: './demandas.component.html',
    styleUrls: ['./demandas.component.scss']
})

export class DemandasComponent implements OnInit{

    public AREA_SERVICIO = AREA_SERVICIO;
    public NECESIDAD_SOCIAL = NECESIDAD_SOCIAL;
    public ENTIDAD_DEMANDANTE = ENTIDAD_DEMANDANTE;
    
    //public selectDemanda: any;

    public dropdownSettings: IDropdownSettings = {};
    public areasServicio: any;
    public necesidades: any;
    public limit = 5;
    public paginaActual = 1;
    public offset = 0;
    
    public totalDemandas = 0;
    public demandas: Demanda[];

    public terminoBusqueda = '';
    public totalDemandasBuscadas = 0;

    public cargando = false;
    public cargandoTimeOut;


    public filterNecesidadSocial = {};
    public filterAreaServicio = {};
    public filterEntidadDemandante = {};
    public filterCreador = '';

    constructor( 
        public demandaCrearGuard: DemandaCrearGuard,
        public demandaService: DemandaService,
        public usuarioService: UsuarioService,
        private router: Router ){
            //this.profesores.forEach(profesor => {this.filterProfesores[profesor] = false;})
            //NECESIDAD_SOCIAL.forEach(necesidadSocial => {this.filterNecesidadSocial[necesidadSocial] = false;});
            //ENTIDAD_DEMANDANTE.forEach(entidadDemandante => {this.filterEntidadDemandante[entidadDemandante] = false;});
            AREA_SERVICIO.forEach(areaServicio => {this.filterAreaServicio[areaServicio] = false;});
        if(this.router.url === '/mis-demandas'){
            this.filterCreador = this.usuarioService.usuario.uid;
        }
    }
    
    prevPage():void{
        const newOffset = this.offset - this.limit;
        this.offset = newOffset < 0 ? 0 : newOffset;
    }

    nextPage(): void {
        const newOffset = this.offset + this.limit;
        this.offset = newOffset >= this.totalDemandas ? this.offset : newOffset;
    }

    get firstPageRecord(): number {
        const minResults = Math.min(this.totalDemandas, this.totalDemandasBuscadas);
        return (minResults === 0) ? 0: this.offset + 1;
    }

    get lastPageRecord(): number {
        return this.totalDemandas;
    }

    ngOnInit(): void {
        this.obtenerNecesidadesSociales();
        this.obtenerAreasServicio();
        this.cargarDemandas();
        this.dropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'nombre',
            itemsShowLimit: 10,
            allowSearchFilter: true,
        };
    }

    onItemSelected(item: any){
        console.log("ID item: " + item.id);
        console.log("Item: " + item.nombre );
        this.demandaService.cargarDemandasPorNecesidadSocial(item.id).subscribe(({ok, demandas}) =>{
            this.demandas = demandas;
        });
    }

    cambiarPagina(): void {
        this.cargarDemandas();
    }

    onItemSelectedArea(item: any){
        console.log("ID: " + item.id + "Item: " + item.nombre);
        this.demandaService.cargarDemandasPorAreaServicio(item.id).subscribe(({ok, demandas}) =>{
            this.demandas = demandas;
        });
    }

    getFiltros() {
        return {
            terminoBusqueda: this.terminoBusqueda,
            entidadDemandante: this.filterEntidadDemandante,
            necesidadSocial: this.filterNecesidadSocial,
            areaServicio: this.filterAreaServicio,
            creador: this.filterCreador,
        };
    }

    cargarDemandas() {
        this.demandaService
        .cargarDemandas(this.offset, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, demandas}) => {
            this.totalDemandas = total.valueOf();
            this.totalDemandasBuscadas = filtradas.valueOf();
            this.demandas = demandas;
            this.cargando = false;
        });
    }

    async obtenerAreasServicio(){
        return this.demandaService.obtenerAreasServicio().subscribe((resp: any)=>{
            this.areasServicio = resp.areasServicio;
            return this.areasServicio;
        });
    }
    
    async obtenerNecesidadesSociales(){
        return this.demandaService.obtenerNecesidades().subscribe((resp: any)=>{
            this.necesidades = resp.necesidadSocial;
            return this.necesidades;
        })
    }
}