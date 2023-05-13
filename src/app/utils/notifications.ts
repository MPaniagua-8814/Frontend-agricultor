import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

declare var $: any;

@Injectable({
    providedIn: 'root'
})

export class GenericNotification {

    constructor() {}

    public showNotification(from: any, align: string, color: number, length: number, icon: string, message: string) {
        const type = ['', 'info', 'success', 'warning', 'danger'];

        $.notify({
            icon: `${icon}`,
            message: `${message}`
        }, {
            type: type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            },
            template: `<div data-notify="container" class="col-xl-${length} col-lg-${length} col-11 col-sm-${length} col-md-${length} alert alert-{0} alert-with-icon" role="alert">` +
              '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
              `<i class="material-icons" data-notify="icon">${icon}</i> ` +
              '<span data-notify="title">{1}</span> ' +
              '<span data-notify="message">{2}</span>' +
              '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
              '</div>' +
              '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
        });
    }

    /**
     * Mensajes de alerta para la interfaz grafica
     */
  public showAlert(type: any) {

    /* if (type === 'CargaExito') {

      swal({
        title: '¡Documento cargado satisfactoriamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-blue-sat'
      }).catch(swal.noop)

    } */


    if (type === 'envioExito') {

      /* swal({
        title: '¡Su solicitud se ha enviado exitosamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-blue-sat'
      }).catch(swal.noop) */

      Swal.fire({
        title: '¡Su solicitud se ha enviado exitosamente!',
        icon: 'success',
        confirmButtonColor: '#1369A0'
      });

    }

    if (type === 'enviando') {
      Swal.fire({
        title: 'Enviando solicitud, espere un momento por favor...',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

    if (type === 'error') {
      Swal.fire({
        title: 'Error. En este momento no se puede completar su gestión, intentelo más tarde.',
        icon: 'error',
        confirmButtonColor: '#1369A0'
      });
    }

      /* swal({
        title: 'Error. En este momento no se puede completar su gestión, intentelo más tarde.',
        text: '',
        type: 'error',
        confirmButtonClass: 'btn btn-blue-sat',
        buttonsStyling: false
      }).catch(swal.noop) */

/*
    if (type === 'CargaTamanioFallo') {

      swal({
        title: 'Error. Tamaño de archivo excede el máximo permitido de 10 Mb.',
        text: '',
        type: 'error',
        confirmButtonClass: 'btn btn-blue-sat',
        buttonsStyling: false
      }).catch(swal.noop)

    }

    if (type === 'envioFallido') {

      swal({
        title: 'Error. La solicitud no se ha podido enviar, intentalo más tarde.',
        text: '',
        type: 'error',
        confirmButtonClass: 'btn btn-blue-sat',
        buttonsStyling: false
      }).catch(swal.noop)

    }

    if (type === 'CargaFormatoFallo') {

      swal({
        title: 'Error. El formato de archivo no es permitido.',
        text: '',
        type: 'error',
        confirmButtonClass: 'btn btn-blue-sat',
        buttonsStyling: false
      }).catch(swal.noop)

    }

    if (type === 'eliminarArchivoResolucion') {

      swal({
        title: 'Eliminar',
        text: '¿Esta seguro de eliminar el documento?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        confirmButtonClass: 'btn btn-blue-sat',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.eliminarArchivo(this.archivoMercantil, this.fileDocMercantil);
          this.limpiaArchivo();
        } else {
          swal({
            title: 'Eliminación cancelada',
            text: '',
            type: 'error',
            confirmButtonClass: 'btn btn-blue-sat',
            buttonsStyling: false
          }).catch(swal.noop)

        }
      }
      );
    } */

  }
}
