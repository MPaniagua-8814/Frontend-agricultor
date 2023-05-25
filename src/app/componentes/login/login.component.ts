import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLogin = new FormGroup({
    user: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  acceder(){
    //location.href = environment.base + 'bandeja-principal'
    location.href = 'bandeja-principal'
    //this.router.navigate(['mantenimiento-usuarios']);
  }

  autenticar(){
    const credentials = 
    { 
      username: this.formLogin.controls.user.value, 
      password: this.formLogin.controls.password.value
    };
    console.log("datos === " , credentials)
    this.authService.login(credentials)
      .subscribe(
        (response) => {
          // Manejar la respuesta del servidor después de iniciar sesión
          console.log("que hay aqui ==== ", response)

          const token = response.accessToken;
          this.authService.setToken(token);
          sessionStorage.setItem("usuarioActual", response.username)
          location.href='bandeja-principal'
        },
        (error) => {
          // Manejar el error de inicio de sesión
          this.mensajeError();
          console.log("error al autenticar === " , error)
        }
      );


  }

  logout() {
    this.authService.removeToken();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();

    //colocar un if para ver si autenticó, para que deje pasar

  }

  formValid(){
    return this.formLogin.valid
  }

  mensajeError(){
    Swal.fire({
      title: "Error al autenticar",
      icon: 'error',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
    }).then((result) => {
      location.reload()
    });
  }
}
