import {Component, ElementRef, HostListener} from '@angular/core';
import {ModalService} from '../../core/services/modal.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent  {

  public modalField = new FormControl('');

  constructor(public modalService: ModalService) {
  }

  onButton(btn: string): void {
    if (this.modalService.modals.length !== 0) {
      this.modalService.modals[0].callback(btn, this.modalField.value);
      this.modalService.remove(this.modalService.modals[0]);
    }
  }




}
