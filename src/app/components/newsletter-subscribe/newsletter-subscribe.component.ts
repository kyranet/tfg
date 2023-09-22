import { Component } from '@angular/core';
import { MailerService } from 'src/app/services/mailer.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-newsletter-subscribe',
  templateUrl: './newsletter-subscribe.component.html',
  styleUrls: ['./newsletter-subscribe.component.scss']
})
export class NewsletterSubscribeComponent {

  public formSending = false;

  public suscribeForm = this.fb.group({
      email: [this.usuarioService.usuario?.email || '', [Validators.required, Validators.email]],
    });

  constructor( private mailerService: MailerService, private usuarioService: UsuarioService, public fb: FormBuilder ) { }

  suscribirse() {
    const email_field = this.suscribeForm.get('email');

    if(email_field.invalid) {
      Swal.fire('Error', 'El correo electrónico debe ser un correo válido', 'error');
    }

    this.formSending = true;
    this.mailerService.suscribirMailNewsletter(email_field.value)
          .subscribe( resp => {
            if(resp.ok) {
              Swal.fire('Ok', 'Te has suscrito satisfactoriamente a nuestra newsletter', 'success');
            } else {
              Swal.fire('Error', resp.msg, 'error');
            }

            this.formSending = false;
          }, err => {
            console.log(err);

            let msg = [];
            if(err.error.errors) {
              Object.values(err.error.errors).forEach(error_entry => {
                msg.push(error_entry['msg']);
              });
            } else {
              msg.push(err.error.msg);
            }

            Swal.fire('Error', msg.join('<br>'), 'error');
            this.formSending = false;
          });


  }

}
