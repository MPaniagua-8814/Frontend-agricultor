import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root"
})


export class ServiciosAgricultor {
  
  _url = 'https://beneficio-cafetito-ws.herokuapp.com';
  header = new HttpHeaders().set('Type-content', 'application/json')
  // nitTemporal = "99671395";

  constructor(private http: HttpClient) {

    console.log("si llega a los servicios")

  }


  obtener(){
    let header = new HttpHeaders().set('Type-content', 'application/json')
    return null;
    // return this.http.get(this._url+'/beneficio/farmer/listar', { headers: header});
  }

  obtenerPesajesPorNit(nit: string) {
    
    return this.http.get(environment.rutaMicros+'/Agricultor/list/weighing', { headers: this.header})
    //    obtenerPesajesPorNit(nit: number) {
  //  return this.http.get(environment.rutaMicros+"/beneficio/count/agricultor/"+this.nitTemporal, { headers: this.header})
  
  }

  obtenerCuentasBeneficio(nit: number) {
    return this.http.get(environment.rutaMicros+"/beneficio/count/agricultor/"+nit, { headers: this.header})
  
  }


  crearPesaje( variables : any){

    this.http.post(environment.rutaMicros+"/Agricultor/create/weighing", variables).subscribe(
      data =>{
        console.log("data de crear pesaje agricultor === " , data)
      }
    )

    //tengo que consumir el de crear en el beneficio también
    /*return*/ /*this.http.post(environment.rutaMicros+"/beneficio/count/create", variablesBeneficio).subscribe(
      data =>{
        console.log("data de crear pesaje en el beneficio === " , data)
      }
    )*/
  }

  crearTransporte( variables : any): Observable<any>{
    return this.http.post(environment.rutaMicros+"/Agricultor/create/transport", variables)
  }

  crearTransportista( variables : any): Observable<any>{
    return this.http.post(environment.rutaMicros+"/Agricultor/create/carrier", variables)
  }

  obtenerParcialidadesPorIdPesaje( idPesaje : number){

    return this.http.get(environment.rutaMicros+"/Agricultor/count/parts/"+idPesaje, { headers: this.header})
    //return this.http.get(environment.rutaMicros+"/beneficio/count/parts/"+idPesaje, { headers: this.header})
  }

  crearParcialidades( variables: any): Observable<any>{
    // crearParcialidades( variables: any, variablesBeneficio: any){
    //return 
    return this.http.post(environment.rutaMicros+"/Agricultor/count/parts/create", variables)
    
    //se debe agregar en el beneficio
    // this.http.post(environment.rutaMicros+"/beneficio/count/parts/create", variablesBeneficio).subscribe(
    //   data =>{
    //     console.log("data de crear parcialidad en el beneficio === " , data)
    //   }
    // )
  }

  getIpPublica() {
    return this.http.get(environment.serviciosPrueba + '/obtenerIp', {responseType:'text'})
  };

  obtenerDatosPrueba() {
    //   this.http.get(environment.rutaMicros+"/beneficio/farmer/listar", {responseType:'text'}).subscribe( resp => {
    //     console.log(resp)
    //     return resp
    // })
  };
//https://beneficio-cafetito-ws.herokuapp.com/swagger-ui/index.html#/

  obtenerTransportes(){

    //return this.http.get(environment.rutaMicros+"/beneficio/transport/list/"+this.nitTemporal, { headers: this.header})
    return this.http.get(environment.rutaMicros+"/Agricultor/list/transport", { headers: this.header})

  }

  obtenerTransportistas(){

    return this.http.get(environment.rutaMicros+"/Agricultor/list/carrier", { headers: this.header})
    ///return this.http.get(environment.rutaMicros+"/beneficio/carrier/list/"+this.nitTemporal, { headers: this.header})

  }

  obtenerCatalogoMedidas(id:any){

    return this.http.get(environment.rutaMicros+"/beneficio/catalogue/" + id, { headers: this.header})

  }

}
