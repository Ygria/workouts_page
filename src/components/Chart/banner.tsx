import React, { useEffect, useRef, useState } from 'react';

import useCSVParserFromURL from '@/hooks/useWorkouts';
import * as d3 from 'd3';
import Ticker from '../animata/text/ticker';
import AlgoliaWhiteButton from '../animata/button/algolia-white-button';
import Heatmap from './heatmap';

const Banner = () => {
  const svgRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const { data } = useCSVParserFromURL(`/distances/${currentYear}.csv`);
  const { data: activityData } = useCSVParserFromURL(`/activity/${currentYear}.csv`);

  const [fullData, setFullData] = useState([]);
  const [walkingDistance, setWalkingDistance] = useState(0);

  const [steps, setSteps] = useState(0);

  const [energy, setEnergy] = useState(0.00);

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

  const mergeData = (data1, data2) => {
    const groupedData1 = data1.reduce((acc, item) => {
      const date = item.Date;
      if (!acc[date]) {
        acc[date] = { ...item };
      } else {
        for (const key in item) {
          if (key !== 'Date') {
            acc[date][key] = parseFloat(acc[date][key]) + parseFloat(item[key]);
          }
        }
      }
      return acc;
    }, {});

    const data2Map = data2.reduce((acc, item) => {
      acc[item.Date] = item;
      return acc;
    }, {});

    const mergedData = [];

    for (const date in groupedData1) {
      mergedData.push({
        ...groupedData1[date],
        ...(data2Map[date] || {}),
      });
    }

    for (const date in data2Map) {
      if (!groupedData1[date]) {
        mergedData.push(data2Map[date]);
      }
    }

    return mergedData;
  };

  useEffect(() => {
    if (data && activityData) {
      const mergedArr = mergeData(data, activityData);

      setFullData(mergedArr);
    }
  }, [data, activityData]);

  //  绘制活动数据
  useEffect(() => {
    if (!fullData || fullData.length == 0 || !fullData[currentIndex]) {
      setWalkingDistance(0.00);
      setSteps(0);
      setEnergy(0.00);
      return;
    }
    const currentData = fullData[currentIndex];
    setWalkingDistance(currentData['Distance Walking/Running'] || 0);
    setSteps(Number.parseFloat(currentData['Steps' || 0]).toFixed(0));
  }, [fullData, currentIndex]);

  useEffect(() => {
    let svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 清除之前的图表
    if (!fullData || fullData.length == 0 || !fullData[currentIndex]) {
      return;
    }

    const width = 400;
    const height = 400;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

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

    setEnergy(fullData[currentIndex]['Move Actual'] || 0.00);

    const dataReady = [
      {
        name: 'moveActual',
        cnName: '锻炼目标',
        value:
          fullData[currentIndex]['Move Actual'] /
          fullData[currentIndex]['Move Goal'],
        actual: fullData[currentIndex]['Move Actual'],
        goal: fullData[currentIndex]['Move Goal'],
        unit: '千卡',
      },
      {
        name: 'exerciseActual',
        cnName: '运动时间',
        value:
          fullData[currentIndex]['Exercise Actual'] /
          fullData[currentIndex]['Exercise Goal'],
        actual: fullData[currentIndex]['Exercise Actual'],
        goal: fullData[currentIndex]['Exercise Goal'],
        unit: '分钟',
      },
      {
        name: 'standActual',
        cnName: '站立时间',
        value:
          fullData[currentIndex]['Stand Actual'] /
          fullData[currentIndex]['Stand Goal'],
        actual: fullData[currentIndex]['Stand Actual'],
        goal: fullData[currentIndex]['Stand Goal'],
        unit: '小时',
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
  }, [fullData, currentIndex]);

  return (
    <>
      {fullData && (
        <>
          <div className="mb-6 flex items-baseline gap-2">
            <div className="h-[30px]">
              {(fullData[currentIndex] && fullData[currentIndex]['Date'] && (
                <Ticker
                  className="text-[20px] font-black "
                  value={fullData[currentIndex]['Date']}
                />
              )) || <>无数据</>}
            </div>

            <AlgoliaWhiteButton text={'前一天'} onClick={handleNext} />
            <AlgoliaWhiteButton text={'后一天'} onClick={handlePrev} />
          </div>
          <div className="flex items-baseline gap-6">
            <>
              <Ticker
                className="text-xl font-black md:text-7xl"
                value={energy}
              />
              千卡
            </>

            <>
              <Ticker
                className="text-xl font-black md:text-7xl"
                value={steps}
              />
              步
            </>

            <>
              <Ticker
                className="text-xl font-black md:text-7xl"
                value={walkingDistance}
              />
              米
            </>
          </div>
        </>
      )}
      <div className="flex-wrap items-center justify-between">
        <svg ref={svgRef}></svg>
        {/* <h1>热力图</h1> */}
        <div className="w-[600px]">
          <Heatmap />
        </div>
      </div>
    </>
  );
};

export default Banner;
