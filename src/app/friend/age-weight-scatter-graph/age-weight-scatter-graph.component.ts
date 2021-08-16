import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { FriendQuery } from 'src/app/friend/state/friend.query';
import { FriendService } from 'src/app/friend/state/friend.service';
import { FriendValidation } from '../models/friend.validation';
import { Friend } from '../state/friend.model';

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
  private readonly defaultColor = '#69b3a2';
  private readonly defaultRadius = 2.5;
  private subscriptions = new Subscription();
  graphName = 'age_weight_graph'
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
          // Add X axis AGE
          const x = d3.scaleLinear()
          .domain([FriendValidation.MinMaxAge.MIN, FriendValidation.MinMaxAge.MAX])
          .range([ 0, this.width ]);
          svg.append("g")
          .attr("transform", `translate(0, ${this.height})`)
          .call(d3.axisBottom(x));
  
          // Add Y axis WEIGHT
          const y = d3.scaleLinear()
          .domain([FriendValidation.MinMaxWeight.MIN, FriendValidation.MinMaxWeight.MAX])
          .range([ this.height, 0]);
          svg.append("g")
          .call(d3.axisLeft(y));
  
          // Add X axis label:
          svg.append("text")
              .attr("text-anchor", "end")
              .attr("x", this.width/2 + this.margin.left)
              .attr("y", this.height + this.margin.top + 20)
              .text("Age (years)");
  
          // Y axis label:
          svg.append("text")
              .attr("text-anchor", "end")
              .attr("transform", "rotate(-90)")
              .attr("y", -this.margin.left + 20)
              .attr("x", -this.margin.top - this.height/2 + 20)
              .text("Weight (pounds)")

          //  Highlight related friends
          const highlight = (event: any,f: Friend) => {
            f.friendList.forEach(friend => {
              d3.selectAll("." + friend.id)
                .transition()
                .duration(200)
                .style("fill", 'red')
                .attr("r", 3)
            });
          }
          
          const doNotHighlight = (event: any,f: Friend) => {
            d3.selectAll(".dot")
              .transition()
              .duration(200)
              .style("fill", this.defaultColor )
              .attr("r", this.defaultRadius )
          }

          //  Add tooltip to display information
          const tooltip = d3.select(`#${this.graphName}`)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("position", "absolute")
  
          // Add dots
          svg.append('g')
          .selectAll("dot")
          .data(friends)
          .join("circle")
              .attr("class", function (f) { return "dot " + f.id } )
              .attr("cx", function (f) { return x(f.age); } )
              .attr("cy", function (f) { return y(f.weight); } )
              .attr("r", this.defaultRadius)
              .style("fill", this.defaultColor )
          .on("mouseover", (event, f: Friend) => {
            highlight(event, f);
            //  Show tooltip
            tooltip.style("opacity", 1);
          })
          .on("mousemove", (event, f: Friend) => {
            //  Move tool tip
            tooltip
              .html(
                `
                Name: ${f.name}<br>
                Age: ${f.age}<br>
                Weight: ${f.weight}<br>
                Friend Count: ${f.friendList.length}
                `
              )
              .style("left", (event.x)/2 + "px")
              .style("top", (event.y)/2 + "px")
          })
          .on("mouseleave", (event, f: Friend) => {
            doNotHighlight(event, f);
            //  Remove tooltip
            tooltip
              .transition()
              .duration(200)
              .style("opacity", 0)
          })
          // .on("mouseover", function(f: Friend) {
          //   var dotId = f.id

          //   var matches = svg.filter((f: Friend) => { 
          //      return f.friendList.some(nextFriend => nextFriend.id === dotId);
          //   })
          //   .style('stroke', 'black');
          // })
     
        }
      )    
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
