import React, { useEffect, useRef, useState } from 'react';

import useCSVParserFromURL from '@/hooks/useWorkouts';
import * as d3 from 'd3';

const Heatmap = () => {
  const svgRef = useRef(null);
  const { data } = useCSVParserFromURL('/activity/2024.csv');

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (!data || data.length == 0) {
      return;
    }

    const width = 400;
    const height = 400;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    let svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();  // 清除之前的图表

     svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    svg.selectAll('*').remove(); // 清除之前的图表

    const color = d3
      .scaleOrdinal()
      .domain(['moveActual', 'exerciseActual', 'standActual'])
      .range(['#ff3b30', '#ff9500', '#4cd964']);

    const arcGenerator = d3
      .arc()
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius)
      .cornerRadius(10);

    const dataReady = [
      {
        name: 'moveActual',
        cnName: '锻炼目标',
        value:
          data[currentIndex]['Move Actual'] / data[currentIndex]['Move Goal'],
        actual: data[currentIndex]['Move Actual'],
        goal: data[currentIndex]['Move Goal'],
        unit: 'cal',
      },
      {
        name: 'exerciseActual',
        cnName: '运动时间',
        value:
          data[currentIndex]['Exercise Actual'] /
          data[currentIndex]['Exercise Goal'],
        actual: data[currentIndex]['Exercise Actual'],
        goal: data[currentIndex]['Exercise Goal'],
        unit: 'hours',
      },
      {
        name: 'standActual',
        cnName: '站立时间',
        value:
          data[currentIndex]['Stand Actual'] / data[currentIndex]['Stand Goal'],
        actual: data[currentIndex]['Stand Actual'],
        goal: data[currentIndex]['Stand Goal'],
        unit: 'minutes',
      },
    ];

    console.log(dataReady, dataReady);

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

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('border', 'none')
      .style('background', '#FFFFFF50')
      .style('border', '1px solid #ccc')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 0 10px rgba(0,0,0,0.2)')
      .style('visibility', 'hidden');

    layers.forEach((layer) => {
      const categoryData = dataReady.find((d) => d.name === layer.category);
      const endAngle = 2 * Math.PI * categoryData.value;

      // 绘制实际值的弧形
      svg
        .append('path')
        .datum({
          startAngle: 0,
          endAngle,
          innerRadius: layer.innerRadius,
          outerRadius: layer.outerRadius,
        })
        .attr('d', arcGenerator)
        .attr('fill', color(categoryData.name))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('stroke-linecap', 'butt') // 设置线条末端为整齐的边缘
        .on('mouseover', (event, d) => {
          tooltip
            .style('visibility', 'visible')
            .text(
              ` ${categoryData.cnName}  ${categoryData.actual} / ${categoryData.goal}  ${categoryData.unit}`
            );
        })
        .on('mousemove', (event) => {
          tooltip
            .style('top', event.pageY - 10 + 'px')
            .style('left', event.pageX + 10 + 'px');
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
        });

      // 绘制剩余部分的透明弧形
      svg
        .append('path')
        .datum({
          startAngle: endAngle,
          endAngle: 2 * Math.PI,
          innerRadius: layer.innerRadius,
          outerRadius: layer.outerRadius,
        })
        .attr('d', arcGenerator)
        .attr('fill', 'transparent')
        .attr('stroke', '#59637c3d')
        .style('stroke-width', '1px');
    });
  }, [data, currentIndex]);

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
  return (
    <>
      {data && data[currentIndex] && (
        <>
          <div className="flex gap-2">
            <span>{data[currentIndex]['Date']}</span>
            <button
              onClick={handleNext}
              className="px-2 py-0 hover:bg-white/20"
            >
              前一天
            </button>
            <button
              onClick={handlePrev}
              className=" px-2 py-0 hover:bg-white/20"
            >
              后一天
            </button>
          </div>
          <svg ref={svgRef}></svg>
        </>
      )}
    </>
  );
};

export default Heatmap;
