import React, { useEffect, useRef, useState } from 'react';

import useCSVParserFromURL from '@/hooks/useWorkouts';
import * as d3 from 'd3';

const Heatmap = () => {
  const svgRef = useRef(null);
  const { data } = useCSVParserFromURL('/activity/2024.csv');

  useEffect(() => {
    if (!data || data.length == 0) {
      return;
    }
    const width = 400;
    const height = 400;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(['moveActual', 'exerciseActual', 'standActual'])
      .range(['#ff3b30', '#ff9500', '#4cd964']);

    const arcGenerator = d3
      .arc()
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius)
      .cornerRadius(10);

    const pieGenerator = d3
      .pie()
      .value((d) => d.value)
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    const dataReady = [
      {
        name: 'moveActual',
        value: data[0]['Move Actual'] / data[0]['Move Goal'],
      },
      {
        name: 'exerciseActual',
        value: data[0]['Exercise Actual'] / data[0]['Exercise Goal'],
      },
      {
        name: 'standActual',
        value: data[0]['Stand Actual'] / data[0]['Stand Goal'],
      },
    ];

    console.log(dataReady,dataReady)



    const layers = [
      {
        innerRadius: radius * 0.6,
        outerRadius: radius * 0.8,
        category: 'moveActual',
      },
      {
        innerRadius: radius * 0.4,
        outerRadius: radius * 0.6,
        category: 'exerciseActual',
      },
      {
        innerRadius: radius * 0.2,
        outerRadius: radius * 0.4,
        category: 'standActual',
      },
    ];

    layers.forEach(layer => {
      const categoryData = dataReady.find(d => d.name === layer.category);
      const endAngle = 2 * Math.PI * categoryData.value;

      // 绘制实际值的弧形
      svg.append('path')
        .datum({ startAngle: 0, endAngle, innerRadius: layer.innerRadius, outerRadius: layer.outerRadius })
        .attr('d', arcGenerator)
        .attr('fill', color(categoryData.name))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

      // 绘制剩余部分的透明弧形
      svg.append('path')
        .datum({ startAngle: endAngle, endAngle: 2 * Math.PI, innerRadius: layer.innerRadius, outerRadius: layer.outerRadius })
        .attr('d', arcGenerator)
        .attr('fill', 'transparent')
        .attr('stroke', 'white')
        .style('stroke-width', '2px');
    });

  }, []);


  // useEffect(() => {
  //   const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  //   const width = 500 - margin.left - margin.right;
  //   const height = 300 - margin.top - margin.bottom;

  //   const svg = d3.select(svgRef.current)
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .append('g')
  //     .attr('transform', `translate(${margin.left},${margin.top})`);

  //   const x = d3.scaleBand()
  //     .domain(data.map(d => d["Date"]))
  //     .range([0, width])
  //     .padding(0.1);

  //   const y = d3.scaleBand()
  //     .domain(['exerciseActual', 'moveActual', 'standActual'])
  //     .range([0, height])
  //     .padding(0.1);

  //   const color = d3.scaleSequential(d3.interpolateBlues)
  //     .domain([0, d3.max(data, d => Math.max(d['Exercise Actual'], d['Move Actual'], d['Stand Actual']))]);

  //   const tooltip = d3.select('body').append('div')
  //     .attr('class', 'tooltip')
  //     .style('position', 'absolute')
  //     .style('background', '#fff')
  //     .style('border', '1px solid #ccc')
  //     .style('padding', '10px')
  //     .style('display', 'none');

  //   const categories = ['exerciseActual', 'moveActual', 'standActual'];

  //   categories.forEach(category => {
  //     svg.append('g')
  //       .selectAll('rect')
  //       .data(data)
  //       .enter()
  //       .append('rect')
  //       .attr('x', d => x(d.date))
  //       .attr('y', d => y(category))
  //       .attr('width', x.bandwidth())
  //       .attr('height', y.bandwidth())
  //       .attr('fill', d => color(d[category]))
  //       .on('mouseover', (event, d) => {
  //         tooltip.style('display', 'block')
  //           .html(`Date: ${d.date}<br>${category}: ${d[category]}`)
  //           .style('left', (event.pageX + 5) + 'px')
  //           .style('top', (event.pageY - 28) + 'px');
  //       })
  //       .on('mouseout', () => tooltip.style('display', 'none'));
  //   });

  //   svg.append('g')
  //     .attr('transform', `translate(0,${height})`)
  //     .call(d3.axisBottom(x));

  //   svg.append('g')
  //     .call(d3.axisLeft(y));

  // }, [data]);
  return <svg ref={svgRef}></svg>;
};

export default Heatmap;
