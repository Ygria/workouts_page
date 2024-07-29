import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import useCSVParserFromURL from '@/hooks/useWorkouts';

import { TileChart } from "@riishabh/react-calender-heatmap";

const Heatmap = () => {
  const ref = useRef();
  const { data: activityData } = useCSVParserFromURL('/activity/2024.csv');
  // const dummydata = [
  //   { date: "2024-01-01", status: "success" as const },
  //   { date: "2024-01-02", status: "warning" as const },
  //   { date: "2024-01-03", status: "alert" as const },
  // ];

  const [dummydata,setDummyData] = useState([]);
  

  useEffect(() => {
    if (activityData.length === 0) return;

    // 解析数据
    const parsedData = activityData.map(row => {
      const date = row["Date"];
      const calories = +row["Move Actual"];
      const caloriesGoal = +row["Move Goal"]
      const status = calories > caloriesGoal ? 'success' : calories > caloriesGoal * 0.6 ? 'warning' : 'alert'

      return {
        date: new Date(date),
        status: status
      };
    });
    setDummyData(parsedData)


  }, [activityData]);

  return (
    <>
    <TileChart data={dummydata} range={6} />

    </>
  );
};

export default Heatmap;
