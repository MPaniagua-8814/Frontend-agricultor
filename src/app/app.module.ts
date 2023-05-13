import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './componentes/login/login.component';
import { BandejaPrincipalComponent } from './componentes/bandeja-principal/bandeja-principal.component';
import { MaterialModule } from './utils/material-module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { HttpClient, HttpClientModule } from '@angular/common/http';
//servicios
import { ServiciosAgricultor } from './services/serviciosAgricultor.service';
import { DetallePesajeComponent } from './componentes/detalle-pesaje/detalle-pesaje.component';
import { CrearParcialidadComponent } from './componentes/crear-parcialidad/crear-parcialidad.component';

schemas: [CUSTOM_ELEMENTS_SCHEMA]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BandejaPrincipalComponent,
    DetallePesajeComponent,
    CrearParcialidadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MaterialModule,
    HttpClientModule,
    //HttpClient
    // MaterialModule
  ],
  providers: [
    ServiciosAgricultor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
