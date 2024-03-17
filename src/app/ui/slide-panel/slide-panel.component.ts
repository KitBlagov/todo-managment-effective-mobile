import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'slide-panel',
  standalone: true,
  imports: [],
  templateUrl: './slide-panel.component.html',
  styleUrl: './slide-panel.component.scss',
})
export class SlidePanelComponent {
  @Input() isOpen = false;
  @Input() headerText = 'Slide Panel Header';
}

