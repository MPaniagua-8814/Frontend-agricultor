import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-parcialidad',
  templateUrl: './crear-parcialidad.component.html',
  styleUrls: ['./crear-parcialidad.component.scss']
})
export class CrearParcialidadComponent implements OnInit {

  title= "Crear parcialidad";
  //title= "Prueba";

  transportes: any = [{placa:"No existen transportes registrados"}];
  transportistas: any = [{nombre:"No existen transportistas registrados."}];
  idPesaje : any;
  idCuenta: any;
  usuarioActual : any;
  medidaPeso: any;

  public formDatosParcialidad = new FormGroup({
    transporte: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
    transportista: new FormControl(null, [Validators.required]),
    tipoMedida: new FormControl(null, Validators.required),
    //nitAgricultor: new FormControl(null, Validators.required),
    peso: new FormControl(null, [Validators.required, Validators.min(1)])
  });

  
  constructor(private servicios: ServiciosAgricultor, private router: Router, 
    private route: ActivatedRoute,private authService: AuthService) { }


  ngOnInit(): void {

    this.idPesaje =  (this.route.snapshot.paramMap.get("idPesaje"));
    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));
    this.medidaPeso =  (this.route.snapshot.paramMap.get("medida"));
    this.obtenerTransportistas();
    this.obtenerTransportes();
    

    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    this.usuarioActual = sessionStorage.getItem("usuarioActual")

  }

  regresar(){

    location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje+'/'+this.idCuenta+'/'+this.medidaPeso
  }

  obtenerTransportistas(){
    this.servicios.obtenerTransportistas().subscribe(
      resp =>{
        let temp:any = resp;
        let temp2: any=[];
        temp.map( (data:any ) =>{
          if(data.disponible || data.idPesaje == Number(this.idPesaje)){
            console.log("data == " , data)
            temp2.push(data)
          }
        })
        if( temp2?.length>0) this.transportistas = temp2;
        return temp2;
      }
    );

  }

  obtenerTransportes(){
    console.log("transportes inicial === " ,this.transportes)
    this.servicios.obtenerTransportes().subscribe(
      resp =>{
        let temp : any = resp;
        let temp2: any=[];
        temp.map( (data:any ) =>{
          if(data.disponible || data.idPesaje == Number(this.idPesaje)){
            console.log("data == " , data)
            temp2.push(data)
          }
        })
        if( temp2?.length>0) this.transportes = temp2;
        return temp2;
      
      }
    );
  }

  crearParcialidad(){

    let datos = {
      // "idParcialidad": 0,  //es automático
      "idPesaje": this.idPesaje, 
      "idCuenta": this.idCuenta, 
      "idTransporte": this.formDatosParcialidad.controls.transporte.value, 
      "idTransportista":this.formDatosParcialidad.controls.transportista.value,
      "pesoParcialidad": this.formDatosParcialidad.controls.peso.value, 
      "tipoMedida": this.formDatosParcialidad.controls.tipoMedida.value,
      "usuarioAgrego": this.usuarioActual //agarrar username del servicio de jwt
    }

    this.servicios.crearParcialidades( datos ).toPromise().then(
      data =>{
        console.log("data ==== " , data)
        this.mensajeExito()
      }
    ).catch(err => {
      console.log("entra al error ===== " , err.status)
      if(err.status == 200 || err.status == 201){
        this.mensajeExito()
      }
      else{
        this.mostrarMensajeError(err.error)
      }
    });

  }

  formValid(){
    let transporte = this.formDatosParcialidad.controls.transporte.value;
    let transportista = this.formDatosParcialidad.controls.transportista.value;

    return (this.formDatosParcialidad.valid && transporte!= 'Seleccione un Transporte' && transportista!='Seleccione un Transportista')
  }

  mensajeExito(){
    Swal.fire({
      title: "La parcialidad se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje+'/'+this.idCuenta+'/'+this.medidaPeso
    });
  }


  mostrarMensajeError(texto:any){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
      // footer: '<a href="">Why do I have this issue?</a>'
    }).then((result) => {
      location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje+'/'+this.idCuenta+'/'+this.medidaPeso
    });
    
  }

}
