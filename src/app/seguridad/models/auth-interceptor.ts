import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TokenOauth2 } from './tokenoauth2.model';
import { environment } from './../../../environments/environment';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { SatSeguridadService } from 'src/app/services/sat_seguridad.service';
import { AlertDialogComponent } from 'src/app/componentes/comunes/alert-dialog/alert-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  private isRefreshingConect: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshConectSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private url_seguridad: string;

  constructor(
    private dialog: MatDialog,
    private sat_seguridad: SatSeguridadService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.url_seguridad = sat_seguridad.URL_SAT_SEGURIDAD;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken: string = window.sessionStorage.getItem("accessToken");
    const refreshToken: string = window.sessionStorage.getItem("refreshToken");
    const guard: string = window.sessionStorage.getItem("guard");

  
    if (req && req.url.includes("api/") && !req.url.includes(this.url_seguridad)) {

      if (authToken) {
        req = this.addToken(req, authToken);
      }

      return next.handle(req).pipe(
        catchError(error => {
          this.spinner.hide()
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              // si es por token invalido
              if (error.error.error == 'invalid_token') {
                if (refreshToken && guard == 'Authorization') { // token de operador
                  return this.handle401Error(req, next, refreshToken);
                } else if (guard == 'recaptcha') { // token de recaptcha
                  this.cerrarSession();
                } else {
                  this.cerrarSession();
                }
              } else if (error.error == 'Acceso no autorizado') {
                console.error('ERROR DE ACCESO NO AUTORIZADOO');
                if (environment.production) {
                  this.myAlert('ERROR 401', 'Usted no tiene los permisos nesesarios para realizar esta acción')
                } else {
                  let url = error.url;
                  this.myAlertConfirm('ERROR: 401','Recurso no autorizado');
                }
                return throwError(error);
              } else {
                if (environment.production) {
                  this.myAlert('ERROR 401', 'Usted no tiene los permisos nesesarios para realizar esta acción')
                } else {
                  let url = error.url;
                  this.myAlertConfirm('ERROR: 401','Recurso no autorizado');
                }
                console.error('ERROR: 401 desconocido!! ');
                console.error('detalle de error ', error.error.error);
                console.error('MENSAJE de error ', error.error.message);
                return throwError(error);
              }
            } else if (error.status == 500 || error.status == 503) { // cambiar por codigo cuando se esta desplengando

              this.myAlertConfirm('ERROR:','Ocurrio un error en los servicios');
              if (error.error.error == 'Internal Server Error') {
                return this.handle503Error(req, next);
              } else {
                console.error('ERROR: ' + error.status + ' desconocido : REPORTAR A Desarrollo para controlarlo');
                console.error('detalle de error ', error.error.error);
                console.error('MENSAJE de error ', error.error.message);
                return throwError(error);
              }
            } 
            else if(error.status == 404)
            {}
            else {
              this.myAlertConfirm('ERROR:','Ocurrio un error en los servicios');
              return throwError(error);
            }
          } else {
            console.error('error no controlado Reportarlo.');
            return throwError(error);
          }
        })
      );
    } else {
      return next.handle(req).pipe(catchError(error => {
        this.spinner.hide()
        if (error instanceof HttpErrorResponse) {
          if (error.status == 503) {
            if (error.error.error == 'Internal Server Error') {
              return this.handle503Error(req, next);
            } else {
              console.warn('Error no controlado 503 - ' + error.error.error);
              console.error('MENSAJE de error ', error.error.message);
              return this.handle503Error(req, next);
            }
          } else {
            this.myAlertConfirm('ERROR','Error en los servicios'); 
            return throwError(error);
          }
        } else {
          console.error('error no controlado Reportar a Desarrollo');
          console.error('detalle de error: ', error);
          console.error('detalle de error interno: ', error.error);
          return throwError(error);
        }
      }));
    }
  }

  /**
   *metodo en caso de un error 401 por token vencido
   * llama a un metodo par renovar el token 
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler, refreshToken: string): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      console.log('ERROR: 401 - invalid_token');
      console.warn('Token Vencido se Procede a renovarlo...');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.sat_seguridad.refreshToken(refreshToken).pipe(
        switchMap((token: TokenOauth2) => {
          window.sessionStorage.setItem("accessToken", token.access_token);
          window.sessionStorage.setItem("refreshToken", token.refresh_token);
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(this.addToken(request, token.access_token));
        }),
        finalize(() => {
          console.warn('TOKEN Renovado, reiniciando peticiones REST...');
          this.isRefreshing = false;
        }),
        catchError(err => {
          console.error('error al refrescar Token: ', err);
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(access_token => {
          return next.handle(this.addToken(request, access_token));
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * metodo en caso de un error 503 de alfresco o 500 de MS por despliege
   * muestra un modal con un timer que espera a que se reestablesca los serivicios 
   */
  private handle503Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isRefreshingConect) {
      console.log('ERROR: service unavailable');
      console.warn('Servicio no disponible, se reintentara conectar');
      this.isRefreshingConect = true;
      this.refreshConectSubject.next(null);

      let timerInterval
      return this.myTimerAlert().pipe(
        switchMap((val) => {
          console.warn(val);
          if (val) {
            this.refreshConectSubject.next(1);
            return next.handle(request);
          } else {
            console.error('Se cancelo el reintento');
            return throwError(false);
          }
        }),
        finalize(() => {
          console.warn('Tiempo de espera terminado...');
          this.isRefreshingConect = false;
        })
      );
    } else {
      return this.refreshConectSubject.pipe(
        filter(num => num != null),
        take(1),
        switchMap(() => {
          return next.handle(request);
        }),
        catchError(err => {
          if (!this.isRefreshingConect)
            console.error('error al reintentar, intenta una ves más', err);
          return this.handle503Error(request, next);
        })
      );
    }
  }

  private cerrarSession() {
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('refreshToken');
    window.sessionStorage.removeItem('pageRedirect');
    window.sessionStorage.removeItem('pageRedirectParams');
    window.sessionStorage.removeItem("guard");
    window.location.reload();
  }

  myAlert(title?: string, text?: string, icon?: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        text: text,
        icon: icon,
        showConfirmButton: false
      }
    });
    return dialogRef.beforeClosed();
  }

  myAlertConfirm(title?: string, text?: string, icon?: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        text: text,
        icon: icon,
        showConfirmButton: true
      }
    });
    dialogRef.beforeClosed().toPromise().then(()=>{
      location.href = environment.RUTA_BASE + this.router.url.split("/")[1]
    })
    return dialogRef.beforeClosed();
  }

  myTimerAlert() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      height: '200',
      data: {
        title: 'Se ha perdido la conexion a los servicios!',
        text: 'Se reintentara en 60 segundos.',
        timer: 6000, // 60 segundos
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: true,
        allowOutsideClick: false,
      }
    });
    return dialogRef.beforeClosed();

  }

}