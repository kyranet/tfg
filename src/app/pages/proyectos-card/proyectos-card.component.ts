import { Component, OnInit } from '@angular/core';
import { OfertaCrearGuard } from 'src/app/guards/oferta-crear.guard';
import { OfertaService } from 'src/app/services/oferta.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-proyectos-card',
  templateUrl: './proyectos-card.component.html',
  styleUrls: ['./proyectos-card.component.scss']
})
export class ProyectosCardComponent implements OnInit {

  constructor(
    public ofertaCrearGuard: OfertaCrearGuard,
    public ofertaService: OfertaService,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

}
