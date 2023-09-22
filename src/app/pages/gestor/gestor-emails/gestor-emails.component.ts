import { Component, OnInit } from '@angular/core';
import { MailerService } from 'src/app/services/mailer.service';
import { Mail } from 'src/app/models/mail.model';

@Component({
  selector: 'app-gestor-emails',
  templateUrl: './gestor-emails.component.html',
  styleUrls: ['./gestor-emails.component.scss']
})
export class GestorEmailsComponent implements OnInit {

  public skip: number = 0;
  public limit: number = 5;
  public pagina_actual: number = 1;

  public totalMails: number = 0;
  public mails: Mail[];

  public terminoBusqueda: string = '';
  public totalMailsBuscados: number = 0;

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
    const minResultados = Math.min(this.totalMails, this.totalMailsBuscados);

    if(minResultados === 0) {
      return 0;
    }

    return this.skip + 1;
  }

  get lastPageRecord() {
    return Math.min(Math.min(this.totalMails, this.totalMailsBuscados), this.skip + this.limit);
  }


  ngOnInit(): void {
    this.cargarMails();
  }

  cambiarPagina( per_page: number ) {
    this.skip += per_page;

    if(this.skip < 0) { this.skip = 0; }
    if(this.skip >= Math.min(this.totalMails, this.totalMailsBuscados)) { this.skip -= per_page; }

    this.cargarMails();
  }


  getFiltros() {
    return {
      terminoBusqueda: this.terminoBusqueda,
    };
  }

  cargarMails() {
    this.mailerService.cargarMails(this.skip, this.limit, this.getFiltros())
        .subscribe( ({total, filtradas, mails}) => {
          this.totalMails = total.valueOf();
          this.totalMailsBuscados = filtradas.valueOf();
          this.mails = mails;
          this.cargando = false;
        });
  }
}