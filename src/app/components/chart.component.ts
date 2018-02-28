import { Component, Input, OnInit, ViewEncapsulation /*ElementRef, ViewChild*/ } from '@angular/core';
/*import { Router, ActivatedRoute } from '@angular/router';
import { animate, keyframes, trigger, transition, style, state } from '@angular/animations';*/
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'chart-cmp',
  template: `
    <div class="chart" [id]="chartid">
    </div>
  `,
  styles: [`
    .axis path,
    .axis line,
    .axis text {
      stroke-width: 1px;
      font-size: 8pt;
    }
    .data-point {
      fill: #4caf50;
    }
    .data-line {
      stroke: black;
    }
    .hover-g {
      fill-opacity: 0;
      stroke-opacity: 0;
    }
    .hover-bar {
      fill: var(--color-gray-dark);
      stroke: var(--color-gray-dark);
    }
    .hover-value-rect {
      fill: var(--color-gray-dark);
    }
    .hover-value {
      fill: black;
      font: 10pt mono;
    }
    .hover-g:hover .hover-bar,
    .hover-g:hover .hover-value-rect {
      stroke-opacity: 0.75;
      fill-opacity: 0.25;
    }
    .hover-g:hover .hover-value {
      fill-opacity: 1;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})

export class ChartComponent implements OnInit {
  @Input() data: Array<any>
  @Input() chartid: string = 'default'
  @Input() user_settings
  settings = {
    width: 800,
    height: 225,
    margin: 30,
    radius: 3,
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
        this.x_labels.push(v.due_date)
      })
      this.drawChart()
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

  drawChart(): void {
    this.drawAxis()
    this.drawLines()
    this.drawPoints()
    this.addHoverBar()
  }

  drawPoints(): void {
    this.svg.append('g').selectAll('circle')
      .data(this.values).enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('r', this.settings.radius)
        .attr('cx', (d,i) => this.scales.x(this.x_labels[i]) + this.scales.x.step() / 2)
        .attr('cy', (d) => this.scales.y(d))
  }

  drawLines(): void {
    this.svg.append('g').selectAll('line')
      .data(this.values.slice(0, this.values.length - 1)).enter()
        .append('line')
        .attr('class', 'data-line')
        .attr('x1', (d,i) => this.scales.x(this.x_labels[i]) + this.scales.x.step() / 2)
        .attr('y1', (d) => this.scales.y(d))
        .attr('x2', (d,i) => this.scales.x(this.x_labels[i+1]) + this.scales.x.step() / 2)
        .attr('y2', (d,i) => this.scales.y(this.values[i+1]))
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
      .attr('class', 'x-axis axis')
      .call(x_axis)
    this.svg.append('g')
      .attr('class', 'y-axis axis')
      .call(y_axis)
  }

  addHoverBar(): void {
    let g = this.svg.append('g').selectAll('g')
      .data(this.values).enter()
        .append('g')
          .attr('class', 'hover-g')
    // highlight bar over the height of the point.
    g.append('rect')
      .attr('class', 'hover-bar')
      .attr('x', (d,i) => this.scales.x(this.x_labels[i]) + this.scales.x.step() / 2 - 10)
      .attr('y', (d) => this.scales.y(d) - 10)
      .attr('width', 20)
      .attr('height', (d,i) => (this.settings.height - this.settings.margin) - this.scales.y(d) + 10)
    // box to 'contain' the y-value of the point
    g.append('rect')
      .attr('class', 'hover-value-rect')
      .attr('x', (d,i) => {
        let x = this.scales.x(this.x_labels[i]) + (this.scales.x.step() / 2)
        return x - ((d.toString().length * 10 + 10) + 15)
      })
      .attr('y', (d) => (this.settings.height - this.settings.margin) / 2)
      .attr('width', (d) => d.toString().length * 10 + 10)
      .attr('height', 20)
    // y-value of the point.
    g.append('text')
      .attr('class', 'hover-value')
      .attr('x', (d,i) => {
        let x = this.scales.x(this.x_labels[i]) + (this.scales.x.step() / 2)
        return x - ((d.toString().length * 10) + 5 + 15)
      })
      .attr('y', (d) => ((this.settings.height - this.settings.margin) / 2) + 15)// this.scales.y(d) - 20)
      .text((d) => '$' + d)
  }
}
