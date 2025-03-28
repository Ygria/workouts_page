import { formatPace, colorFromType, formatRunTime, Activity, RunIds,formatDate, formatTime } from '@/utils/utils';
import styles from './style.module.css';

interface IRunRowProperties {
  elementIndex: number;
  locateActivity: (_runIds: RunIds) => void;
  run: Activity;
  runIndex: number;
  setRunIndex: (_ndex: number) => void;
}

const RunRow = ({ elementIndex, locateActivity, run, runIndex, setRunIndex }: IRunRowProperties) => {
  const distance = (run.Distance / 1000.0).toFixed(2);
  const paceParts = run.average_speed ? formatPace(run.average_speed) : null;
  const heartRate = run.average_heartrate;
  const type = run.type;
  const runTime = formatRunTime(run.moving_time);
  const handleClick = () => {
    if (runIndex === elementIndex) {
      setRunIndex(-1);
      locateActivity([]);
      return
    };
    setRunIndex(elementIndex);
    locateActivity([run.run_id]);
  };
  if(!run.UUID){
    return null;
  }

  const  getEmojiByName = (name: string) => {

    const emojiDict = {
      "Tennis": "🎾",
      "Running": "🏃‍♂️",
      "Cycling": "🚴‍♂️",
      "Swimming": "🏊‍♂️",
      "Walking": "🚶‍♂️",
      "Hiking": "🥾",
      "Jump Rope": "📿",
      "Badminton":"🏸"
      
    }
    return emojiDict[name]  ?? "";
  }

  return (
    
    
    <tr
      className={`${styles.runRow} ${runIndex === elementIndex ? styles.selected : ''}`}
      key={run.start_date_local}
      onClick={handleClick}
   
    >
    
      <td className={styles.runDate}>{formatDate(run["Start Date"])}</td>
     
      <td>{getEmojiByName(run.Name)}{run.Name}</td>
      <td>{distance}</td>
      <td>{run["Elevation Ascended"]}</td>
      <td>{run["Total Energy"]}</td>
      <td>{  formatTime(run.Duration)}</td>
     
    </tr>
  );
};

export default RunRow;
