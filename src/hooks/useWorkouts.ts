import { locationForRun, typeForRun } from '@/utils/utils';
import activities from '@/static/activities.json';
import { usePapaParse } from 'react-papaparse';


const useWorkouts = () => {

    const { readString } = usePapaParse();
    debugger

    const cities: Record<string, number> = {};
    const runPeriod: Record<string, number> = {};
    const provinces: Set<string> = new Set();
    const countries: Set<string> = new Set();
    const workouts : Record<string,object> = {}
    let years: Set<string> = new Set();
    let thisYear = '';


    fetch("/DATA/activity/2024.csv")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then((csvText) => {
            readString(csvText,{
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    debugger
                },
                
            },);
         
        })
        .catch((error) => {

        });





    activities.forEach((run) => {
        const location = locationForRun(run);

        const periodName = typeForRun(run);
        if (periodName) {
            runPeriod[periodName] = runPeriod[periodName]
                ? runPeriod[periodName] + 1
                : 1;
        }


        const { city, province, country } = location;
        // drop only one char city
        if (city.length > 1) {
            cities[city] = cities[city] ? cities[city] + run.distance : run.distance;
        }
        if (province) provinces.add(province);
        if (country) countries.add(country);
        const year = run.start_date_local.slice(0, 4);
        years.add(year);
    });

    let yearsArray = [...years].sort().reverse();
    if (years) [thisYear] = yearsArray; // set current year as first one of years array

    return {
        activities,
        years: yearsArray,
        countries: [...countries],
        provinces: [...provinces],
        cities,
        runPeriod,
        thisYear,
    };
};

export default useWorkouts;
