import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import useWorkouts from "@/hooks/useWorkouts"

// only support China for now
const WorkTypeStat = ({ onClick }: { onClick: (_city: string) => void }) => {
  // const { workouts } = useWorkouts();

  // const citiesArr = Object.entries(workouts);
  // citiesArr.sort((a, b) => b[1] - a[1]);
  return (
    <div className="cursor-pointer">
      {/* <section>
        {citiesArr.map(([city, distance]) => (
          <Stat
            key={city}
            value={city}
            description={` ${(distance / 1000).toFixed(0)} KM`}
            citySize={5}
            onClick={() => onClick(city)}
          />
        ))}
      </section> */}
      <hr color="red" />
    </div>
  );
};

export default WorkTypeStat;
