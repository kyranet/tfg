import { Component, Input, OnInit } from '@angular/core';

import { Oferta } from '../../models/oferta.model'
import { OfertaService } from 'src/app/services/oferta.service'
import { UsuarioService } from 'src/app/services/usuario.service'
import { OfertaCrearGuard } from 'src/app/guards/oferta-crear.guard'

@Component({
  selector: 'app-oferta-card',
  templateUrl: './oferta-card.component.html',
  styleUrls: ['./oferta-card.component.scss']
})
export class OfertaCardComponent implements OnInit {

  @Input() oferta: Oferta

  constructor(
    public ofertaCrearGuard: OfertaCrearGuard,
    public ofertaService: OfertaService,
    public usuarioService: UsuarioService
  ) { 
  }

  ngOnInit(): void {
  }

}
