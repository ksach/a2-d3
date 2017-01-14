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
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const nativeElement = this.chartElement.nativeElement;
    this.width = nativeElement.offsetWidth - margin.left - margin.right;
    this.height = nativeElement.offsetHeight - margin.top - margin.bottom;
    this.container = d3.select(nativeElement)
      .append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x = d3.scaleBand().range([0, this.width]).padding(0.1);
    this.y = d3.scaleLinear().range([this.height, 0]);
    
    this.xAxis = this.container.append("g")
      .attr("transform", "translate(0," + this.height + ")");

    this.yAxis = this.container.append("g")
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
