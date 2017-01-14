import { Component, Input, Output, EventEmitter,
    OnInit, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') chartElement;
  @Input() chartData: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  container: any;
  svg: any;
  margin = {top: 20, right: 20, bottom: 30, left: 40};
  width: number;
  height: number;
  initialized: boolean = false;
  x: any;
  y: any;
  xAxis: any;
  yAxis: any;

  constructor() { }

  ngOnInit() {
    this.initializeChart();
    this.renderChart();
    this.initialized = true;
  }

  ngOnChanges() {
    if (!this.initialized) {
      return;
    }
    this.renderChart();
  }

  initializeChart() {
    this.svg = d3.select(this.chartElement.nativeElement).append('svg');
    this.container = this.svg.append('g');

    this.x = d3.scaleBand().padding(0.1);
    this.y = d3.scaleLinear();
    
    this.xAxis = this.container.append("g");
    this.yAxis = this.container.append("g");
    
    this.resize();
  }

  resize() {
    this.width = this.chartElement.nativeElement.offsetWidth
      - this.margin.left - this.margin.right;
    this.height = this.chartElement.nativeElement.offsetHeight
      - this.margin.top - this.margin.bottom;
    
    this.svg.attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
    this.container.attr('transform', 
      'translate(' + this.margin.left + ',' + this.margin.top + ')')
   
    this.x.range([0, this.width]);
    this.y.range([this.height, 0]);
    this.xAxis.attr("transform", "translate(0," + this.height + ")");
   
    this.renderChart();
 }

  renderChart() {
    this.x.domain(this.chartData.map(datum => datum.salesperson));
    this.y.domain([0, Math.max(...this.chartData.map(datum => datum.sales))]);
    this.xAxis.transition().duration(400).call(d3.axisBottom(this.x));
    this.yAxis.transition().duration(400).call(d3.axisLeft(this.y));

    const bars = this.container.selectAll('.bar')
      .data(this.chartData, d => d.salesperson);
    
    bars.exit().remove();

    bars.enter().append('rect')
      .attr('class', 'bar')
      .style('fill', 'steelblue')
      .style('cursor', 'pointer')
      .attr('x', d => this.x(d.salesperson))
      .attr('width', this.x.bandwidth())
      .attr('y', this.height)
      .on('click', this.onBarClick)
    
    this.container.selectAll('.bar')
      .transition()
      .duration(400)
      .attr('x', d => this.x(d.salesperson))
      .attr('width', this.x.bandwidth())
      .attr('y', d => this.y(d.sales))
      .attr('height', d => this.height - this.y(d.sales));
  }

  onBarClick = d => {
    this.onClick.emit(d.salesperson);
  }

}
