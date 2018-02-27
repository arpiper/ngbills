import { Component, Input, OnInit, /*ElementRef, ViewChild*/ } from '@angular/core';
/*import { Router, ActivatedRoute } from '@angular/router';
import { animate, keyframes, trigger, transition, style, state } from '@angular/animations';*/
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'chart-cmp',
  template: `
    <div class="chart">
      <div [id]="chartid">
      </div>
    </div>
  `,
  styles: [`
    .chart x-axis,
    .chart y-axis {
      stroke=width: 1px;
    }
  `],
})

export class ChartComponent implements OnInit {
  @Input() data: Array<any>
  @Input() chartid: string = 'default'
  @Input() user_settings
  settings = {
    width: 600,
    height: 150,
    margin: 30,
    radius: 2,
  }
  values: number[] = []
  x_labels: string[] = []
  y_labels: string[] = []
  scales = {
    x: undefined,
    y: undefined,
  }
  svg

  constructor() {
  }

  ngOnInit(): void {
    if (this.user_settings) {
      console.log('uesr-settins',this.user_settings)
    }
  }

  ngOnChanges(): void {
    if (this.data) {
      this.data.forEach((v,i) => {
        this.values.push(v.amount)
        this.x_labels.push(v.due_date.split('/')[0])
      })
      this.drawAxis()
      this.drawPoints()
    }
  }

  ngAfterViewInit(): void {
    this.createSVG()
  }

  createSVG(): void {
    this.svg = d3.select(`#${this.chartid}`)
      .append('svg')
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("x", 0)
        .attr("y", 0)
        .attr("viewBox", `0 0 ${this.settings.width} ${this.settings.height}`)
        .attr("preserveAspectRatio", "none")
      .append("g")
        .attr('transform', `translate(${this.settings.margin}, 0)`)
  }

  drawPoints(): void {
    this.svg.append('g').selectAll('circle')
      .data(this.values).enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('r', this.settings.radius)
        .attr('cx', (d, i) => {
          console.log(this.scales.x)
          console.log(this.scales.x(d))
          console.log(this.scales.x.step())
          return this.scales.x.step() / 2
        })
        .attr('cy', (d) => this.scales.y(d))
        .attr('fill', 'black')
  }

  drawAxis(): void {
    this.scales.x = d3.scaleBand().domain(this.x_labels)
      .range([0, (this.settings.width - 2 * this.settings.margin)])
    this.scales.y = d3.scaleLinear().domain([0, (d3.max(this.values) * 1.1)]) // multiply by 1.1 for 10% of padding above largest value.
      .range([(this.settings.height - this.settings.margin), 0])

    let x_axis = d3.axisBottom(this.scales.x)
      .ticks(this.x_labels.length)
    let y_axis = d3.axisLeft(this.scales.y)
      .ticks(5)
    this.svg.append('g')
      .attr('transform', `translate(0, ${this.settings.height - this.settings.margin})`)
      .attr('class', 'x-axis')
      .call(x_axis)
    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(y_axis)
  }
}
