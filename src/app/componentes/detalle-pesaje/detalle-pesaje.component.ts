import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  medidaPeso: any;

  usuarioActual: any;

  constructor( private servicios: ServiciosAgricultor, private router: Router, 
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));
    this.idPesaje =  (this.route.snapshot.paramMap.get("idPesaje"));
    this.medidaPeso =  (this.route.snapshot.paramMap.get("medida"));
    //this.idPesaje =  (this.route.snapshot.paramMap.get("idCuenta"));;

    //this.parcialidades= this.servicios.obtenerParcialidadesPorIdPesaje(1);

    //aqui se va a consultar detalle (parcialidades) por cuenta
    this.servicios.obtenerParcialidadesPorIdPesaje(this.idPesaje).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.parcialidades = resp;
    })

    this.usuarioActual = sessionStorage.getItem("usuarioActual");


    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

  }


  regresar(){
    location.href = 'bandeja-principal'
  }

  formatoFecha( fecha: Date){
    if (fecha == null){
      return null;
    }
    let f2 = (fecha.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }

}
