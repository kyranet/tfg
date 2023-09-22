import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginExternoForm = this.fb.group({
    email: [ localStorage.getItem('email_externo') || '', [Validators.required, Validators.email] ],
    password: [ '', Validators.required ],
    remember: [ localStorage.getItem('remember_externo') || false ],
  });

  public loginUnedForm = this.fb.group({
    email: [ localStorage.getItem('email_uned') || '', [Validators.required, Validators.email] ],
    password: [ '', Validators.required ],
    remember: [ localStorage.getItem('remember_uned') || false ],
  });

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  loginExterno(): void {
    this.usuarioService
          .loginExterno( this.loginExternoForm.value )
          .subscribe( resp => {
            if( this.loginExternoForm.get('remember').value) {
              localStorage.setItem('email_externo', this.loginExternoForm.get('email').value);
              localStorage.setItem('remember_externo', this.loginExternoForm.get('remember').value);
            } else {
              localStorage.removeItem('email_externo');
              localStorage.removeItem('remember_externo');
            }

            this.router.navigate(['/']);
          }, err => {
            let msg = [];
            if(err.error.errors) {
              Object.values(err.error.errors).forEach(error_entry => {
                msg.push(error_entry['msg']);
              });
            } else {
              msg.push(err.error.msg);
            }

            Swal.fire('Error', msg.join('<br>'), 'error');
          });
  }


  loginUned(): void {
    this.usuarioService
          .loginUned( this.loginUnedForm.value )
          .subscribe( resp => {
            if( this.loginUnedForm.get('remember').value) {
              localStorage.setItem('email_uned', this.loginUnedForm.get('email').value);
              localStorage.setItem('remember_uned', this.loginUnedForm.get('remember').value);
            } else {
              localStorage.removeItem('email_uned');
              localStorage.removeItem('remember_uned');
            }

            this.router.navigate(['/']);
          }, err => {
            let msg = [];
            if(err.error.errors) {
              Object.values(err.error.errors).forEach(error_entry => {
                msg.push(error_entry['msg']);
              });
            } else {
              msg.push(err.error.msg);
            }

            Swal.fire('Error', msg.join('<br>'), 'error');
          });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();

  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  };


  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;

          this.usuarioService
                .loginGoogle( id_token )
                .subscribe( resp => {
                  this.ngZone.run(() => {
                    this.router.navigate(['/']);
                  });
                }, err => {
                  Swal.fire('Error', err.error.msg, 'error');
                });
        }, function(error) {
          // Swal.fire('Error', JSON.stringify(error, undefined, 2), 'error');
        });
  }

}
