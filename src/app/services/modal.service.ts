import { Injectable } from '@angular/core';
import { DomService } from './dom.service';

@Injectable()
export class ModalService {

  private modalElementId = 'modal-container';
  private overlayElementId = 'modal-overlay';

  constructor(
    private domService: DomService
  ) {}

  init(cmp: any, inputs: object, outputs: object): any {
    let cmpConfig = {
      inputs: inputs,
      outputs: outputs,
    };
    let c = this.domService.appendComponentTo(this.modalElementId, cmp, cmpConfig);
    document.getElementById(this.modalElementId).classList.add('show');
    document.getElementById(this.overlayElementId).classList.add('show');
    let pos = this.setPosition();
    document.getElementById(this.modalElementId).style.top = pos.top;
    document.getElementById(this.modalElementId).style.left = pos.left;
    return c;
  }
  
  setPosition(): any {
    let m = document.getElementById(this.modalElementId);
    let o = document.getElementById(this.overlayElementId);
    return {
      //top: `${(o.offsetHeight / 2) - (m.offsetHeight / 2)}px`,
      top: '100px',
      left: `${(o.offsetWidth / 2) - (m.offsetWidth / 2)}px`,
    };
  }

  destroy(): void {
    this.domService.removeComponent();
    document.getElementById(this.modalElementId).classList.remove('show');
    document.getElementById(this.overlayElementId).classList.remove('show');
  }
}
