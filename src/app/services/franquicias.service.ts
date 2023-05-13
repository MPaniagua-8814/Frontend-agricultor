import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IResolucion } from "../Interfaces/i-resolucion";
import { DatePipe } from '@angular/common';
import { SatRTUService } from "./sat_rtu.service";
import * as moment from 'moment';
import { SatProxyService } from "./sat_proxy.service";
import { Estados } from "../constante/estados.enum";
import { Carpetas } from "../constante/carpetas.enum";
import { ICatalogoFranq, IFranquicias } from "../Interfaces/i-franquicias";
import { ISolicitud } from "../Interfaces/i-solicitud";
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { IRevisarSolicitud } from "../Interfaces/i-revisar-solicitud";
import { IDevolverAnalista } from "../Interfaces/i-devolver-analista";

@Injectable({
  providedIn: "root"
})

export class FranquiciasService {

  private catalogoFranquicias:IFranquicias[]=[];

  constructor(private http: HttpClient,private satRTUService: SatRTUService,private satProxyService:SatProxyService, private datePipe: DatePipe,private spinner: NgxSpinnerService) { }

  get getCatalogoFranquicias() {
    return [...this.catalogoFranquicias];
  }

  getIpPublica() {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/obtenerIp', {responseType:'text'})
  };

  crearSolicitudBaseDatos(variables: any): Observable<any> {
    //return this.http.post("https://rtu.desa.sat.gob.gt/api/sat-aduanas-franq/solicitud", variables)
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS+ '/solicitud', variables);
    //return this.http.post('http://10.99.1.145:8080/solicitud', variables);
  };

  crearSolicitudBaseDatosPromise(variables: any){
    //return this.http.post("https://rtu.desa.sat.gob.gt/api/sat-aduanas-franq/solicitud", variables)
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS+ '/solicitud', variables).toPromise();
    //return this.http.post('http://10.99.1.145:8080/solicitud', variables);
  };

  obtenerSolicitudBaseDatos(): Observable<any> {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/solicitud');
  };

  obtenerSolicitudBDNit(nit: string) { //https://rtu.desa.sat.gob.gt/api/sat-aduanas-franq/solicitud/102
    //return this.http.get('http://10.99.1.145:8080/solicitud/nitEntidad/'+ nit);
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/solicitud/nitEntidad/' + nit);
  }

  obtenerSolicitudId(id: any) : Observable<ISolicitud>{
    return this.http.get<ISolicitud>(environment.BASE_MICROS_FRANQUICIAS + '/solicitud/id/' + id);
  }


  obtenerSolicitudId2(id:any){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/solicitud/id/' + id).toPromise();
  }

  actualizarSolicitudRollback(variables:any){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+ '/solicitud/actualizarSolicitud', variables).toPromise();
  };

  obtenerSolicitudUsuarioEstadoActual(usuario:string, estadoActual:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS+'/solicitud/solicitudes/'+`${usuario}/${estadoActual}`);
  }

  obtenerItemsIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/item/idSolicitud/' + idSolicitud);
  }

  //OBTENER LOS DOCUMENTOS
  obtenerAmpliacionIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAmpliacion/idSolicitud/' + idSolicitud);
  }

  crearAmpliacionBD(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docAmpliacion', variables);
  }

  crearAnexoBD(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docAnexo', variables);
  }

  obtenerDocAnalistaIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAnalista/idSolicitud/' + idSolicitud);
  }

  obtenerDocAnalistaIdSolicitudTipo(idSolicitud: any, formato:any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAnalista/obtenerDocAnalistaFormato/' + idSolicitud+ '/'+ formato);
  }

  obtenerDocSoporteIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docSoporte/idSolicitud/' + idSolicitud);
  }

  obtenerDocSoporteByTipoDocIdSolicitud(idSolicitud: any,tipoDoc:string) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docSoporte/' + idSolicitud + '/' + tipoDoc);
  }

  obtenerDocCentralizadorIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docCentralizador/idSolicitud/' + idSolicitud);
  }

  obtenerAnexoIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAnexo/idSolicitud/' + idSolicitud);
  }

  obtenerDocRespaldoIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docRespaldo/idSolicitud/' + idSolicitud);
  }

  actualizarSolicitudBaseDatos(variables: any): Observable<any> {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/solicitud', variables);

  };

  actualizarEstadoUsuario(variables: any){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/AsignacionUsuarios/usuario/actualizarEstadoUsuario', variables);
  }

  actualizarEstadoSolicitud(variables: any){
    //return variables;
    ///sat-aduanas-franq/solicitud/actualizarEstadoCarpetaActual
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/solicitud/actualizarEstadoCarpetaActual', variables);
  }

  crearDocCentralizador(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docCentralizador', variables);
  }

  crearItemBaseDatos(variables: any) {
    //return this.http.post('http://10.99.1.145:8080/item', variables).toPromise()
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/item', variables).toPromise()
      .then(async (res) => {
      })
      .catch(err => {
        this.retryItem(3, variables, 1)
      });
  };

  crearItemsBD(variables:any){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/items', variables).toPromise()
    .then(async (res) => {
    })
    .catch(err => {
      this.retryItem(3, variables, 1)
    });
  }
  async crearItem2(variables, cont) {

    try {
      let httpData = await this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/item', variables).toPromise()
    }
    catch (err) {
      cont++;
      this.retryItem(3, variables, cont)
    }
  };

  async retryItem(n, variables, cont?) {
    if (cont <= n) {
      let httpData = await this.crearItem2(variables, cont);
      return httpData
    }
    else {

    }

  }

  obtenerUltimoRegistroPorNoSolicitud(noSolicitud:string){

    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/ultimoRegistro/ultimoRegistroByNoSolicitud/${noSolicitud}`)

  }

  obtenerSolicitudPorNoSolicitud(noSolicitud:string){

    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/solicitudesByNoSolicitud/${noSolicitud}`)

  }

  actualizarItems(variables: any) {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/item', variables).toPromise()
  }

  actualizarListItems(variables:any){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/items', variables).toPromise()
  }

  obtenerItemBaseDatos() {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/item')
  };

  async obtenerCantidadDocumentos(idSolicitud: any) {
    let cantidad = 0;
    await this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAmpliacion/cantidad/' + idSolicitud).toPromise().then(async (res) => cantidad += <number>res);
    await this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAnexo/cantidad/' + idSolicitud).toPromise().then(async (res) => cantidad += <number>res);
    await this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docRespaldo/cantidad/' + idSolicitud).toPromise().then(async (res) => cantidad += <number>res);
    await this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docSoporte/cantidad/' + idSolicitud).toPromise().then(async (res) => cantidad += <number>res);
    return cantidad;
  }

  obtenerEstadosAnterioresSolicitudesIdSolicitud(idSolicitud: any) {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/bitacora/estadoAnterior/' + idSolicitud).toPromise().then(async (res) => res);
  }

  obtenerCantDocAnalistaTipoDocClaseDoc(tipoDoc:string,claseDoc:string, formatoDoc:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS+`/docAnalista/correlativo/${tipoDoc}/${claseDoc}/${formatoDoc}`).toPromise().then(async (res) => res);
  }

  //FINALIZA OBTENER DOCUMENTOS

  actualizarUltimoRegistroBaseDatos(variables: any) {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/ultimoRegistro', variables)
  }

  crearUltimoRegistroBaseDatos(variables: any): Observable<any> {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/ultimoRegistro', variables);
  };

  actualizarItemBaseDatos(variables: any): Observable<any> {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/item', variables);
  };

  actualizarItemsBaseDatos(variables: any): Observable<any> {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/items', variables);
  };

  crearDocumentoSoporteBaseDatos(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docSoporte', variables).toPromise();
  };

  crearDocumentosSoporteBaseDatos(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docsSoporte', variables).toPromise();
  };

  crearBitacoraBaseDatos(variables: any): Observable<any> {

    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/bitacora/crearBitacora', variables);
  };

    crearBitacoraResolucion(variables: any): Observable<any> {

    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/bitacoraAnalista', variables);
  };

  crearDocumentoRespaldo(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docRespaldo', variables).toPromise();
  };

  crearDocumentosRespaldo(variables: any) {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docsRespaldo', variables).toPromise();
  };

  crearBitacoraUsuarioBD(variables: any): Observable<any> {
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/bitacoraUsuario/crearBitacoraUsuario', variables);
  };

  actualizarDocumentoSoporte(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docSoporte',variables);
  }

  actualizarDocumentosSoporte(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docsSoporte',variables);
  }

  actualizarDocumentoAnexo(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docAnexo',variables);
  }

  actualizarDocumentosAnexo(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docsAnexo',variables);
  }

  actualizarDocumentoAmpliacion(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docAmpliacion',variables);
  }

  actualizarDocumentosAmpliacion(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docsAmpliacion',variables);
  }

  actualizarDocumentoAnalista(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docAnalista',variables);
  }

  actualizarDocumentosAnalista(variables:any): Observable<any>{
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+'/docsAnalista',variables);
  }

  actualizarDocumentoCentralizador(variables:any,id:string): Observable<any>{
    console.log('variables:: ',variables)
    console.log('id:: ',id)

    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+`/docCentralizador/${id}`,variables);
  }

  obtenerUsuariosRol(rol:string, region?){    //obtener usuarios ACTIVOS segun rol
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS+'/AsignacionUsuarios/usuariosDisponiblesAsignar/'+rol+'/0').toPromise();
  }

  obtenerUsuariosLogin(login: string){    //obtener usuarios ACTIVOS segun rol
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS+'/AsignacionUsuarios/obtenerUsuarioByLogin/'+login).toPromise();
  }

  obtenerUsuariosRolTodos(rol: string){    //obtener usuarios ACTIVOS e INACTIVOS segun rol
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS+'/AsignacionUsuarios/obtenerUsuariosTotales/'+rol+'/0').toPromise();
  }

  obtenerUsuariosRol2(rol:string, region?){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS+`/AsignacionUsuarios/usuariosDisponiblesAsignar/${rol}/${region}`).toPromise()
  }

  previewImage(archivo) {
    let extension = "pdf"
    if (extension.length === 0) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (event) {
      var urlDoc = reader.result;
      var newWindow = window.open("", "", "width=800,height=600");

      let file = new Blob([archivo], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);

      if (!newWindow) {
        alert("Permitir que el navegador abra ventanas externas.");
        return;
      } else if (extension === 'jpeg' || extension === 'jpg' || extension === 'png') {
        newWindow.document.write(`
              <head><title>Previsualización de imagen</title></head>
              <body>
              <div style="display: inline-block;height: 100%;width: 100%;text-align: center;">
                  <img src="${urlDoc}" style="max-width: 600px;"/>
              </div>
              <body>
              ` );
      } else if (extension === 'pdf' || extension == 'docx') {
        newWindow.document.write(`
              <head><title>Previsualización de imagen</title></head>
              <body>
                  <embed src="${fileURL}#toolbar=1&navpanes=1&scrollbar=1" style="width:100%;height:100%;"/>
              </body>` );
      } else {
        newWindow.document.write(`La imagen no se puede desplegar.`);
      }
    }
    reader.readAsDataURL(archivo);
  }

  formatoFecha(){  //fecha actual
    let hoy = new Date();
    let fecha = this.datePipe.transform(hoy, "dd-MM-yyyy");

    return fecha
  }

  formatoFecha2(date){
    let fecha = this.datePipe.transform(date, "dd-MM-yyyy");
    return fecha
  }

  formatoFechaReportes(date){
    let fecha = this.datePipe.transform(date, "yyyy-MM-dd");
    return fecha
  }

  cantidadSolicitudes(): Observable<any> {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/solicitud/cantidad');
  };

  crearDocumentoAnalista(variables: any){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/docAnalista', variables).toPromise()
  };

  crearBitacoraAnalista(variables: any){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/bitacoraAnalista', variables).toPromise()
  };

  obtenerBitacoraAnalistaByNoSolicitud(noSolicitud: string):Observable<IResolucion[]>{
    return this.http.get<IResolucion[]>(environment.BASE_MICROS_FRANQUICIAS + `/bitacoraAnalista/obtenerBitacoraAnalistaByNoSolicitud/${noSolicitud}`)
  };

  obtenerBitacoraAnalistaBySolicitudResolucion(nombreDocResolucion:string,noSolicitud: string):Observable<IResolucion[]>{
    return this.http.get<IResolucion[]>(environment.BASE_MICROS_FRANQUICIAS + `/bitacoraAnalista/obtenerBitacoraAnalistaBySolicitudResolucion/${nombreDocResolucion}/${noSolicitud}`)
  };

  obtenerBitacoraAnalistaByTipoResolucion(tipoResolucion:string,noSolicitud: string):Observable<IResolucion[]>{
    return this.http.get<IResolucion[]>(environment.BASE_MICROS_FRANQUICIAS + `/bitacoraAnalista/obtenerBitacoraAnalistaByTipoResolucion/${tipoResolucion}/${noSolicitud}`)
  };

  crearBitacorasAnalista(variables: any){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/bitacorasAnalista', variables).toPromise()
  };

  obtenerIdTipoFranquicia(tipoFranquicia: string, claseDocumento: string, tipoDocumento: string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/franquicia/obtenerId/${tipoFranquicia}/${claseDocumento}/${tipoDocumento}`).toPromise()
  };

  obtenerDocAnalistaEstado(idSolicitud:string, estado:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/docAnalista/obtenerDocAnalista/${idSolicitud}/${estado}`)
  };


  obtenerDocAnalistaActivo(idSolicitud:string , formatoDoc:string, estado:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/docAnalista/obtenerDocAnalistaSoliFormatoEstado/${idSolicitud}/${formatoDoc}/${estado}`)
  };

  obtenerUltimoAnalista(idSolicitud: string, estadoAnterior:string, estadoActual:any, rol:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS +`/bitacora/obtenerUsuario/${rol}/${estadoAnterior}/${estadoActual}/${idSolicitud}`)
  };

  eliminarDatosPorID(idSolicitud:string){
    return this.http.delete(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/eliminarSolicitud/${idSolicitud}`).toPromise();
  }

  fechaActual(){
    return (new Date().toJSON().split('T')[0])
  }


  horaActual(){
    let fechaHora = new Date().toJSON().split('T');
    let hora = fechaHora[1].split(".");
    return (hora[0])
  }

  obtenerDatosProsis( login ){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/consultas/usuariosProsis/' + login).toPromise();
  }

  crearUsuarioFranquicias(variables){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/AsignacionUsuarios/usuario/crearUsuario', variables);
  }

  obtenerDatosProsisNit( nit ){
      return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/consultas/usuariosProsisNit/' + nit).toPromise();
  }

  obtenerUsuariosFranquicias( login ){  ///AsignacionUsuarios/obtenerUsuarioByLogin/
  return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/AsignacionUsuarios/obtenerUsuarioByLogin/' + login).toPromise();
  }

  obtenerDocAnalistaByNo( no_resol){ ///api/sat-aduanas-franq/docAnalista/obtenerDocAnalistaByNoResolucion/?
  return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAnalista/obtenerDocAnalistaByNoResolucion/' + no_resol).toPromise();
  }

  obtenerRolUsuario( usuario){  //http://10.99.1.145:8080/consultas/consultasOID/consultaRoles/pdmelend
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/consultas/consultasOID/consultaRoles/' + usuario).toPromise()
    //return this.http.get('http://10.99.1.145:8080/consultas/consultasOID/consultaRoles/' + usuario).toPromise()
  }

  actualizarResolucion(variables: any){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+ '/docAnalista/actualizarEstadoResolucion', variables);
  }

  obtenerDocFactura(idSolicitud:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/docSoporte/docsFactura/${idSolicitud}`).toPromise();
  };

  obtenerDocTransporte(idSolicitud: string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/docSoporte/docsTransporte/${idSolicitud}`).toPromise();
  };

  cantidadSolicitudAnio(anio): Observable<any> {
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/cantidadSolicitudesAnio/${anio}`);
  };

  async obtenerDiasHabiles(cantidad:number){
    let cantidadRes:string ='';
    await this.satRTUService.obtenerFechaDiasHabiles(cantidad).toPromise().then(data => {
      let fechaFin = moment(data).toDate();
      let fechaInicio = new Date();

      fechaInicio.setHours(0, 0, 0, 0);

      var diff = Math.floor((Date.parse(fechaFin.toISOString()) - Date.parse(fechaInicio.toISOString())) / 86400000);
      cantidadRes='P'+ diff+ 'D';

    });
    return cantidadRes;
  }

  async enviarRequerimientoContribuyente(idSolicitud:string,estadoAnterior:string,idProceso:string,nombreUsuario:string){
    let variables = {
      "idSolicitud": Number(idSolicitud),
      "estadoActual": Estados.conRequerimientoContribuyente,
      "carpetaActual": Carpetas.conRequerimientoContribuyente,
      "estadoAnterior": estadoAnterior,
    }

    this.anularDocsAnalistaNotificacion(idSolicitud)
    let ipPublica:string='';

    this.getIpPublica().subscribe(res => {
      ipPublica = res;
    });
    console.log("ip publica = " , ipPublica)
    let cantidadDias:string  =await this.obtenerDiasHabiles(15);
    console.log("dias habiles = " , cantidadDias)
    this.actualizarEstadoSolicitud(variables).subscribe(async data => {
      this.satProxyService.tareaActual(idProceso).subscribe(async data => {
        const tareaActual = data.taskIdEnc;
        let variables = {
          outcome: "Requerimiento",
          values: {
            fechaAccion: new Date().toISOString(),
            ipUsuario: ipPublica,
            nombre: nombreUsuario,
            fechaCorreo: this.formatoFecha(),
            diasHabiles: cantidadDias
          }
        }
        console.log("variables = " , variables);

        this.satProxyService.completarFormulario(tareaActual, variables).subscribe(async data => { });
      });
    }, error => { console.error('No se actualizó el estado ni carpeta de la solicitud en base de datos: ', error); });
  }

  async enviarNotificacion(idSolicitud:string,estadoAnterior:string,idProceso:string,nombreUsuario:string){
    let variables = {
      "idSolicitud": Number(idSolicitud),
      "estadoActual": Estados.notificacionEmitida,
      "carpetaActual": Carpetas.notificadas,
      "estadoAnterior": estadoAnterior
    }
    this.anularDocsAnalistaNotificacion(idSolicitud)
    let ipPublica:string='';

    this.getIpPublica().subscribe(res => {
      ipPublica = res;
    });

    let cantidadDias:string  =await this.obtenerDiasHabiles(10);

    this.actualizarEstadoSolicitud(variables).subscribe(async data => {
      this.satProxyService.tareaActual(idProceso).subscribe(async data => {
        const tareaActual = data.taskIdEnc;
        let variables = {
          outcome: "Notificar",
          values: {
            fechaAccion: new Date().toISOString(),
            ipUsuario: ipPublica,
            nombre: nombreUsuario,
            fechaCorreo: this.formatoFecha(),
            diasHabiles: cantidadDias
          }
        }
        this.satProxyService.completarFormulario(tareaActual, variables).subscribe(async data => { });
      });
    }, error => {
      console.error('No se actualizó el estado ni carpeta de la solicitud en base de datos: ', error);
    });
  }

  obtenerFechaAsignacionAnalista(idSolicitud, estado){
    return this.http.get(`https://rtu.desa.sat.gob.gt/api/sat-aduanas-franq/bitacora/obtenerUltimaFechaEstado/${idSolicitud}/${estado}`).toPromise()
  }

  async obtenerCatologoFranquicias(){
    await this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/franquicia`).toPromise().then((data : IFranquicias[])=>{
      this.catalogoFranquicias = data;
    });
  }

  async obtenerFranquiciaPorId(idFranquicia:number):Promise<string>{
    if(this.catalogoFranquicias.length == 0){
      await this.obtenerCatologoFranquicias()
    }

    return this.catalogoFranquicias
      .filter(franq=>{ return franq.idFranquicia ==idFranquicia})
      .map(f=>f.tipoFranquicia).toString();

  }

  crearDucaFranq(variables:any): Observable<any>{
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS+'/ducaFranquicias',variables);
  }

  obtenerDocsAnalistaByNo( no_resol){ // en el servicio se concatena el texto "-A.pdf" "-D.pdf".. etc
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/docAnalista/obtenerDocsAnalistaByNoResolucion/' + no_resol).toPromise();
    }

    formatearNombreAcs(nombre:string){
      let nuevoCorr = nombre.split("-");
      if (nuevoCorr.length == 6) {

          let extension = nombre.split(".")[1];
          nombre = nuevoCorr[0] + '-' + nuevoCorr[1] + '-' + nuevoCorr[2] + '-' + nuevoCorr[3] + '-' + nuevoCorr[4] + '.' + extension;
      }

      return nombre;
    }

async setSolicitudBandeja(solicitud: ISolicitud, index: number): Promise<ISolicitud> {
    solicitud.fechaSolicitud = this.formatoFecha2(solicitud.fechaSolicitud);
    solicitud.no = index + 1;
    solicitud.franquicia = await this.obtenerFranquiciaPorId(solicitud.idTipoFranquicia)

    return solicitud;
  }


  validarEstadoBitacora( idSolicitud: number, estado: any ){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/bitacora/obtenerEstadoByIdSolicitud/'+idSolicitud+'/' + estado).toPromise();
  }


  actualizarDatosDocAnalista(variables: any){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS+ '/docAnalista/actualizarDatosDocAnalista', variables);
  }


  getSolicitudByEstadoUsuarioLogin(estado, login, usuario){   ///solicitud/solicitudesByEstadoUsuarioLogin/{estado}/{login}/{usuario}
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/solicitudesByEstadoUsuarioLogin/${estado}/${login}/${usuario}`)
  }

  obtenerIDNotificacion(idSolicitud){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/Notificacion/obtenerIdProcesoNotificacion/${idSolicitud}`);
  }

  actualizarProcesoNotificacion(idSolicitud, body){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + `/gestor/process/actualizarProcesoNotificacion/${idSolicitud}`,body)
  }

  actualizarDocumentosRespaldo(variables: any) {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/docsRespaldo', variables);
  };

  actualizarDocumentosCentralizador(variables: any) {
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/docsCentralizador', variables);
  };

  obtenerDocsAcs(nit, noSolicitud){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/gestor/obtenerListadoDocsAcs/${nit}/${noSolicitud}`);
  };

  agregarDocValidaWord(variables){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + `/franqValidaDocAnalista`, variables)
  };

  //Segunda fase

  async mensajeExito(mensaje:string){
    await Swal.fire('', mensaje, 'success');
  }

  async mensajeErrorServicios(){
    this.spinner.hide();
    await Swal.fire({
      confirmButtonText: 'Aceptar',
      icon: 'error',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'ERROR EN LOS SISTEMAS,INTENTE DE NUEVO',
    })
    location.reload();
  }

  async mensajeConfirmacion(mensaje:string): Promise<boolean>{
    let resultado:boolean = false;
    await Swal.fire({
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1369A0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Regresar'
    }).then(async (result) => {
      resultado = result.isConfirmed
    })
    return resultado;
  }

  async mensajeErrorNegocio(mensaje:string){
    await Swal.fire({
      confirmButtonText: 'Aceptar',
      icon: 'error',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: mensaje,
    })
  }

  async mensajeSolicitudUtilizada(){
    await Swal.fire({
      confirmButtonText: 'Aceptar',
      icon: 'info',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'No es posible emitir una resolución de “Corrección” o “Nulidad” porque la resolución tiene estado “Utilizada”, por favor verifique.',
    })
  }

  async mensajeError(mensaje:string){
    await Swal.fire({
      confirmButtonText: 'Aceptar',
      icon: 'error',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: mensaje,
    })
  }

  async mensajeAlertivo(mensaje:string){
    Swal.fire({
      text: mensaje,
      icon: 'question',
      confirmButtonColor: '#1369A0',
      confirmButtonText: 'Enterado',
    }).then((result) => {
      if (result.isConfirmed) { }
    });
  }

  obtenerNoSolicitudByIdSolicitud(idSolicitud:any): Observable<string>{
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/obtenerNoSolicitudByIdSolicitud/${idSolicitud}`,{responseType:'text'})
  }

  asignarSupervisor(variables:any): Observable<boolean> {
    return this.http.post<boolean>(environment.BASE_MICROS_FRANQUICIAS + `/analista/asignarSupervisor`,variables)
  }

  obtenerRevisarSolicitudBandeja(idSolicitud:string,bandeja:string): Observable<IRevisarSolicitud>{
    return this.http.get<IRevisarSolicitud>(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/obtenerRevisarSolicitudByBandeja/${idSolicitud}/${bandeja}`);
  }

  validarRevisadoBandeja(idSolicitud:string,bandeja:string): Observable<boolean>{
    return this.http.get<boolean>(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/validarRevisado/${idSolicitud}/${bandeja}`);
  }

  crearDocumentoWordAnalista(idSolicitud:string, variables:any){
    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/analista/crearDocumento/' + idSolicitud ,variables)
  }

  descargarAps(idFile, accion:string, nombre:string) {
    if (idFile) {
      this.satProxyService.descargarArchivoAps(idFile).subscribe(data => {
        if (accion === 'ver') {
          this.previewImage(data);
        }
        else if (accion === 'descargar') {
          this.downloadBlob(nombre, data)
        }
      });
    }
  }

  public downloadBlob(name: string, blob: Blob) {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
    document.body.removeChild(link);
  }

  guardarRevisionSolicitud(variables: any, actualizar?:boolean) {
    return this.http.put<boolean>(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/guardarRevision`, variables).toPromise().then(async respuesta => {
      this.spinner.hide()
      if (!respuesta) {
        await this.mensajeError('Error al guardar la revisión.')
        location.reload();
      }
      if (actualizar && respuesta) {
        await this.mensajeExito('Proceso de revisión guardado.')
        location.reload();
      }
    });
  }

  obtenerCatalogoFranquicias(): Observable<ICatalogoFranq>{
    return this.http.get<ICatalogoFranq>(environment.BASE_MICROS_FRANQUICIAS + `/franquicia/catalogo`);
  }

  asignarJefe(variables:any): Observable<boolean> {
    return this.http.post<boolean>(environment.BASE_MICROS_FRANQUICIAS + `/supervisor/asignarJefe`,variables)
  }

  cargarDocFirmadoAnalista(idSolicitud:string, idSignGetDoc:any, blob:any){
    let formData = new FormData();
    formData.append('file', blob)
    console.log('file: '+ blob)
    return this.http.post<boolean>(environment.BASE_MICROS_FRANQUICIAS + `/analista/cargarDocumentoFirma/${idSignGetDoc}/${idSolicitud}`,formData)
  }

  devolverAnalista(variables: any){
    return this.http.put(environment.BASE_MICROS_FRANQUICIAS + '/solicitud/devolverAnalista', variables)
  }

  crearBitacoraNotificacionReq(variables: any): Observable<any> {

    return this.http.post(environment.BASE_MICROS_FRANQUICIAS + '/bitacora/crearBitacoraNotificacionReq', variables);
  };

  async anularDocsAnalistaNotificacion(idSolicitud) {
    await this.obtenerDocAnalistaIdSolicitud(idSolicitud).toPromise().then(data => {
      let arrDocs: any = data;
      console.log(arrDocs);

      arrDocs.map(async arr => {
        console.log("arrDocs antes de actualizar", arr);
        if(arr.notificada != true){
          if(!arr.estado.includes("Revisado")){
            if (arr.estado != "Firmado Jefe" && arr.estadoResolucion != "Corregida") {
              arr.estado = "Anulado";
              arr.estadoResolucion = "Anulada";
              console.log("despues de actualizar", arr);
              await this.actualizarDocumentoAnalista(arr).toPromise().then();
            }
          }
        }
      });
    });
  }

  validarEstadoDucaFranquicias(noSolicitud){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/ducaFranquicias/validarEstadoDuca/${noSolicitud}`)
  }


  obtenerVisualizarDocs(fechaInicio, fechaFin, noSolicitud, nitSolicitante, estadoSolicitud, noDocEmitido){ // `/solicitud/obtenerRevisarSolicitudByBandeja/${idSolicitud}/${bandeja}`
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/visualizarDocs/${fechaInicio}/${fechaFin}/${noSolicitud}/${nitSolicitante}/${estadoSolicitud}/${noDocEmitido}`);
  }

  obtenerFranquicias(){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/franquicia`);
  }


  ///solicitud/visualizarDocs/{fechaInicio}/{fechaFin}/{noSolicitud}/{nitSolicitante}/{estadoSolicitud}/{noDocEmitido}

  obtenerSolicitudesBandejaUsuarioEstado(usuario:string,estado:string ){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + `/solicitud/obtenerSolicitudesPorEstadoUsuario/${usuario}/${estado}`);
  }

  //obtner datos duca nube
  getDucaNubeBySolicitudDesc(noSolicitud:string){
    return this.http.get(environment.BASE_MICROS_FRANQUICIAS + '/ducaFranquicias/obtenerDucaFranquiciasByNoSolicitud/'+ `${noSolicitud}`)
  }
}
