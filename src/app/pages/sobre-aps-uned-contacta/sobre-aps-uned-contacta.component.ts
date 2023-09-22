import { Component, OnInit } from '@angular/core';
import { MailerService } from '../../services/mailer.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sobre-aps-uned-contacta',
  templateUrl: './sobre-aps-uned-contacta.component.html',
  styleUrls: ['./sobre-aps-uned-contacta.component.scss']
})
export class SobreApsUnedContactaComponent implements OnInit {

  public formSubmitted = false;
  public formSending = false;

  public contactForm = this.fb.group({
      nombre: [this.usuarioService.usuario?.nombre || '', Validators.required],
      apellidos: [this.usuarioService.usuario?.apellidos || '', Validators.required],
      email: [this.usuarioService.usuario?.email || '', [Validators.required, Validators.email]],
      area: ['Pregunta sin categorizar', Validators.required],
      mensaje: ['', Validators.required],
    });

  constructor( private mailerService: MailerService, private usuarioService: UsuarioService, public fb: FormBuilder ) { }

  ngOnInit(): void {}

  enviarMailContacto(): void {

    this.formSubmitted = true;

    if(this.contactForm.invalid) {
      return;
    }

    const subject = `Formulario de Contacto: ${ this.contactForm.get('area').value }`;
    const html = `
      <p><b>Email: </b>${ this.contactForm.get('email').value }</p>
      <p><b>Persona de contacto: </b>${ this.contactForm.get('nombre').value } ${ this.contactForm.get('apellidos').value }</p>

      <p><b>Mensaje: </b>${ this.contactForm.get('mensaje').value }</p>
    `;

    this.formSending = true;
    this.mailerService.enviarMailContacto(subject, html)
          .subscribe( resp => {
            Swal.fire('Ok', 'Formulario enviado correctamente', 'success');
            this.formSubmitted = false;
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
            this.formSubmitted = false;
            this.formSending = false;
          });
  }

  campoNoValido(campo): String {

    let invalido = this.contactForm.get(campo) && this.contactForm.get(campo).invalid;

    if(invalido) {
      switch (campo) {
        case 'email':
          return 'El campo correo electrónico es obligatorio y debe ser un correo válido';
          break;
        default:
          return `El campo ${ campo } es obligatorio`;
          break;
      }
    }

    return '';
  }


}
