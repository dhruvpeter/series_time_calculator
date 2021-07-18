import { useState } from "react";
import "./SeriesTimeCalculator.css";

import axios from "axios";

export default function SeriesTimeCalculator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [watchTime, setWatchTime] = useState({ days: 0, hours: 0});

  const handleChange = (event) => {
      setInput(event.target.value);
  };

  const storeItems = (event) => {
    event.preventDefault();

    async function updateResult() {
      const title = input;

      const options = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/title/find',
        params: {q: input},
        headers: {
          'x-rapidapi-key': '350b05e5efmshbe4a30ce50ae94ap1bc047jsnd95e5bf5097e',
          'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const [result] = response.data.results.filter((result) => result.titleType === 'tvSeries' && result.title.toLowerCase() === title.toLowerCase());
        console.log(result);

        setResults([...results, result]);
        
        console.log(result.runningTimeInMinutes)

        const resultHours = Math.floor((result.runningTimeInMinutes * result.numberOfEpisodes) / 60);
        const resultDays = Math.floor(resultHours / 24);
        const newWatchTimeHours = watchTime.hours + resultHours % 24;

        console.log(resultHours, resultDays, newWatchTimeHours);

        if(newWatchTimeHours >= 24) {
          setWatchTime({days: watchTime.days + resultDays + 1, hours: newWatchTimeHours%24});
        } else {
          setWatchTime({days:  watchTime.days + resultDays, hours: newWatchTimeHours});
        }
        setInput("");
      } catch(err) {
        console.log(err.message);
      }

    }
    updateResult();
  };

  const deleteItem = (key) => {
    const deletedEntry = results[key];
    const deletedEntryHours = Math.floor((deletedEntry.runningTimeInMinutes * deletedEntry.numberOfEpisodes) / 60);
    const deletedEntryDays = Math.floor(deletedEntryHours / 24);
    const newWatchTimeHours = watchTime.hours - deletedEntryHours % 24;

    if(newWatchTimeHours < 0) {
      setWatchTime({days: watchTime.days - deletedEntryDays - 1, hours: newWatchTimeHours + 24});
    }
    else {
      setWatchTime({days: watchTime.days - deletedEntryDays, hours: newWatchTimeHours});
    }
    setResults(results.filter((data, index) => index !== key));
  }


  return (
    <div className="input-container">
      <form className="input-section" onSubmit={storeItems}>
        <h1>Series Time Calculator</h1>
        <input
          type="text"
          name="input"
          onChange={handleChange}
          value={input}
          placeholder="Type in a TV Show"
        />
      </form>
      <ul>
        {results.map((data, index) => (
          <li key={index}>
            {data.title}

            <i
              className="fas fa-times"
              onClick={() => deleteItem(index)}
            ></i>
          </li>
        ))}
      </ul>
    </div>
  );

}
