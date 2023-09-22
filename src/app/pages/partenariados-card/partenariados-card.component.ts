import { Component, Input, OnInit } from '@angular/core';
import { OfertaCrearGuard } from 'src/app/guards/oferta-crear.guard';
import { Partenariado } from 'src/app/models/partenariado.model';
import { OfertaService } from 'src/app/services/oferta.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-partenariado-card',
  templateUrl: './partenariados-card.component.html',
  styleUrls: ['./partenariados-card.component.scss']
})
export class PartenariadosCardComponent implements OnInit {

  @Input() partenariado: Partenariado
  
  constructor(
    public ofertaCrearGuard: OfertaCrearGuard,
    public ofertaService: OfertaService,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

}
