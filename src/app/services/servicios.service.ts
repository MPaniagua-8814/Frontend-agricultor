
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constantes } from '../utils/constantes';
import { environment } from 'src/environments/environment';
import { RespuestaWsEmpleados } from '../modelos/RespuestaWsEmpleados.class';
import { getParams, servicioBody } from '../componentes/comunes/interfaces/servicioBody.interface';


@Injectable({
  providedIn: 'root'
})

export class Servicios {

  // lo trae del enviroment dependiendo del ambiente
  BASE_API_SAT = environment.BASE_API_SAT;
  BASE_URL_SI = environment.BASE_URL_SI;
  BASE_URL_PROSIS = environment.BASE_URL_PROSIS;
  BASE_URL_PROXY = environment.BASE_URL_PROXY;
  BASE_URL_GVP = environment.BASE_URL_GVP;
  ID_SITIO_ACS = environment.ID_SITIO_ACS;

  URL_RTU = this.BASE_API_SAT + '/sat_rtu';
  URL_NOTIFICACIONES_CONTRIBUYENTE = this.BASE_API_SAT + '/sat_general';
  URL_SAT_RTU: string = this.URL_RTU;
  URL_CATALOGOS = this.BASE_API_SAT + '/sat_catalogo';
  URL_TOKEN = this.URL_RTU + '/reconocimientoFacial/tokens';

  // Microservicios Especiales

  // METODOS DE SAT-RTU


  CONSTANTES: Constantes = new Constantes;

  URL_SESSION_RTU = 'https://b5rmsdzfv5.execute-api.us-east-1.amazonaws.com/desarrollo/sesionrtu';
  URL_AWS_PINPOINT = 'http://pinpoint.us-east-1.amazonaws.com/v1/phone/number/verify/';

  URL_VALIDA_EMAIL = this.BASE_API_SAT + '/solicitudesagenciavirtual/solicitudesAgenciaVirtual';
  URL_CONDICION_ESPECIAL = 'http://microserviciosrtu.getsandbox.com';

  servicios: any;
  URL_DOCUMENTOS: any;
  NIT = '';

  constructor(private http: HttpClient) {
  }

  /**
   * Este metodo se encarga de consultar la informacion relacionada a un nit del empleado.
   *
   * @param nit es el identificador del empleado que se quiere consultar.
   * @returns `Observable<RespuestaWsEmpleados>` con la informacion de la respuesta.
   */
  public obtenerEmpleadoByNIT(nit: string): Observable<RespuestaWsEmpleados> {
    return this.http.get<RespuestaWsEmpleados>(`${this.BASE_URL_GVP}/consultas/empleadoProsisNit/${nit}`);
  }

  /**
   * Metodo que realiza un get a un microservicio haciendo uso de un solo parametro
   * enviando el valor en la url ejemplo http://host.microservicio/metodoGet/parametro
   * @param pUrl url del microservicio ejemplo http://host.microservicio/metodoGet
   * @param pNombreServicio nombre del servicio a llamar. Puede ser null
   * @param pParametro parametro que se envia al servicio este puede ser null si no se envia parametro
   */
  getData(pUrl: string, pNombreServicio: string | null, pParametro: string | null = null, pJSON: boolean = false): Observable<any> {

    if (pNombreServicio == null) {
      if (pParametro === null) {
        return this.http.get(`${pUrl}`, this.generateHeaders(pJSON));
      } else {
        return this.http.get(`${pUrl}/${pParametro}`, this.generateHeaders(pJSON));
      }
    } else {
      if (pParametro === null) {
        return this.http.get(`${pUrl}/${pNombreServicio}`, this.generateHeaders(pJSON));
      } else {
        return this.http.get(`${pUrl}/${pNombreServicio}/${pParametro}`, this.generateHeaders(pJSON));
      }
    }
  }

  /**
   * Metodo que realiza un get a un microservicio enviando en el url el nombre del parámetro
   * y el valor del parametro en la url ejempo http://host.microservicio/metodoGet?NombreParametro=ValorParametro
   * @param pUrl url del microservicio http://host.microservicio/metodoGet
   * @param pNombreServicio nombre del servicio a llamar. Puede ser null
   * @param pParametros parametro a enviar
   */
  public getParams<T>(pUrl: string, pNombreServicio: string | null, pParametros: getParams): Observable<T> {
    if (pNombreServicio == null) {
      return this.http.get<T>(`${pUrl}`, { params: pParametros });
    } else {
      return this.http.get<T>(`${pUrl}/${pNombreServicio}`, { params: pParametros });
    }
  }

  /**
  * Metodo que realiza un get a un microservicio enviando en el url el nombre del parámetro
  * y el valor del parametro en la url ejemplo
  * http://host.microservicio/metodoGet?NombreParametro=ValorParametro, retornando2
  * @param pUrl url del microservicio http://host.microservicio/metodoGet
  * @param pNombreParametro nombre del parametro a enviar
  * @param pParametro parametro a enviar
  */
  public getDataParametroJson<T>(pUrl: string, pNombreParametro: string, pParametro: string): Observable<T> {
    return this.http.get<T>(`${pUrl}?${pNombreParametro}=${pParametro}`, this.generateHeaders(true));
  }

