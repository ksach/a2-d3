import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular (2) and d3';
  numSalespeople = 5;
  showAdd = true;
  showRemove = true;
  dataPool = [
    {salesperson: 'Bob', sales: 33},
    {salesperson: 'Robin', sales: 12},
    {salesperson: 'Anne', sales: 41},
    {salesperson: 'Mark', sales: 16},
    {salesperson: 'Joe', sales: 59},
    {salesperson: 'Eve', sales: 38},
    {salesperson: 'Karen', sales: 21},
    {salesperson: 'Kirsty', sales: 25},
    {salesperson: 'Chris', sales: 30},
    {salesperson: 'Lisa', sales: 47},
    {salesperson: 'Tom', sales: 5},
    {salesperson: 'Stacy', sales: 20},
    {salesperson: 'Charles', sales: 13},
    {salesperson: 'Mary', sales: 29}
  ];
  maxSalespeople = this.dataPool.length;
  chartData = [];
  
  ngOnInit() {
    this.updateData();
  }

  updateData() {
    this.showAdd = this.numSalespeople < this.maxSalespeople;
    this.showRemove = this.numSalespeople > 0;
    this.chartData = this.dataPool.slice(0, this.numSalespeople);
  }

  addDataPoint() {
    this.numSalespeople++;
    this.updateData();
  }

  removeDataPoint() {
    this.numSalespeople--;
    this.updateData();
  }

  increaseSales = salesperson => {
    this.dataPool = this.dataPool.map(datum => {
      const newDatum = datum;
      if (datum.salesperson === salesperson) {
        newDatum.sales += 5;
      }
      return newDatum;
    });
    this.updateData();
  }
}
