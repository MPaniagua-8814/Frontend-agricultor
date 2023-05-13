import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SatSeguridadService } from 'src/app/services/sat_seguridad.service';
import { TokenOauth2 } from '../models/tokenoauth2.model';

@Component({
  selector: 'app-form-recaptcha',
  templateUrl: './form-recaptcha.component.html',
  styleUrls: ['./form-recaptcha.component.scss']
})
export class FormRecaptchaComponent {

  token: TokenOauth2;
  //aalruanoe  30.10.18 se modifica porcentralizador de servicios
  constructor(private sat_seguridad: SatSeguridadService, private router: Router) { }

  public resolved(captchaResponse: string) {
    this.sat_seguridad.getTokencaptcha(captchaResponse).subscribe(
      data => {
        this.token = data;
        console.log(this.token);
        window.sessionStorage.removeItem('accessToken');
        window.sessionStorage.setItem('accessToken', this.token.access_token);
        this.router.navigate([sessionStorage.getItem('pageRedirect')]);
      },
      dataerror => {
        console.log("Error al consultar el Token " + JSON.stringify(dataerror));
        this.router.navigate([sessionStorage.getItem('pageRedirect')]);
      },
      () => {
        console.log("Get Token Finalizado");
        this.router.navigate([sessionStorage.getItem('pageRedirect')]);
      }
    );
  }

}
