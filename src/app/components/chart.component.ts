import { Component, Input, OnInit, /*ElementRef, ViewChild*/ } from '@angular/core';
/*import { Router, ActivatedRoute } from '@angular/router';
import { animate, keyframes, trigger, transition, style, state } from '@angular/animations';*/
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'chart-cmp',
  template: `
    <div class="chart">
      <div id="testid">
      </div>
    </div>
  `,
  styles: [],
})

export class ChartComponent implements OnInit {
  @Input() data: Array<any>
  @Input() chartid: string

  constructor() {
  }

  ngOnInit(): void {
    this.createSVG()
  }

  createSVG(): void {
    let d = d3.select(`#${this.chartid}`)
      .append('svg')
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("x", 0)
        .attr("y", 0)
        .attr("viewBox", `0 0 ${600} ${300}`)
        .attr("preserveAspectRatio", "none")
      .append("rect")
        .attr('transform', 'translate(30px, 30px')
        .attr('fill', 'blue')
        .attr('width', '50px')
        .attr('height', '50px')
  }
}
