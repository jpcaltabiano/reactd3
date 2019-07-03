import * as d3 from 'd3';
import { colorscale } from './basemap_d3'

import edata from '../data/emissions_total';
import pdata from '../data/emissons_per_capita';

export default function fillMap(state) {

    var domain;
    var map_data;
    var year = state.year;

    if (state.type === 'e') {
        domain = [100, 1000, 10000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 7500000, 10000000];
        map_data = edata;
    }
    else if (state.type === 'p') {
        domain = [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 14, 18, 20];
        map_data = pdata;
    }
    
    var div = d3.select('.tooltip');

	var datamap = d3.map(map_data.data, function(d) {
		return d.ccode;
	})

	var scale = colorscale(domain); 

    d3.selectAll('.map_path')
		.attr('fill', function(d) {

            var entry = datamap.get(d.properties.ISO3_CODE);

			if (entry && entry[year.toString()]) {
				return scale(entry[year.toString()])
			} else {
				return '#c9e8fd'
			}
		})
		.on('mouseover', function(d) {  
			var entry = datamap.get(d.properties.ISO3_CODE);
			div.transition()
				.duration(200)
				.style('opacity', 0.9)

			var currData = 0;
			if (entry && entry[year.toString()]) {

				currData = entry[year.toString()];
				
				div.html(d.properties.NAME_ENGL + '</br>' + d3.format(",.0f")(currData))
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");
			} else {
				div.html('No data')
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");
			}
		})
		.on('mousemove', function(d) {
			var entry = datamap.get(d.properties.ISO3_CODE);
			var currData = 0;
			if (entry && entry[year.toString()]) {

				currData = entry[year.toString()];
				
				div.html(d.properties.NAME_ENGL + '</br>' + d3.format(",.0f")(currData))
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");
			} else {
				div.html(d.properties.NAME_ENGL + '</br>' + 'No data')
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");
			}
		})
		.on('mouseout', function(d) {
			div.transition()
				.duration(200)
				.style('opacity', 0)
		})
		.on('click', function(d) {
			//console.log(scale(11.001))
			//charts(data, pdata, d.properties.NAME_ENGL, scale)
			//d3.selectAll('.pchart_svg').style('opacity', 0)
			//d3.selectAll('.echart_svg').style('opacity', 1)
		})
}