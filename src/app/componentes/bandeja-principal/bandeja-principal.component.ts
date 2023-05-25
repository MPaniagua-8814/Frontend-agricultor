import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bandeja-principal',
  templateUrl: './bandeja-principal.component.html',
  styleUrls: ['./bandeja-principal.component.scss']
})
export class BandejaPrincipalComponent implements OnInit {

  title = 'Bandeja Principal'
  pesajes: any = []
  transportes: any = []
  transportistas: any = []
  tabMostrar = '';
  tab1 = true;
  tab2 = false;
  tab3 = false;
  nitAgricultor: any;
  cuentas: any = [];
  usuarioActual: any;
  placaValida = false;
  nombreValido = false;
  minDate: any

  catalogoMedidas: any = []

  public formDatosPesaje = new FormGroup({
    // idEstado: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    estado: new FormControl(null),
    peso: new FormControl(null/*, [Validators.required]*/),
    medida: new FormControl(null, [Validators.required, Validators.maxLength(2)]), //codigo peso 

    // tipoMercancia: new FormControl(null, Validators.required)
  });

  public formDatosTransporte = new FormGroup({
    tipo: new FormControl(null, [Validators.required]),
    placa: new FormControl(null, [Validators.required]),
    marca: new FormControl(null, [Validators.required]),
    color: new FormControl(null, [Validators.required]),
    modelo: new FormControl(null, [Validators.required, Validators.min(1980), Validators.max(new Date().getFullYear())]),
    linea: new FormControl(null, [Validators.required]),
  });

  public formDatosTransportista = new FormGroup({
    cui: new FormControl(null, [Validators.required, Validators.min(1000000000000), Validators.max(9999999999999)]),
    // idTransporte: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
    nombre: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(null, [Validators.required]),
    tipoLicencia: new FormControl(null, [Validators.required]),
    fechaLicencia: new FormControl(null, [Validators.required]),

  });

  constructor(private servicios: ServiciosAgricultor, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.nitAgricultor = sessionStorage.getItem('nitAgricultor')
    this.obtenerCuentas()

    //aqui se va a consultar pesajes por agricultor
    this.servicios.obtenerPesajesPorNit(this.nitAgricultor).subscribe(resp => {
      console.log("Respuesta ==== ", resp)
      this.pesajes = resp;
    })

    this.obtenerTransportes()
    this.obtenerTransportistas()

    this.servicios.obtenerCatalogoMedidas(2).subscribe(
      resp => {
        console.log("medidas", resp)
        this.catalogoMedidas = resp;
        return resp;
      }
    );

    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    // this.usuarioActual = 'localhost' //sessionStorage.getItem('usuarioActual')
    this.usuarioActual = sessionStorage.getItem("usuarioActual")

    console.log("usuarioActual === ", this.usuarioActual)

    let año = new Date().getFullYear() - 18;
    let fecha = new Date().setFullYear(año);
    this.minDate = new Date(fecha)
  }

  mostrar(tab: string) {
    let a = document.getElementById("home-tab")?.className;
    let b = document.getElementById("profile-tab")?.className;
    let c = document.getElementById("contact-tab")?.className;

    if (tab == 'home') {
      console.log("tab 1")
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;

      a += " active";
      b = document.getElementById("profile-tab")?.className.replace(/(?:^|\s)active(?!\S)/g, '')
      c = document.getElementById("contact-tab")?.className.replace(/(?:^|\s)active(?!\S)/g, '')

    }
    else if (tab == 'profile-tab') {
      console.log("tab 2")
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;

      b += " active";
      a = document.getElementById("profile-tab")?.className.replace(/(?:^|\s)active(?!\S)/g, '')
      c = document.getElementById("contact-tab")?.className.replace(/(?:^|\s)active(?!\S)/g, '')

    }
    else if (tab == 'contact-tab') {
      console.log("tab 3")
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;

      c += " active";
      a = document.getElementById("profile-tab")?.className.replace(/(?:^|\s)active(?!\S)/g, '')
      b = document.getElementById("contact-tab")?.className.replace(/(?:^|\s)active(?!\S)/g, '')

    }

  }

