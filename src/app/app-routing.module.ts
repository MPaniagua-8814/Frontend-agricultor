import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { BandejaPrincipalComponent } from './componentes/bandeja-principal/bandeja-principal.component';
import { DetallePesajeComponent } from './componentes/detalle-pesaje/detalle-pesaje.component';
import { CrearParcialidadComponent } from './componentes/crear-parcialidad/crear-parcialidad.component';

const routes: Routes = [

{
  path: '',
  component: LoginComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'bandeja-principal',
  component: BandejaPrincipalComponent
},
{
  path: 'bandeja-principal/detalle-pesaje/:idPesaje/:idCuenta/:medida',
  component: DetallePesajeComponent
},
{
  path: 'bandeja-principal/detalle-pesaje/:idPesaje/:idCuenta/:medida/crearParcialidad',
  component: CrearParcialidadComponent
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
