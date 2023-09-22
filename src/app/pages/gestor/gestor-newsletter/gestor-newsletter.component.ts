import { Component, OnInit } from '@angular/core';
import { MailerService } from 'src/app/services/mailer.service';
import { Newsletter } from 'src/app/models/newsletter.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestor-newsletter',
  templateUrl: './gestor-newsletter.component.html',
  styleUrls: ['./gestor-newsletter.component.scss']
})
export class GestorNewsletterComponent implements OnInit {

  public skip: number = 0;
  public limit: number = 5;
  public pagina_actual: number = 1;

  public totalNewsletters: number = 0;
  public newsletters: Newsletter[];

  public terminoBusqueda: string = '';
  public totalNewslettersBuscados: number = 0;

  public cargando: boolean = false;
  public cargandoTimeOut;


  constructor( private mailerService: MailerService) { }

  get prevLimit() {
    return -1 * this.limit;
  }

  get nextLimit() {
    return this.limit;
  }

  get firstPageRecord() {
    const minResultados = Math.min(this.totalNewsletters, this.totalNewslettersBuscados);

    if(minResultados === 0) {
      return 0;
    }

    return this.skip + 1;
  }

  get lastPageRecord() {
    return Math.min(Math.min(this.totalNewsletters, this.totalNewslettersBuscados), this.skip + this.limit);
  }


  ngOnInit(): void {
    this.cargarNewsletters();
  }

  cambiarPagina( per_page: number ) {
    this.skip += per_page;

    if(this.skip < 0) { this.skip = 0; }
    if(this.skip >= Math.min(this.totalNewsletters, this.totalNewslettersBuscados)) { this.skip -= per_page; }

    this.cargarNewsletters();
  }


  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
    };
  }

  cargarNewsletters() {
    this.mailerService.cargarNewsletters(this.skip, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, newsletters}) => {
          this.totalNewsletters = total.valueOf();
          this.totalNewslettersBuscados = filtradas.valueOf();
          this.newsletters = newsletters;
          this.cargando = false;
        });
  }

}