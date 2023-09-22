import { Component, OnInit } from '@angular/core'
import { OfertaService } from 'src/app/services/oferta.service'
import { UsuarioService } from 'src/app/services/usuario.service'
import { Oferta } from '../../models/oferta.model'
import { UtilsService } from 'src/app/services/utils.service'
import { Profesor } from '../../models/profesor.model'
import { OfertaCrearGuard } from 'src/app/guards/oferta-crear.guard'
import { Router } from '@angular/router'
import { CUATRIMESTRE } from '../../models/cuatrimestre.model'
import { PartenariadoService } from 'src/app/services/partenariado.service'
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.scss'],
})
export class OfertasComponent implements OnInit {

  public CUATRIMESTRES = CUATRIMESTRE
  public cuatrimestres = ['a', 'b', 'c']

  public pageTitle = 'Ofertas'
  

  public dropdownSettings: IDropdownSettings = {};

  public offset = 0
  public limit = 50
  public paginaActual = 1

  public totalOfertas = 0
  public ofertas: Oferta[]
  public profesores: Profesor[]

  public terminoBusqueda = ''
  public Fecha='2021'
  public totalOfertasBuscadas = 0

  public cargando = false
  public cargandoTimeOut

  public filterProfesores = {}
  public filterAreaServicio = ''
  public filterCuatrimestre = [1, 2, 3]
  public filterCreador = ''
  public tags = []
  public tagInput = []; 


  public areasServicio: any;

  constructor(
    public ofertaCrearGuard: OfertaCrearGuard,
    public ofertaService: OfertaService,
    public usuarioService: UsuarioService,
    public utilsService: UtilsService,
    public partenarioService: PartenariadoService,
    private router: Router,
  ) {
    if (this.router.url === '/mis-ofertas') {
      this.filterCreador = this.usuarioService.usuario.uid
      this.pageTitle = 'Mis Ofertas'
    }
  }

  prevPage(): void {
    const newOffset = this.offset - this.limit
    this.offset = newOffset < 0 ? 0 : newOffset
  }

  nextPage(): void {
    const newOffset = this.offset + this.limit
    this.offset = newOffset >= this.totalOfertas ? this.offset : newOffset
  }

  get firstPageRecord(): number {
    const minResults = Math.min(this.totalOfertas, this.totalOfertasBuscadas)
    return minResults === 0 ? 0 : this.offset + 1
  }

  get lastPageRecord(): number {
    return this.ofertas.length ?  this.ofertas.length  : 0
  }

  ngOnInit(): void {
    this.cargarProfesores()
    this.cargarOfertas()
    this.obtenerAreasServicio();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'nombre',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }

  onItemSelectedArea(item: any){
    this.ofertaService.cargarOfertasPorAreaServicio(item.id).subscribe(({ ok, ofertas }) => {
      this.ofertas = ofertas
    });
  }



  // onItemSelectedProfesor(profesor: any){ 
  //   this.ofertaService.cargarOfertasPorProfesor(profesor.id).subscribe(({ ok, ofertas }) => {
  //     this.ofertas = ofertas
  //   });
  // }

  cambiarPagina(): void {
    this.cargarOfertas()
  }

  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
      profesores: this.filterProfesores,
      cuatrimestre: this.filterCuatrimestre.map((v, index, array) =>
        v ? index + 1 : 0,
      ),
      areaServicio: this.filterAreaServicio,
      creador: this.filterCreador,
      tags: this.tagInput.map(x => x.value)
    }
  }

  cargarOfertas(): void {
    this.ofertaService
      .cargarOfertas(this.offset, this.limit, this.getFiltros())
      .subscribe(({ total, filtradas, ofertas }) => {
        this.totalOfertas = total.valueOf()
        this.totalOfertasBuscadas = filtradas.valueOf()
        this.ofertas = ofertas
        this.cargando = false
      })
  }
 

  onItemProfesor(profesor: any){
    var filters = this.getFiltros();
    filters.creador = profesor.id;
    this.ofertaService
      .cargarOfertas(this.offset, this.limit, filters)
      .subscribe(({ total, filtradas, ofertas }) => {
        this.totalOfertas = total.valueOf()
        this.totalOfertasBuscadas = filtradas.valueOf()
        this.ofertas = ofertas
        this.cargando = false
      })
  }

  cargarProfesores(): void {
    this.partenarioService
      .obtenerProfesores()
      .subscribe(({ok, profesores}) => {
        console.log(profesores);
        this.profesores = profesores 
      })
  }
 
  
  async computePossibleTags($event) {
    this.utilsService
      .computePossibleTags($event.target.value)
      .subscribe((resp: any) => {
        this.tags = resp.tags.map(function (x) {
          return x['nombre']
        })
      })
  }

  async obtenerAreasServicio(){
    return this.ofertaService.obtenerAreasServicio().subscribe((resp: any)=>{
      this.areasServicio = resp.areasServicio;
      return this.areasServicio;
    });
  }
}
