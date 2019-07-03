import * as d3 from 'd3';
import * as d3_legend from 'd3-svg-legend'
import world from "../data/CNTR_RG_10M_2016_4326.js"

export default function baseMap(state) {

    const w = 1400;
    const h = 700;

    d3.select('.base_map >*').remove();
    var svg = d3.select('.base_map').append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet") //necessary for vw/vh attributes
        .attr("viewBox", "0 0 " + w + " " + h)
        .classed("svg-content", true);

        var projection = d3.geoNaturalEarth1()
		.translate([w/2, h/2])
		.scale(245)
		.center([0, 0]);

	var path = d3.geoPath().projection(projection);

	//zoomable layer so country paths can still have on click funcs
	var zoom_layer = svg.append('g');

	const zoom = d3.zoom()
		.scaleExtent([1, 30])
		.on('zoom', zoomed);

	svg.call(zoom);

	function zoomed() {
		svg.selectAll('path')
		zoom_layer.attr('transform', d3.event.transform)
	}

	d3.select('body').append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0);

	//reset view after zoom on button press
	d3.select('.center_btn')
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 " + 116 + " " + 29)
		.attr('value', 'Center map')
		.on('click', function(d) {
			svg.call(zoom.transform, d3.zoomIdentity)
        })
        
    //the projection outline
	zoom_layer.append('path')
        .datum({type: "Sphere"})
        .attr('class', 'outline_path')
        .attr('d', path)
        .style('fill', "#c9e8fd") //c9e8fd
        .style('stroke', '#09101d')

    //emissions map, per capita map transparent underneath
    zoom_layer.selectAll(".map_path")
        .data(world.features)
        .enter()
        .append("path")
        .attr('class', 'map_path')
        .attr('fill', '#fff')
        .attr("d", path)
        .style('stroke', '#09101d')
        .style('stroke-width', '0.5px')
        .raise();

    var escale = colorscale(
        [100, 1000, 10000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 7500000, 10000000]
    );    
    var pscale = colorscale(
        [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 14, 18, 20]
    );
    legend(escale, '.2s', 'elegend')
    legend(pscale, '', 'plegend')

    d3.selectAll('.plegend')
        .style('opacity', 0)
    
}

function legend(scale, format, lclass) {
	//var paras = document.getElementsByClassName('.legend_g')
	//while(paras[0]) {paras[0].parentNode.removeChild(paras[0])}

	d3.selectAll('.' + lclass).remove();

	var legend = d3_legend.legendColor()
		.labelFormat(d3.format(format))
		.cells(11)
		.scale(scale)
		.ascending(true)
		.labels(d3_legend.legendHelpers.thresholdLabels)

    //TODO: Create a controls component
	d3.select('#controls_svg')
		.append('g')
		.attr('class', lclass)
		.attr('transform', 'translate(0,45)')
		.call(legend)
}

export function colorscale(domain) {

	var generator = d3.scaleLinear()
		.domain([0,(domain.length-1)/3,((domain.length-1)/3)*2,domain.length-1])
		.range(['#f7f7f7', '#fa7921', 'red', '#300000'])
		//.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
		//.range(['#fe839f', '#3493cb', '#b0abe9', '#67bfec', '#0aced4', '#37d5a9', '#7ed679', '#bdd053', '#f8c24b', '#fb826f'])
		//.domain([0, 3, 6, 9])
		//.range(['#1d5287', '#158a8c', '#36c185', '#d0f66a'])
		//.domain([0, (domain.length - 1)])
		//.range(['#22223b', '#ff366d', '#ffe66d'])
		//.range(['#f7b633', '#5893d4', '#1f3c88', '#670d59'])
		//.range(['#250057', '#930077', '#e61c5d', '#ffd530'])

	var range = d3.range(domain.length).map(generator);

	var threshold = d3.scaleThreshold()
		.domain(domain)
		.range(range)

	return threshold;
}