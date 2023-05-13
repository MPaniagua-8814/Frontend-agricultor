import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  transportes: any = [{idTransporte:"No existen transportes registrados"}];
  transportistas: any = [{nombre:"No existen transportistas registrados."}];
  idPesaje : any;
  idCuenta: any;

  public formDatosParcialidad = new FormGroup({
    transporte: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
    transportista: new FormControl(null, [Validators.required]),
    tipoMedida: new FormControl(null, Validators.required),
    //nitAgricultor: new FormControl(null, Validators.required),
    peso: new FormControl(null, [Validators.required, Validators.min(1)])
  });

  
  constructor(private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute,) { }


  ngOnInit(): void {

    this.idPesaje =  (this.route.snapshot.paramMap.get("idPesaje"));;
    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));;
    this.obtenerTransportistas();
    this.obtenerTransportes();
  }

  regresar(){

    location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje
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

  obtenerTransportes(){
    let consulta : any= this.servicios.obtenerTransportes().subscribe(
      resp =>{
        console.log("transportes", resp)
        this.transportes = resp;
        return resp;
      }
    );
  }

  crearParcialidad(){

    let datos = {
      // "idParcialidad": 0,  //es automático
      "idCuenta": this.idCuenta, 
      "idPesaje": this.idPesaje, 
      "idTransporte": this.formDatosParcialidad.controls.transporte.value, 
      "pesoParcialidad": this.formDatosParcialidad.controls.peso.value, 
      "tipoMedida": this.formDatosParcialidad.controls.tipoMedida.value,
      "idTransportista":this.formDatosParcialidad.controls.transportista.value
    }


    let datos2 ={
      "idCuenta": this.idPesaje,
      "idTransporte": this.formDatosParcialidad.controls.transporte.value,
      "idTransportista": this.formDatosParcialidad.controls.transportista.value,
      "pesoEnviado": this.formDatosParcialidad.controls.peso.value,
      "usuarioAgrego": "localhost"
    }

    console.log("que hay en datos 2", datos2)

    this.servicios.crearParcialidades( datos );
    this.mensajeExito()
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
      location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje+'/'+this.idCuenta
    });
  }

}
