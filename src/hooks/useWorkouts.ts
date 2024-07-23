import { useState, useEffect } from 'react';
import { readString } from 'react-papaparse';

const useCSVParserFromURL = (fileURL) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileURL) {
      setLoading(false);
      return;
    }

    const fetchCSV = async () => {
      setLoading(true);
      try {
        const response = await fetch(fileURL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csvString = await response.text();
        readString(csvString, {
          header: true, // optional: if your CSV string has a header row
          complete: (result) => {
            setData(result.data);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          },
        });
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCSV();
  }, [fileURL]);

  return { data, loading, error };
};

export default useCSVParserFromURL;





// import { useState, useEffect } from 'react';


// const useCSVParser = (csvFile) => {
//     const { readString } = usePapaParse();
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       const parseCSV = () => {
        

//         fetch("/DATA/workouts/2024.csv")
//         .then((response) => {
//             if (!response.ok) { 
//                 throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(csvText => {
//             readString(csvText, {
//                 header: true,
//                 skipEmptyLines: true,
//                 complete: (results) => {
//                     results.data.forEach(record => {
//                         workouts[record.UUID] = {
//                             distance: Number(record["Distance"]),
//                             duration: Number(record["Duration"]),
//                             type: Number(record["Type"]),
//                             elevationAscended: Number(record["Elevation Ascended"]),
//                             totalEnergy: Number(record["Total Energy"]),
//                             uuid: record["UUID"],
//                             name: record["Name"],
//                             startDate: record["Start Date"],
//                             endDate: record["End Date"],
//                             flightsClimbed: record["Flights Climbed"],
//                             swimStrokes: record["Swim Strokes"]
//                         }
//                         workoutTypes.add(record["Name"])
//                         // console.log(workouts)         
//                     });
//                 },
    
//             });
//         }



  
//     return { data, loading, error };
//   };
  
//   export default useCSVParser;

// const useWorkouts = (url) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const parseCSV =  fe

//     })
//     .catch((error) => {

//     });


//   return { data, loading, error };
// };

// export default useWorkouts;



