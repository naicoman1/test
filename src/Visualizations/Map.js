import React, { Component } from "react";
import * as d3 from "d3";
import { select, json, tsv, geoPath, geoNaturalEarth1, zoom, event } from "d3";
import { feature } from "topojson";


class Map extends Component {
  componentDidMount() {
    this.createMap();
  }

  createMap() {
    const svg = select("#map")
      .append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .style("background-color", "black");

    const projection = geoNaturalEarth1();
    const pathGenerator = geoPath().projection(projection);

    const g = svg.append("g");

    g.append("path")
      .attr("class", "sphere")
      .attr("d", pathGenerator({ type: "Sphere" }));

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [this.props.width, this.props.height],
        ])
        .scaleExtent([1, 8])
        .on("zoom", zoomed)
    );

    function zoomed({ transform }) {
      g.attr("transform", transform);
    }
    let Tooltip = d3
      .select("#main")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    Promise.all([
      tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
      json("https://unpkg.com/world-atlas@1.1.4/world/50m.json"),
    ]).then(([tsvData, topoJSONdata]) => {
      const countryName = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name;
        return accumulator;
      }, {});
      let mouseover = function (d) {
        Tooltip.style("opacity", 1);
        d3.select(this);
      };
      let mousemove = function (d) {
        Tooltip.html(countryName[d.target.__data__.id])
          .style("left", d3.pointer(d)[0] + 30 + "px")
          .style("top", d3.pointer(d)[1] + "px");
      };
      let mouseleave = function (d) {
        Tooltip.style("opacity", 0);
        d3.select(this);
      };
      let mouseClick = function (d) {
        console.log(d);
      };

      const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
      console.log(countries.features);
      g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", pathGenerator)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", mouseClick);
    });
  }

  render() {
    return <div id="map"></div>;
  }
}

export default Map;
