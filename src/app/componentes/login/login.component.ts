import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  acceder(){
    //location.href = environment.base + 'bandeja-principal'
    location.href = 'bandeja-principal'
    //this.router.navigate(['mantenimiento-usuarios']);
  }
}