  crearPesaje() {

    let data = {
      "nitAgricultor": this.nitAgricultor,
      "usuarioAgrego": this.usuarioActual,
      "codigoPeso": this.formDatosPesaje.controls.medida.value
    }

    console.log("data de crear pesaje == ", data)

    this.servicios.crearPesaje(data);
    this.mensajeExito()
  }

  formValid() {
    return this.formDatosPesaje.valid
  }

  formValidTransporte() {
    return (this.formDatosTransporte.valid && this.placaValida)
  }

  formValidTransportista() {
    return (this.formDatosTransportista.valid && this.nombreValido)
  }

  mensajeExito() {
    Swal.fire({
      //title: "La parcialidad se ha creado con éxito.",
      title: "El pesaje se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
      // location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje
    });
    //location.href = environment.RUTA_BASE + 'bandeja-solicitudes';
  }

  obtenerCantidadParcialidades(idCuenta: number) {
    console.log("id Cuenta enviado === ", idCuenta)
    //let parcialidades = //this.servicios.obtenerParcialidadesPorIdPesaje(idCuenta).subscribe
    let parcialidades;
    console.log("parcialidades = ", parcialidades)
    //return parcialidades.length
    //return parcialidades
  }

  formatoFecha(fecha: Date) {
    if (fecha == null) return null;
    let f2 = (fecha?.toString().split('T'))[0].split('-');
    return (f2[2] + '-' + f2[1] + '-' + f2[0])
  }

  fechaActual() {
    let date = new Date().toISOString()
    let f2 = (date.toString().split('T'))[0].split('-');
    return (f2[2] + '-' + f2[1] + '-' + f2[0])
  }

  //ya no se va a usar
  contarParcialidades(idCuenta: number) {
    let parcialidades = this.servicios.obtenerParcialidadesPorIdPesaje(idCuenta).subscribe;
    return parcialidades.length
  }

  obtenerEstado(idCuenta: number) {
    let nombreEstado = [];
    nombreEstado = this.cuentas.filter((data: any) => {
      if (data.idCuenta == idCuenta) {
        return data.idEstado.nombre
      }
    })
    //console.log("que hay === " , nombreEstado[0].idEstado.nombre)
    return nombreEstado[0]?.idEstado.nombre
  }

  crearTransporte() {

    let data;
    let insertar: boolean = true;
    let placaTemp = this.formDatosTransporte.controls.tipo.value + '-' + (this.formDatosTransporte.controls.placa.value).toUpperCase()

    data = {
      "placa": placaTemp,
      "marca": this.formDatosTransporte.controls.marca.value,
      "color": this.formDatosTransporte.controls.color.value,
      "modelo": this.formDatosTransporte.controls.modelo.value,
      "nitAgricultor": this.nitAgricultor,
      "usuarioAgrego": this.usuarioActual,
      "linea": this.formDatosTransporte.controls.linea.value
    }

    let temp: any = this.transportes;
    temp.filter((data: any) => {
      if (data.placa == placaTemp) {
        console.log("que hay en data coincide", data)
        this.mensajeErrorPK("Ya existe un transporte registrado con la placa " + placaTemp)
        // return null;
        insertar = false;
      }
    })

    if (insertar) {
      this.servicios.crearTransporte(data).toPromise().then(
        data => {
        }
      ).catch(err => {
        console.log("entra al error ===== ", err.status)
        console.log("entra al error ===== ", err)
        if (err.status == 200 || err.status == 201) {
          this.mensajeExitoTransporte()
        }
        else {
          this.mostrarMensajeError(err.error)
        }
      });
    }
  }


