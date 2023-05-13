import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicios } from './servicios.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SatSeguridadService {
  // URL DE Micro Servicios pulblicados
  BASE_API_SAT      = environment.BASE_API_SAT;
  URL_SAT_SEGURIDAD = this.BASE_API_SAT + '/sat-seguridad';
  URL_TOKEN         = this.URL_SAT_SEGURIDAD + '/tokens';

  constructor(
    private http: HttpClient,
    private servicio: Servicios
    ) {}

  /**
   * Metodo que obtiene el token de seguridad por medio de recaptcha
   * @param captcha captcha
   * @author cesaltu (Emiliano)
   */
  getTokenRecaptcha(captcha: string): Observable<any> {
    return this.servicio.getData(this.URL_TOKEN, null, captcha);
  }

  /**
   * obteiene un token de una secion de un operador o contribuyente
   * @param code
   * @param redirect_uri url a la que redireccionara
   * @param scope
   * @author cesaltu (Emiliano)
   */
  getToken(code: string, redirect_uri: string, scope: string): Observable<any> {
    let param = {
      uri : redirect_uri
    }
    return this.servicio.getParams(this.URL_TOKEN, `${code}/${scope}`, param);
  }

  /**
   * obteiene un token de una secion por medio de una clave
   * @param code clave unica para generar token de captcha
   */
  getTokencaptcha(code: string): any {
    return this.servicio.getData(this.URL_TOKEN, 'key', code);
  }

  /**
   * renueva token vencido por medio de token refresh
   * @param pRefreshToken token secundario para refrescar token de seguridad
   * @author cesaltu (Emiliano)
   */
  refreshToken(pRefreshToken) {
    return this.servicio.getData(this.URL_TOKEN, 'new', pRefreshToken);
  }

}
