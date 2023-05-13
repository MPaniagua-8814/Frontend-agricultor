import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bandeja-principal',
  templateUrl: './bandeja-principal.component.html',
  styleUrls: ['./bandeja-principal.component.scss']
})
export class BandejaPrincipalComponent implements OnInit {

  title = 'Bandeja Principal'
  pesajes : any= []
  transportes: any=[]
  transportistas: any=[]
  tabMostrar='';
  tab1 = true;
  tab2 = false;
  tab3 = false;
  nitAgricultor :any;
  cuentas : any=[];

  public formDatosPesaje = new FormGroup({
    // idEstado: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    estado: new FormControl(null),
    peso: new FormControl(null, [Validators.required]),
    // tipoMercancia: new FormControl(null, Validators.required)
  });

  public formDatosTransporte = new FormGroup({
    placa: new FormControl(null, [Validators.required]),
    marca: new FormControl(null, [Validators.required]),
    color: new FormControl(null, [Validators.required]),
    modelo: new FormControl(null, [Validators.required, Validators.min(1980)]),
  });

  public formDatosTransportista = new FormGroup({
    cui: new FormControl(null, [Validators.required, Validators.min(100000)]),
    idTransporte: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(null, [Validators.required]),
  });

  constructor( private servicios: ServiciosAgricultor, private router: Router) { }

  ngOnInit(): void {
   
    this.nitAgricultor = sessionStorage.getItem('nitAgricultor')
    console.log("nitsessionStorage ==== " , this.nitAgricultor)
    this.obtenerCuentas()
    //aqui se va a consultar pesajes por agricultor
    this.servicios.obtenerPesajesPorNit(this.nitAgricultor).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.pesajes = resp;
    })

    this.obtenerTransportes()
    this.obtenerTransportistas()

  }

  mostrar(tab:string){
    let a = document.getElementById("home-tab")?.className;
    let b = document.getElementById("profile-tab")?.className;
    let c = document.getElementById("contact-tab")?.className;

    if(tab == 'home'){
      console.log("tab 1")
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;

      a += " active";
      b = document.getElementById("profile-tab")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )
      c = document.getElementById("contact-tab")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    }
    else if(tab == 'profile-tab'){
      console.log("tab 2")
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;

      b += " active";
      a = document.getElementById("profile-tab")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )
      c = document.getElementById("contact-tab")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    }
    else if(tab == 'contact-tab'){
      console.log("tab 3")
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;

      c += " active";
      a = document.getElementById("profile-tab")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )
      b = document.getElementById("contact-tab")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    }

  }

  crearPesaje(){

    let data = { 
      "nitAgricultor": this.nitAgricultor,
      "idCuenta": 0, 
      "pesoTotal": this.formDatosPesaje.controls.peso.value
    }

    ////necesito mandar el id pesaje
    // let dataBeneficio = { 
    //   "nitAgricultor": this.nitAgricultor,
    //   "idPesaje": 0,   ///no lo tengo
    //   "pesoTotal": this.formDatosPesaje.controls.peso.value,
    //   "usuarioAgrego": "localhost"
    // }

    this.servicios.crearPesaje(data);
    this.mensajeExito()
  }

  formValid(){
    return this.formDatosPesaje.valid
  }

  formValidTransporte(){
    return this.formDatosTransporte.valid
  }

  formValidTransportista(){
    return this.formDatosTransportista.valid
  }

  mensajeExito(){
    Swal.fire({
      //title: "La parcialidad se ha creado con éxito.",
      title: "El pesaje se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
      // location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje
    });
    //location.href = environment.RUTA_BASE + 'bandeja-solicitudes';
  }

  obtenerCantidadParcialidades( idCuenta: number){
    console.log("id Cuenta enviado === " , idCuenta)
    //let parcialidades = //this.servicios.obtenerParcialidadesPorIdPesaje(idCuenta).subscribe
    let parcialidades ;
    console.log("parcialidades = " , parcialidades)
    //return parcialidades.length
//return parcialidades
  }

  formatoFecha( fecha: Date){
    let f2 = (fecha.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }

  fechaActual(){
    let date = new Date().toISOString()
    let f2 = (date.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }

  //ya no se va a usar
  contarParcialidades(idCuenta: number){
    let parcialidades = this.servicios.obtenerParcialidadesPorIdPesaje(idCuenta).subscribe;
    return parcialidades.length
  }

  obtenerEstado(idCuenta:number){
    let nombreEstado =[]; 
    nombreEstado = this.cuentas.filter( (data: any) => {
      if(data.idCuenta == idCuenta){
        return data.idEstado.nombre
      }
    })
    console.log("que hay === " , nombreEstado[0].idEstado.nombre)
    return nombreEstado[0]?.idEstado.nombre
  }

  crearTransporte(){
  
    let data;
    let dataBeneficio;

    data = {
      "placa": this.formDatosTransporte.controls.placa.value,
      "marca": this.formDatosTransporte.controls.marca.value,
      "color": this.formDatosTransporte.controls.color.value,
      "modelo": this.formDatosTransporte.controls.modelo.value,
      "nitAgricultor": this.nitAgricultor,
      "usuarioAgrego": "localhost"
    }

    this.servicios.crearTransporte(data, dataBeneficio);
    this.mensajeExitoTransporte()
  }


  mensajeExitoTransporte(){
    Swal.fire({
      title: "El transporte se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }

  obtenerTransportes(){
    let consulta : any= this.servicios.obtenerTransportes().subscribe(
      resp =>{
        console.log("transportes", resp)
        this.transportes = resp;
        return resp;
      }
    );
  }

  obtenerTransportistas(){
    let consulta : any= this.servicios.obtenerTransportistas().subscribe(
      resp =>{
        console.log("transportistas", resp)
        this.transportistas = resp;
        return resp;
      }
    );
  }

  estado(dato:any){
    if (dato){
      return "Activo"
    }
    else{
      return "Inactivo"
    }
  }


  crearTransportista(){
  
    let form = this.formDatosTransportista.controls
    console.log("fecha === " , form.fechaNacimiento.value)
    let data = {
      "idTransportista": Number(form.cui.value),
      "idTransporte": form.idTransporte.value,
      "nombre": form.nombre.value,
      "fechaNacimiento": form.fechaNacimiento.value,
      // "fechaNacimiento": "2023-05-12T04:20:53.136Z", 
      "nitAgricultor": this.nitAgricultor,
      // "usuarioAgrego": "localhost"
      "usuarioAgrego":"localhost"
    }

    console.log("data === " , data)
    this.servicios.crearTransportista(data);
    this.mensajeExitoTransportista()
  }


  mensajeExitoTransportista(){
    Swal.fire({
      title: "El transportista se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }


  obtenerCuentas(){

    this.servicios.obtenerCuentasBeneficio(this.nitAgricultor).subscribe(
      resp =>{
        console.log("cuentas", resp)
        this.cuentas =  resp;
        return resp;
      }
    );
    
  }


}
