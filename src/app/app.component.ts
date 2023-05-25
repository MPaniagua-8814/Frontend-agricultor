import { Router } from '@angular/router';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
//import { ServiciosAgricultor } from './services/serviciosAgricultor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'permisos-temporales-front';
  nitAgricultor: string = '';

  constructor(private servicios : ServiciosAgricultor,
    private router: Router, private authService : AuthService){
    sessionStorage.setItem('nitAgricultor', "99671395")
    // this.servicios.obtener().subscribe( resp => {
    //   console.log(resp)
    // })
  }

  ngOninit(){
    //location.href="login"
  }

  cerrarSesion(){
    this.authService.removeToken();
    this.router.navigate(['/login']);

  }

  mostrar(){
    if(this.router.url.includes("login")){
      return false
    }
      else{
        return true
      }
  }


}