  /**
   *
   * @param pUrl url del microservicio a consumir ejemplo http://host.microservicio/metodoPost
   * @param pParametro parametro del metodo post este puede ser null si no lleva parametro
   * @param pBody body del servicio con la estructura de la interface servicioBody obtiene la variable
   *              body de la interface que debe contener la estructura de envio del microservicio si se
   *              necesita agregar una nueva estructura se debe agregar en la interface
   * @param pJSON true cuando el metodo tiene content-type application-json, false si no tiene content-type
   */
  public postData(pUrl: string, pNombreServicio: string | null, pBody: Object, pJSON: boolean = true): Observable<any> {
    if (pNombreServicio === null) {
      return this.http.post(pUrl, pBody, this.generateHeaders(pJSON));
    } else {
      return this.http.post(`${pUrl}/${pNombreServicio}`, pBody, this.generateHeaders(pJSON));
    }
  }

  /**
   * funcion para crear el headers que se enviara en los servicios
   * @param json agrega si el contenido sera de tipo json
   * @author cesalgue carlos salguero
   */
  public generateHeaders(json: boolean = false): object {
    let headers: HttpHeaders;
    if (json) {
      headers = new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json'
      });
    } else {
      headers = new HttpHeaders({
        'Accept': '*/*'
      });
    }
    let httpOptions: object = { "headers": headers };
    return httpOptions;
  }

  /**
   * Metodo que realiza el patch de un microservicio
   * @param pUrl url del microservicio y metodo patch ejemplo https://host.microservicio/metodopatch
   * @param pParametro parametro que recibe el micro servicio en el metodo patch
   * @param pBody body del servicio con la estructura de la interface servicioBody obtiene la variable
   *              body de la interface que debe contener la estructura de envio del microservicio si se
   *              necesita agregar una nueva estructura se debe agregar en la interface
   */
  public patchData(pUrl: string, pParametro: string, pBody: servicioBody): Observable<any> {
    let body = null;
    if (pBody) {
      body = JSON.stringify(pBody.body);
    }

    if (pParametro === null) {
      return this.http.patch(`${pUrl}`, body, this.generateHeaders(true));
    }
    else {
      return this.http.patch(`${pUrl}/${pParametro}`, body, this.generateHeaders(true));
    }
  }

  public putData(pUrl: string, pParametro: string, pBody: servicioBody = null) {
    let body = null;
    if (pBody)
      body = JSON.stringify(pBody.body);

    if (pParametro === null) {
      return this.http.put(`${pUrl}`, body, this.generateHeaders(true));
    }
    else {
      return this.http.put(`${pUrl}/${pParametro}`, body, this.generateHeaders(true));
    }
  }

  /**
   * Método para obtener el archivo del S3 AWS
   * @param pUrl Url del microservicio de carga de archivos ejemplo: https://g7qmj1ebgf.execute-api.us-east-1.amazonaws.com/desarrollo/docinscriprtu
   * @param pNombreFolder nombre del folder en el S3 donde se encuentra el documento
   * @param pNombreArchivo nombre del archivo que se desea descargar
   */
  getArchivoS3(pUrl: string, pNombreFolder: string, pNombreArchivo: string) {
    return this.http.get(`${pUrl}/${pNombreFolder}/${pNombreArchivo}`, { responseType: 'blob' });
  }

  /**
  * Método para obtener el archivo desde el microservicio
  * @param pCodigo codigo de la imagen
  */
  public getArchivo(pCodigo: String) {
    return this.http.get('http://10.99.1.138:48080/documentos/privado/documento/17', this.generateHeaders(true));
  }

  /**
   * Metodo que elimina un documento de la S3 AWS
   * @param pUrl Url del microservicio de carga de archivos ejemplo: https://g7qmj1ebgf.execute-api.us-east-1.amazonaws.com/desarrollo/docinscriprtu
   * @param pNombreFolder nombre del folder en el S3 donde se se encuentra el documento
   * @param pNombreArchivo nombre del archivo que se desea eliminar
   */
  deleteArchivoS3(pUrl: string, pNombreFolder: string, pNombreArchivo: string) {
    return this.http.delete(`${pUrl}/${pNombreFolder}/${pNombreArchivo}`, { observe: 'response' }
    );
  }

  public optenerNIT() {
    const nit = prompt('Ingrese NIT para las pruebas', this.NIT);
    if (nit) {
      this.NIT = nit;
    } else {
      alert('no ingreso ningun nit');
    }
  }


  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      if (error.status === 200) {
      } else {
      }

    } else {
      if (error.status === 200) {
      } else {
      }
    }
    return throwError(
      'carga-archivo: Algo malo paso, por favor intente mas tarde.');
  };

  public getIpPublica<T>(): Observable<T> {
    return this.http.get<T>("https://api.ipify.org/?format=json")
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
  }

  public postData2(pUrl: string, pNombreServicio: string | null, pBody: servicioBody, pJSON: boolean = true): Observable<any> {
    let body = pBody ? pBody.body : null;
    if (pNombreServicio === null) {
      return this.http.post(pUrl, body, this.generateHeaders(pJSON));
    } else {
      return this.http.post(`${pUrl}​/${pNombreServicio}​`, body, this.generateHeaders(pJSON));
    }
  }

}
