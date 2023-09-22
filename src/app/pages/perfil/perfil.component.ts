import { Component, OnInit } from '@angular/core';
import { Oferta } from 'src/app/models/oferta.model';
import { Usuario } from 'src/app/models/usuario.model';
import { OfertaService } from 'src/app/services/oferta.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    ValidatorFn
  } from '@angular/forms';
  

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
    public ofertas: Oferta[];
    public usuario: Usuario;
    public filterCreador = ''; 
    public limit = 100

    public terminoBusqueda = ''
    public totalOfertasBuscadas = 0
  
    public cargando = false
    public cargandoTimeOut
  
    public filterProfesores = {}
    public filterAreaServicio = {}
    public filterCuatrimestre = [1, 2, 3] 
    public tags = []
    public tagInput = []; 
    public totalOfertas = 0
    
    constructor(
        public ofertaService: OfertaService,
        public usuarioService: UsuarioService,
        public activatedRoute: ActivatedRoute,
        public router: Router
    ) {
        this.filterCreador = this.usuarioService.usuario.uid;
        this.filterCreador = this.usuarioService.usuario.uid;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ email }) => {
            this.cargarUsuario(email);
        });
      this.cargarOfertas();
    }

    cargarUsuario(email: string):void{
        this.usuarioService.cargarUsuarioPorEmail(email).subscribe((usuario : Usuario) =>{
            if(!usuario){
                return this.router.navigateByUrl(`/mi-resumen`);
            }
            this.usuario = this.usuarioService.mapearUsuarios([usuario])[0];
            console.log(this.usuario);
        });
    }

    cargarOfertas(): void {
      this.ofertaService
        .cargarOfertas(0, this.limit, this.getFiltros())
        .subscribe(({ total, filtradas, ofertas }) => {
          this.totalOfertas = total.valueOf()
          this.totalOfertasBuscadas = filtradas.valueOf()
          this.ofertas = ofertas
          this.cargando = false
        })
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
      tags: this.tagInput.map(x => x.value),
    }
  }
}
