import { Component, OnInit } from '@angular/core';
import { HomeService } from "../../services/home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public count_proyectos: string;
  public count_partenariados: string;
  public count_iniciativas: string;

  constructor( private homeService: HomeService) {
    this.count_proyectos = '...';
    this.count_partenariados = '...';
    this.count_iniciativas = '...';
  }

  ngOnInit(): void {
    this.cargarDatosHome();
  }


  cargarDatosHome() {
    this.homeService.cargarDatosHome()
        .subscribe( (resp: any) => {
          this.count_proyectos = resp.count_proyectos;
          this.count_partenariados = resp.count_partenariados;
          this.count_iniciativas = resp.count_iniciativas;
        });
  }


}
