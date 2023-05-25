import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService, private http: HttpClient) {}

  private apiUrl = 'https://beneficio-cafetito-ws.herokuapp.com'; // Reemplaza con la URL de tu backend


//   public isAuthenticated(): boolean {
//     const token = localStorage.getItem('token');
//     return !this.jwtHelper.isTokenExpired(token);
//   }

login(credentials: any) {

    // return this.http.post<any>(`${this.apiUrl}/api/auth/signin`, credentials);
    return this.http.post<any>(`${this.apiUrl}/api/auth/signin`, credentials);
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
    console.log("se agregó a la sesión ==== " , token)
  }

  getToken() {
    // return sessionStorage.getItem('token');
    //tengo que settear la propiedad accessToken de la respuesta del post
    return sessionStorage.getItem('token');
  }

  removeToken() {
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Aquí puedes utilizar una biblioteca como jwt-decode para decodificar el token y verificar su validez
    // por ejemplo, puedes comprobar la fecha de expiración (exp) del token
    // return !jwtHelper.isTokenExpired(token);
    return token !== null;
  }


}
