import React, { useEffect, useRef, useState } from 'react';

import useCSVParserFromURL from '@/hooks/useWorkouts';
import * as d3 from 'd3';
import Ticker from '../animata/text/ticker';
import Heatmap from './heatmap';

const Banner = () => {
    const svgRef = useRef(null);
    const { data } = useCSVParserFromURL('/distances/2024.csv');
    const { data: activityData } = useCSVParserFromURL('/activity/2024.csv');
    const [walkingDistance, setWalkingDistance] = useState(0);

    const [steps, setSteps] = useState(0);

    const [energy, setEnergy] = useState(0);

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

 

    //  绘制活动数据
    useEffect(() => {
        if (!data || data.length == 0) {
            return;
        }
        const currentData = data[currentIndex]
        setWalkingDistance(currentData["Distance Walking/Running"])
        setSteps(Number.parseFloat(currentData["Steps"]).toFixed(0))

    }, [data, currentIndex])

    useEffect(() => {
        let svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();  // 清除之前的图表
        if (!activityData || activityData.length == 0 || !activityData[currentIndex]) {
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

        setEnergy(activityData[currentIndex]['Move Actual'])

        const dataReady = [
            {
                name: 'moveActual',
                cnName: '锻炼目标',
                value:
                    activityData[currentIndex]['Move Actual'] / activityData[currentIndex]['Move Goal'],
                actual: activityData[currentIndex]['Move Actual'],
                goal: activityData[currentIndex]['Move Goal'],
                unit: '千卡',
            },
            {
                name: 'exerciseActual',
                cnName: '运动时间',
                value:
                    activityData[currentIndex]['Exercise Actual'] /
                    activityData[currentIndex]['Exercise Goal'],
                actual: activityData[currentIndex]['Exercise Actual'],
                goal: activityData[currentIndex]['Exercise Goal'],
                unit: '分钟',
            },
            {
                name: 'standActual',
                cnName: '站立时间',
                value:
                    activityData[currentIndex]['Stand Actual'] / activityData[currentIndex]['Stand Goal'],
                actual: activityData[currentIndex]['Stand Actual'],
                goal: activityData[currentIndex]['Stand Goal'],
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
    }, [activityData, currentIndex]);



    return (
        <>
            {data && data[currentIndex] && (
                <>
                    <div className="flex gap-2 mb-6">
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
                    <div className="flex gap-6 items-baseline">
                        {energy && (
                            <> <Ticker
                                className="text-xl md:text-7xl font-black"
                                value={energy}
                            /> 千卡</>)
                        }
                        {
                            steps && (<>

                                <Ticker
                                    className="text-xl md:text-7xl font-black"
                                    value={steps}
                                /> 步</>)
                        }
                        {
                            walkingDistance && (<>

                                <Ticker
                                    className="text-xl md:text-7xl font-black"
                                    value={walkingDistance}
                                /> 米</>)
                        }

                    </div>

                </>
            )}
            <div className = "flex justify-between items-center" >

            <svg ref={svgRef}></svg>
            {/* <h1>热力图</h1> */}
            <Heatmap />
            </div>
        </>
    );
};

export default Banner;
