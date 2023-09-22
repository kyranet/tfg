import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Mail } from '../models/mail.model';
import { Newsletter } from '../models/newsletter.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MailerService {

  constructor( private http: HttpClient, private usuarioService: UsuarioService) { }

  mapearMails( emails: any ): Mail[] {
    if(!emails) {
      return [];
    }
    return emails.map(
      mail => new Mail(mail.type, mail.mail_from, mail.mail_name, mail.to, mail.subject, mail.html, mail.usuario, mail.createdAt)
    );
  }

  mapearNewsletters( newsletters: any ): Newsletter[] {
    if(!newsletters) {
      return [];
    }
    return newsletters.map(
      newsletter => new Newsletter(newsletter.mail_to, newsletter.usuario, newsletter.createdAt)
    );
  }


  cargarMails(skip: number, limit: number, filtros: Object) {
    return this.http.get<{ total: Number, filtradas: Number, mails: Mail[]}>(`${ base_url }/mails?skip=${ skip }&limit=${ limit }&filtros=${ encodeURIComponent( JSON.stringify(filtros)) }`, this.usuarioService.headers)
                    .pipe(
                      map( resp => { return { total: resp.total, filtradas: resp.filtradas, mails: this.mapearMails(resp.mails) }; })
                    );
  }

  cargarNewsletters(skip: number, limit: number, filtros: Object) {
    return this.http.get<{ total: Number, filtradas: Number, newsletters: Newsletter[]}>(`${ base_url }/mails/newsletters?skip=${ skip }&limit=${ limit }&filtros=${ encodeURIComponent( JSON.stringify(filtros)) }`, this.usuarioService.headers)
                    .pipe(
                      map( resp => { return { total: resp.total, filtradas: resp.filtradas, newsletters: this.mapearNewsletters(resp.newsletters) }; })
                    );
  }


  enviarMailContacto(subject: string, html: string) {
    return this.http.post(`${ base_url }/mails/contacto`, { subject, html }, this.usuarioService.headers)
        .pipe(
          tap( (resp: any) => {
            console.log(resp);
          })
        );
  }

  suscribirMailNewsletter(mail: string) {
    return this.http.post(`${ base_url }/mails/suscribir-newsletter`, { mail_to: mail }, this.usuarioService.headers)
        .pipe(
          tap( (resp: any) => {
            console.log(resp);
          })
        );
  }


}
