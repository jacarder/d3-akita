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
  private readonly defaultRadius = 4;
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

          var data = friends;
  
          //  Highlight related friends
          const highlight = (event: any,f: Friend) => {
            f.friendList.forEach(friend => {
              d3.selectAll("." + friend.id)
                .transition()
                .duration(200)
                .style("fill", 'red')
                //.attr("r", 3)
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
  
          var x = d3.scaleLinear()          
                .range([0, this.width])
                //.nice();
  
          var y = d3.scaleLinear()
              .range([this.height, 0]);
  
          var xAxis = d3.axisBottom(x).ticks(12),
              yAxis = d3.axisLeft(y).ticks(12 * this.height / this.width);
  
          var brush = d3.brush().extent([[0, 0], [this.width, this.height]]).on("end", brushended),
              idleTimeout: any | null,
              idleDelay = 350;
  
          var clip = svg.append("defs").append("svg:clipPath")
              .attr("id", "clip")
              .append("svg:rect")
              .attr("width", this.width )
              .attr("height", this.height )
              .attr("x", 0) 
              .attr("y", 0); 
  
          // var xExtent = d3.extent(data, function (d) { return 120; }) as [number, number];
          // var yExtent = d3.extent(data, function (d) { return 1000; }) as [number, number];
           x.domain([FriendValidation.MinMaxAge.MIN, FriendValidation.MinMaxAge.MAX]).range([ 0, this.width ]);
           y.domain([FriendValidation.MinMaxWeight.MIN, FriendValidation.MinMaxWeight.MAX]).range([ this.height, 0]);
  
          var scatter = svg.append("g")
               .attr("id", "scatterplot")
               .attr("clip-path", "url(#clip)");
          //  Select
          scatter.selectAll(".dot")
              .data(data)
              .enter().append("circle")
              .attr("r", this.defaultRadius)
              .attr("class", function (f) { return "dot " + f.id } ) // ID created to highlight friends
              .attr("cx", function (d) { return x(d.age); })
              .attr("cy", function (d) { return y(d.weight); })
              .style("fill", "#4292c6")
              
              //.attr("pointer-events", "all")
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
           .text("X Label");
  
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
              .text("Y Label");
  
          scatter.append("g")
              .attr("class", "brush")
              .call(brush);            
  
          function brushended(event: any) {
              var s = event.selection;
              if (!s) {
                  if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                  x.domain([FriendValidation.MinMaxAge.MIN, FriendValidation.MinMaxAge.MAX]);
                  y.domain([FriendValidation.MinMaxWeight.MIN, FriendValidation.MinMaxWeight.MAX]);
              } else {
                  x.domain([s[0][0], s[1][0]].map(x.invert, x));
                  y.domain([s[1][1], s[0][1]].map(y.invert, y));
                  scatter.select(".brush")
                  //.style("display", "none")
                  .call(brush.move as any); // Remove brush from screen selection // TODO Typescript yelling if not any investigate more
              }
              zoom();
              return null
          }
  
          function idled() {
              idleTimeout = null;
          }
  
          const zoom = () => {
              svg.select("#axis--x").transition().duration(750).call(xAxis as any); //  TODO Typescript yelling if not any investigate more
              svg.select("#axis--y").transition().duration(750).call(yAxis as any); //  TODO Typescript yelling investigate more
              scatter.selectAll("circle").transition()
              .attr("cx", function (d: any) { return x(d.age); })
              .attr("cy", function (d: any) { return y(d.weight); });
          }










          // // Add X axis AGE
          // const x = d3.scaleLinear()
          // .domain([FriendValidation.MinMaxAge.MIN, FriendValidation.MinMaxAge.MAX])
          // .range([ 0, this.width ]);
          // svg.append("g")
          // .attr("transform", `translate(0, ${this.height})`)
          // .call(d3.axisBottom(x));
  
          // // Add Y axis WEIGHT
          // const y = d3.scaleLinear()
          // .domain([FriendValidation.MinMaxWeight.MIN, FriendValidation.MinMaxWeight.MAX])
          // .range([ this.height, 0]);
          // svg.append("g")
          // .call(d3.axisLeft(y));
  
          // // Add X axis label:
          // svg.append("text")
          //     .attr("text-anchor", "end")
          //     .attr("x", this.width/2 + this.margin.left)
          //     .attr("y", this.height + this.margin.top + 20)
          //     .text("Age (years)");
  
          // // Y axis label:
          // svg.append("text")
          //     .attr("text-anchor", "end")
          //     .attr("transform", "rotate(-90)")
          //     .attr("y", -this.margin.left + 20)
          //     .attr("x", -this.margin.top - this.height/2 + 20)
          //     .text("Weight (pounds)")

          // //  Highlight related friends
          // const highlight = (event: any,f: Friend) => {
          //   f.friendList.forEach(friend => {
          //     d3.selectAll("." + friend.id)
          //       .transition()
          //       .duration(200)
          //       .style("fill", 'red')
          //       .attr("r", 3)
          //   });
          // }
          
          // const doNotHighlight = (event: any,f: Friend) => {
          //   d3.selectAll(".dot")
          //     .transition()
          //     .duration(200)
          //     .style("fill", this.defaultColor )
          //     .attr("r", this.defaultRadius )
          // }

          // //  Add tooltip to display information
          // const tooltip = d3.select(`#${this.graphName}`)
          //   .append("div")
          //   .style("opacity", 0)
          //   .attr("class", "tooltip")
          //   .style("background-color", "white")
          //   .style("border", "solid")
          //   .style("border-width", "1px")
          //   .style("border-radius", "5px")
          //   .style("padding", "10px")
          //   .style("position", "absolute")
  
          // // Add dots
          // svg.append('g')
          // .selectAll("dot")
          // .data(friends)
          // .join("circle")
          //     .attr("class", function (f) { return "dot " + f.id } ) // ID created to highlight friends
          //     .attr("cx", function (f) { return x(f.age); } )
          //     .attr("cy", function (f) { return y(f.weight); } )
          //     .attr("r", this.defaultRadius)
          //     .style("fill", this.defaultColor )
          // .on("mouseover", (event, f: Friend) => {
          //   highlight(event, f);
          //   //  Show tooltip
          //   tooltip.style("opacity", 1);
          // })
          // .on("mousemove", (event, f: Friend) => {
          //   //  Move tool tip
          //   tooltip
          //     .html(
          //       `
          //       Name: ${f.name}<br>
          //       Age: ${f.age}<br>
          //       Weight: ${f.weight}<br>
          //       Friend Count: ${f.friendList.length}
          //       `
          //     )
          //     .style("left", (event.x)/2 + "px")
          //     .style("top", (event.y)/2 + "px")
          // })
          // .on("mouseleave", (event, f: Friend) => {
          //   doNotHighlight(event, f);
          //   //  Remove tooltip
          //   tooltip
          //     .transition()
          //     .duration(200)
          //     .style("opacity", 0)
          // })
          // // let zoom = () => d3.zoom()
          // //       //.scaleExtent([1, 8])
          // //       .on('zoom', function(event) {
          // //           svg.attr('transform', event.transform);
          // //       })
          
          // // svg.call(zoom).call(zoom);        

          // // create scale objects
          // var xScale = d3.scaleLinear()
          //   .domain([0, 60])
          //   .range([0, this.width]);
          // var yScale = d3.scaleLinear()
          //   .domain([0, 60])
          //   .range([this.height, 0]);
          // // create axis objects
          // var xAxis = d3.axisBottom(xScale)
          //   .ticks(20, "s");
          // var yAxis = d3.axisLeft(yScale)
          //   .ticks(20, "s");

          // function zoomed() {
          //   // create new scale ojects based on event
          //       var new_xScale = d3.event.transform.rescaleX(xScale);
          //       var new_yScale = d3.event.transform.rescaleY(yScale);
          //   // update axes
          //       x.call(xAxis.scale(new_xScale));
          //       y.call(yAxis.scale(new_yScale));
          //       points.data(data)
          //        .attr('cx', function(d) {return new_xScale(d.x)})
          //        .attr('cy', function(d) {return new_yScale(d.y)});
          //   }

          // const xAxis = (g: any, x: any) => g
          // .attr("transform", `translate(0,${this.height})`)
          // .call(d3.axisTop(x).ticks(12))
          // .call((g: any) => g.select(".domain").attr("display", "none"))

          // const yAxis = (g: any, y: any) => g
          // .call(d3.axisRight(y).ticks(12 * (this.height/this.width)))
          // .call((g: any) => g.select(".domain").attr("display", "none"))
          // const gx = svg.append("g");

          // const gy = svg.append("g");
          // const zoom = d3.zoom()
          //   .scaleExtent([0.5, 32])
          //   .on("zoom", zoomed) as any;
          // svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

          // function zoomed({transform} : any) {
          //   const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
          //   const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
          //   svg.selectAll('dot').attr("transform", transform).attr("stroke-width", 5 / transform.k);
          //   gx.call(xAxis, zx);
          //   gy.call(yAxis, zy);
          //   //gGrid.call(grid, zx, zy);
          // }

        }
      )    
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
