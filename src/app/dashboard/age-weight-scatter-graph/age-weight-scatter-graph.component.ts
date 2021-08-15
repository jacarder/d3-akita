import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { FriendQuery } from 'src/app/friend/state/friend.query';
import { FriendService } from 'src/app/friend/state/friend.service';

@Component({
  selector: 'age-weight-scatter-graph',
  templateUrl: './age-weight-scatter-graph.component.html',
  styleUrls: ['./age-weight-scatter-graph.component.scss']
})
export class AgeWeightScatterGraphComponent implements OnInit, OnDestroy, AfterViewInit {
  // set the dimensions and margins of the graph
  private readonly margin = {top: 10, right: 30, bottom: 30, left: 60};
  private readonly width = 460 - this.margin.left - this.margin.right;
  private readonly height = 400 - this.margin.top - this.margin.bottom;
  private subscriptions = new Subscription();
  loading$ = this.friendQuery.selectLoading();
  friends$ = this.friendQuery.selectAll();

  constructor(
    private friendQuery: FriendQuery,
    private friendService: FriendService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.friendService.get().subscribe()
    )    
  }

  ngAfterViewInit() {
    let svg = this.createSVG();
    this.drawGraph(svg);
  }

  createSVG = (): d3.Selection<SVGGElement, unknown, HTMLElement, any> => {
    // append the svg object to the body of the page
    const svg = d3.select("#age_weight_graph")
    .append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    return svg;
  }

  drawGraph = (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) => {
    this.subscriptions.add(
      this.friends$.subscribe(
        (friends) => {
          // Add X axis
          const x = d3.scaleLinear()
          .domain([0, 120])
          .range([ 0, this.width ]);
          svg.append("g")
          .attr("transform", `translate(0, ${this.height})`)
          .call(d3.axisBottom(x));
  
          // Add Y axis
          const y = d3.scaleLinear()
          .domain([0, 600])
          .range([ this.height, 0]);
          svg.append("g")
          .call(d3.axisLeft(y));
  
          // Add X axis label:
          svg.append("text")
              .attr("text-anchor", "end")
              .attr("x", this.width/2 + this.margin.left)
              .attr("y", this.height + this.margin.top + 20)
              .text("Friends Age");
  
          // Y axis label:
          svg.append("text")
              .attr("text-anchor", "end")
              .attr("transform", "rotate(-90)")
              .attr("y", -this.margin.left + 20)
              .attr("x", -this.margin.top - this.height/2 + 20)
              .text("Friends Weight")
  
          // Add dots
          svg.append('g')
          .selectAll("dot")
          .data(friends)
          .join("circle")
              .attr("cx", function (f) { return x(f.age); } )
              .attr("cy", function (f) { return y(f.weight); } )
              .attr("r", 1.5)
              .style("fill", "#69b3a2");
        }
      )    
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
