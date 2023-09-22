import { Component, Input, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { PartenariadoService } from 'src/app/services/partenariado.service';
import Swal from 'sweetalert2';
import { Partenariado } from 'src/app/models/partenariado.model';


@Component({
    selector: 'app-notificacion',
    templateUrl: './notificacion.component.html',
    styleUrls: ['./notificacion.component.scss']
})
export class NotificacionComponent implements OnInit{


    public notificacion: Notificacion;

    constructor(public notificacionService: NotificacionService, public activatedRoute: ActivatedRoute, public router: Router, public usuarioService: UsuarioService, public PartenariadoService: PartenariadoService) {
    }



    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ id }) => {
            this.cargarNotificacion(id);
        });
    }

    cargarNotificacion(id: string){
        this.notificacionService.cargarNotificacion(id).subscribe((notificacion : Notificacion) =>{
            if(!notificacion){
                return this.router.navigateByUrl(`/mi-resumen`);
            }
            this.notificacion = this.notificacionService.mapearNotificaciones([notificacion])[0];
            console.log(this.notificacion);
            
            if(this.notificacion.idPartenariado != null){
                this.PartenariadoService.cargarPartenariado(this.notificacion.idPartenariado).subscribe((partenariado: Partenariado)=>{
                    if(!partenariado){
                        return this.router.navigateByUrl(`/mi-resumen`);
                    }
                    this.notificacion.mensaje +=' ' + partenariado.titulo;

                })
            }
        });
    }

    AceptacionRechazada(){
        this.notificacionService.rechazarSocio(this.notificacion.id).subscribe((ok: boolean)=>{
            if(ok){
                this.ngOnInit();
            }
        });
        
    }

    AceptacionAceptada(){
        Swal.fire(
            'Atención',
            'Antes de crear un partenariado debes completar los datos de oferta',
            'warning'
        );
        return this.router.navigate(['partenariados/profesor/crear'], { queryParams: { notificacion: this.notificacion.id } });

    }
    AceptacionMatching(){
        return this.router.navigate(['partenariados/profesor/crear'], { queryParams: { notificacion: this.notificacion.id, oferta : this.notificacion.idOferta, demanda_id : this.notificacion.idDemanda } });

    }

    CompletarPartenariado(){
        console.log(this.notificacion);
        return this.router.navigate(['partenariados/profesor/crear'], { queryParams: { idPartenariado: this.notificacion.idPartenariado, idOferta: this.notificacion.idOferta } });
    }





    
}