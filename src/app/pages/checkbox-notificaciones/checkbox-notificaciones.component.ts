import { Component, OnInit } from '@angular/core';
import { faGrinTongueSquint } from '@fortawesome/free-solid-svg-icons';
import { NotificacionService } from 'src/app/services/notificacion.service'
import { Usuario } from './../../models/usuario.model';
import { Notificacion } from './../../models/notificacion.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-checkbox-notificaciones',
  templateUrl: './checkbox-notificaciones.component.html',
  styleUrls: ['./checkbox-notificaciones.component.scss']
})
export class CheckboxNotificacionesComponent implements OnInit {
  public offset = 0;
  public limit = 400; // Cambia este valor para ajustar el número de notificaciones por página.
  public filterUsuario = {};
  public totalNotificaciones = 0;
  public notificaciones: Notificacion[] = [];
  public totalNotificacionesBuscadas = 0;
  public cargando = false;

  constructor(
    public notificacionService: NotificacionService,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarNotificacion();
  }

  getFiltros() {
    return {
      usuario: this.filterUsuario
    }
  }

  cargarNotificacion(): void {
    this.cargando = true;
    this.notificacionService
      .cargarNotificaciones( this.usuarioService.usuario.uid)
      .subscribe(({ total,  notificaciones }) => {
        this.totalNotificaciones = total.valueOf();
        this.notificaciones = notificaciones;
        this.cargando = false;
      });
  }

  DesactivarNotificacion(): void {
    this.notificaciones = [];
  }

}
