import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'bill-btn',
  template: `
    <div class="add-bill">
      <span>
        <button >{{ button_text }}</button>
      </span>
    </div>
  `,
  styles: [`
  `],
})

export class BillButton {
  @Input() button_text: string;
}