  mensajeExitoTransporte() {
    Swal.fire({
      title: "El transporte se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }


  mensajeErrorPK(texto: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
    })
  }

  obtenerTransportes() {
    let consulta: any = this.servicios.obtenerTransportes().subscribe(
      resp => {
        console.log("transportes", resp)
        this.transportes = resp;
        return resp;
      }
    );
  }

  obtenerTransportistas() {
    let consulta: any = this.servicios.obtenerTransportistas().subscribe(
      resp => {
        console.log("transportistas", resp)
        this.transportistas = resp;
        return resp;
      }
    );
  }

  estado(dato: any) {
    if (dato) {
      return "Activo"
    }
    else {
      return "Inactivo"
    }
  }

  disponible(dato: any) {
    if (dato) {
      return "Disponible"
    }
    else {
      return "No Disponible"
    }
  }


  crearTransportista() {

    let form = this.formDatosTransportista.controls
    let insertar = true;
    // console.log("fecha === ", form.fechaNacimiento.value)
    let data = {
      "idTransportista": Number(form.cui.value),
      // "idTransporte": form.idTransporte.value,
      "nombre": form.nombre.value,
      "fechaNacimiento": form.fechaNacimiento.value,
      "tipoLicencia": (form.tipoLicencia.value).toUpperCase(),
      "fechaLicencia": form.fechaLicencia.value,
      "nitAgricultor": this.nitAgricultor,
      "usuarioAgrego": this.usuarioActual
    }
    
    let año = new Date().getFullYear() - 18;
    let fecha = new Date().setFullYear(año);
    let fechaMinima = new Date(fecha)
    
    let temp: any = this.transportistas;
    temp.filter((data: any) => {
      if (data.idTransportista == form.cui.value) {
        console.log("que hay en data coincide", data)
        this.mensajeErrorPK("Ya existe un transportista registrado con el CUI " + form.cui.value)
        insertar = false;
      }
    })

    console.log("es mayor de edad?  " , new Date(form.fechaNacimiento.value) < fechaMinima)
    if( new Date(form.fechaNacimiento.value) > fechaMinima ){
      this.mensajeErrorPK("El transportista es menor de edad")
      insertar = false;
    }

if(insertar){

  this.servicios.crearTransportista(data).toPromise().then(
    data => {
      console.log("data ==== ", data)
      // this.mensajeExito()
    }
  ).catch(err => {
    console.log("entra al error ===== ", err.status)
    if (err.status == 200 || err.status == 201) {
      this.mensajeExitoTransportista()
      // this.mensajeExito()
    }
    else {
      this.mostrarMensajeError(err.error)
    }
  });
}
  }

  mostrarMensajeError(texto: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
    })
  }

  mensajeExitoTransportista() {
    Swal.fire({
      title: "El transportista se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }


  obtenerCuentas() {
    console.log("nit en obtener cuentas ==== ", this.nitAgricultor)
    this.servicios.obtenerCuentasBeneficio(this.nitAgricultor).subscribe(
      resp => {
        console.log("cuentas", resp)
        this.cuentas = resp;
        return resp;
      }
    );

  }

  exprPlaca(event: any) {
    let placa = event.target.value
    let expr = /^[0-9]{3}([A-Z]|[a-z]){3}$/
    // let expr = /^(P|C|p|c)[0-9]{3}([A-Z]|[a-z]){3}$/
    console.log("resultado  ==== ", expr.test(placa))
    this.placaValida = expr.test(placa);
    return expr.test(placa);

  }

  exprNombre(event: any) {
    let nombre = event.target.value
    let expr = /^(([A-Z]|[a-z]){3,} ([A-Z]|[a-z]){3,}( *|([A-Z]|[a-z])*)*)$/
    // let expr = /^(P|C|p|c)[0-9]{3}([A-Z]|[a-z]){3}$/
    console.log("resultado  ==== ", expr.test(nombre))
    this.nombreValido = expr.test(nombre);
    return expr.test(nombre);

  }


}
