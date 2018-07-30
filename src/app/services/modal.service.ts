import { Injectable } from '@angular/core';
import { DomService } from './dom.service';

@Injectable()
export class ModalService {

  private modalElementId = 'modal-container';
  private overlayElementId = 'modal-overlay';

  constructor(
    private domService: DomService
  ) {}

  init(cmp: any, inputs: object, outputs: object): void {
    let cmpConfig = {
      inputs: inputs,
      outputs: outputs,
    };
    this.domService.appendComponentTo(this.modalElementId, cmp, cmpConfig);
    document.getElementById(this.modalElementId).classList.add('show');
    document.getElementById(this.overlayElementId).classList.add('show');
  }

  destroy(): void {
    this.domService.removeComponent();
    document.getElementById(this.modalElementId).classList.remove('show');
    document.getElementById(this.overlayElementId).classList.remove('show');
  }
}
