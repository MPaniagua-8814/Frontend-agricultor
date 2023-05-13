import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-pesaje',
  templateUrl: './detalle-pesaje.component.html',
  styleUrls: ['./detalle-pesaje.component.scss']
})
export class DetallePesajeComponent implements OnInit {

  title = 'Detalle Pesaje'
  parcialidades : any= []
  idCuenta: any;
  idPesaje: any;

  constructor( private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));;
    this.idPesaje =  (this.route.snapshot.paramMap.get("idPesaje"));;
    //this.idPesaje =  (this.route.snapshot.paramMap.get("idCuenta"));;

    //this.parcialidades= this.servicios.obtenerParcialidadesPorIdPesaje(1);

    //aqui se va a consultar detalle (parcialidades) por cuenta
    this.servicios.obtenerParcialidadesPorIdPesaje(this.idPesaje).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.parcialidades = resp;
    })

  }


  regresar(){
    location.href = 'bandeja-principal'
  }

}
