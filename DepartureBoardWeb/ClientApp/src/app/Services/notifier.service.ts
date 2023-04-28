import { Injectable } from '@angular/core';
import Swal, {SweetAlertIcon} from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor() { }

  notify(type: SweetAlertIcon, message: string) {
    return Swal.fire({
      title: message,
      icon: type
    });
  }
}
