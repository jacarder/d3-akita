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
  private readonly width = 860 - this.margin.left - this.margin.right;
  private readonly height = 400 - this.margin.top - this.margin.bottom;
  private readonly defaultColor = 'black';
  private readonly defaultRadius = 4;
  private subscriptions = new Subscription();
  graphNameId = 'age_weight_graph'
  friendInfoId = 'friend_info'
  scatterPlotId = 'scatterplot'
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
    this.createGraph(svg);
  }

  createSVG = (): d3.Selection<SVGGElement, unknown, HTMLElement, any> => {
    // append the svg object to the body of the page
    const svg = d3.select(`#${this.graphNameId}`)
    .append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    return svg;
  }

  createGraph = (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) => {
    //  Highlight related friends
    const highlight = (event: any,f: Friend) => {
      f.friendList.forEach(friend => {
        d3.selectAll("." + friend.id)
          .transition()
          .duration(200)
          .style("fill", 'red')
      });
    }
    
    const doNotHighlight = (event: any,f: Friend) => {
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", this.defaultColor )
        .attr("r", this.defaultRadius )
    }

    //  TODO Find out the event type to add
    const brushended = (event: any) => {
        var s = event.selection;
        if (!s) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
            x.domain([FriendValidation.MinMaxWeight.MIN, FriendValidation.MinMaxWeight.MAX]);
            y.domain([FriendValidation.MinMaxAge.MIN, FriendValidation.MinMaxAge.MAX]);
        } else {
            x.domain([s[0][0], s[1][0]].map(x.invert, x));
            y.domain([s[1][1], s[0][1]].map(y.invert, y));
            scatter.select(".brush")
            .call(brush.move as any); // Remove brush from screen selection // TODO Typescript yelling if not any investigate more
        }
        zoom();
        return null
    }

    const idled = () => {
        idleTimeout = null;
    }

    const zoom = () => {
        svg.select("#axis--x").transition().duration(750).call(xAxis as any); //  TODO Typescript yelling if not any investigate more
        svg.select("#axis--y").transition().duration(750).call(yAxis as any); //  TODO Typescript yelling investigate more
        scatter.selectAll("circle").transition()
        .attr("cx", function (d: any) { return x(d.weight); }) // TODO some reason can't set d param as Friend
        .attr("cy", function (d: any) { return y(d.age); }) // TODO some reason can't set d param as Friend
    }    

    //  Add tooltip to display information
    const tooltip = d3.select(`#${this.friendInfoId}`)
      .style("opacity", 0)
      // .attr("class", "tooltip")
      // .style("background-color", "white")
      // .style("border", "solid")
      // .style("border-width", "1px")
      // .style("border-radius", "5px")
      // .style("padding", "10px")
      // .style("position", "absolute")

    let x = d3.scaleLinear().range([0, this.width])

    let y = d3.scaleLinear().range([this.height, 0]);

    let xAxis = d3.axisBottom(x).ticks(12),
        yAxis = d3.axisLeft(y).ticks(12 * this.height / this.width);

    let brush = d3.brush().extent([[0, 0], [this.width, this.height]]).on("end", brushended),
        idleTimeout: any | null,
        idleDelay = 350;

    const clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", this.width )
        .attr("height", this.height )
        .attr("x", 0) 
        .attr("y", 0); 

    x.domain([FriendValidation.MinMaxWeight.MIN, FriendValidation.MinMaxWeight.MAX]).range([ 0, this.width ]);
    y.domain([FriendValidation.MinMaxAge.MIN, FriendValidation.MinMaxAge.MAX]).range([ this.height, 0]);

    // x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr('id', "axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis);

    svg.append("text")
      .style("text-anchor", "end")
        .attr("x", this.width)
        .attr("y", this.height - 8)
      .text("Weight (Pounds)");

    // y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Age (Years)");    

    //  Create scatter plot container
    const scatter = svg.append("g")
          .attr("id", this.scatterPlotId)
          .attr("clip-path", "url(#clip)");
    //  Have brush before scattor plots so we can hover over them for tool tips
    scatter.append("g")
          .attr("class", "brush")
          .call(brush);
    //  Update scatterplot
    this.subscriptions.add(
      this.friends$.subscribe(
        (friends) => {
          scatter.selectAll(".dot")
              .data(friends)
              .join("circle")
              .attr("r", this.defaultRadius)
              .attr("class", function (f) { return "dot " + f.id } ) // ID created to highlight friends
              .attr("cx", function (d) { return x(d.weight); })
              .attr("cy", function (d) { return y(d.age); })
              .style("fill", this.defaultColor)
              
              .attr("pointer-events", "all")
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
                  //  Code to move tooltip with cursor (Need to remove scss to make this work)
                  // .style("left", (event.x)/2 + "px")
                  // .style("top", (event.y)/2 + "px")
              })
              .on("mouseleave", (event, f: Friend) => {
                doNotHighlight(event, f);
                //  Remove tooltip
                tooltip
                  .transition()
                  .duration(200)
                  .style("opacity", 0)
              })
        }
      )
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
