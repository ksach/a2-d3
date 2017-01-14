# A2-D3

This is a demonstration of how to integrate [D3.js](https://d3js.org/) with [Angular 2](https://angular.io/)

### Demo: [https://a2-d3.herokuapp.com/](https://a2-d3.herokuapp.com/)

## Overview
This app demonstrates an approach to integrating D3 with Angular. The goal was to make a purely ["presentational"](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.j8sz51nbm) D3 component, in that its state relies only on its inputs and any interaction is handled by its outputs. In addition it employs both D3's [general update pattern](https://bl.ocks.org/mbostock/3808218) as well as Angular's [onPush](https://angular.io/docs/ts/latest/api/core/index/ChangeDetectionStrategy-enum.html) change detection to take advantage of D3 transitions and use minimal change detection.

The component is a simple bar chart based on [this](https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4) example, where the following interaction has been added:
1. clicking a bar will increase its value;
2. clicking the 'Add Salesperson' button will add a data point.

## Code Description 
The chart component (/src/app/chart/chart.component.ts) takes a data set as input, and reacts to a change of this data set by implementing OnChanges.
```javascript
ngOnChanges() {
  if (!this.initialized) {
	return;
  }
  this.renderChart();
}
```
In renderChart() D3's general update pattern is used to add new data points while leaving existing points as is
```javascript
const bars = this.container.selectAll('.bar')
            .data(this.chartData, d => d.salesperson);

bars.exit().remove();

bars.enter().append('rect')
.attr('class', 'bar')
...
```
The click event in d3 emits an event via the component's outputs
```javascript
@Output() onClick: EventEmitter<any> = new EventEmitter();
bars.enter().append('rect').on('click', this.onBarClick);
onBarClick = d => {
  this.onClick.emit(d.salesperson);
}
```
In the app component template (/src/app/app.component.html) the chart component is included simply as:
```html
<app-chart [chartData]="chartData" (onClick)="increaseSales($event)"></app-chart>
```
and in the app component (/src/app/app.component.ts) the input chart data is updated (without mutation)
```javascript
increaseSales = salesperson => {
  this.chartData = this.chartData.map(datum => {
    const newDatum = datum;
    if (datum.salesperson === salesperson) {
      newDatum.sales += 5;
    }
    return newDatum;
  });
}
```
That's it. The component will update efficiently when the input changes.