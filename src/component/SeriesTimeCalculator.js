import { useState } from "react";
import axios from "axios";
import "./SeriesTimeCalculator.css";

export default function SeriesTimeCalculator() {

  const [input, setInput] = useState("");
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('results')) || []);
  const [watchTime, setWatchTime] = useState(JSON.parse(localStorage.getItem('watchTime')) || { days: 0, hours: 0 });
  
  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const storeItems = (event) => {
    event.preventDefault();

    async function updateResult() {
      const title = input;

      const options = {
        method: "GET",
        url: "https://imdb8.p.rapidapi.com/title/find",
        params: { q: input },
        headers: {
          "x-rapidapi-key":
            "350b05e5efmshbe4a30ce50ae94ap1bc047jsnd95e5bf5097e",
          "x-rapidapi-host": "imdb8.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const [result] = response.data.results.filter(
          (result) =>
            result.titleType === "tvSeries" &&
            result.title.toLowerCase() === title.toLowerCase()
        );

        if (result) {
          console.log(result);

          setResults([...results, result]);

          console.log(result.runningTimeInMinutes);

          const resultHours = Math.floor(
            (result.runningTimeInMinutes * result.numberOfEpisodes) / 60
          );
          const resultDays = Math.floor(resultHours / 24);
          const newWatchTimeHours = watchTime.hours + (resultHours % 24);

          console.log(resultHours, resultDays, newWatchTimeHours);
          var newWatchTime = {};

          if (newWatchTimeHours >= 24) {
            newWatchTime = {
              days: watchTime.days + resultDays + 1,
              hours: newWatchTimeHours % 24,
            };
            // setWatchTime();
          } else {
            newWatchTime = {
              days: watchTime.days + resultDays,
              hours: newWatchTimeHours,
            };
          }
          setWatchTime(newWatchTime);
          setInput("");
          localStorage.setItem("watchTime", JSON.stringify(newWatchTime));
          localStorage.setItem("results", JSON.stringify([...results, result]));
        } else {
          alert("This series in not available");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    updateResult();
  };

  const deleteItem = (key) => {
    const deletedEntry = results[key];
    const deletedEntryHours = Math.floor(
      (deletedEntry.runningTimeInMinutes * deletedEntry.numberOfEpisodes) / 60
    );
    const deletedEntryDays = Math.floor(deletedEntryHours / 24);
    const newWatchTimeHours = watchTime.hours - (deletedEntryHours % 24);

    var newWatchTime = {};
    if (newWatchTimeHours < 0) {
      newWatchTime = {
        days: watchTime.days - deletedEntryDays - 1,
        hours: newWatchTimeHours + 24,
      };
    } else {
      newWatchTime = {
        days: watchTime.days - deletedEntryDays,
        hours: newWatchTimeHours,
      };
    }

    const newResults = results.filter((data, index) => index !== key);
    setResults(newResults);
    setWatchTime(newWatchTime);
    localStorage.setItem("watchTime", JSON.stringify(newWatchTime));
    localStorage.setItem("results", JSON.stringify(newResults));
  };

  return (
    <div className="container">
      <div className="input-container">
        <h1>Series Time Calculator</h1>
        <div className="time">
          {watchTime.days} Days {watchTime.hours} Hours
        </div>
        <form onSubmit={storeItems}>
          <input
            type="text"
            name="input"
            onChange={handleChange}
            value={input}
            placeholder="Type in a TV Show"
          />
        </form>
      </div>

      <div className="tiles">
        {results.map((data, index) => (
          <div key={index} className="card">
            <div
              className="fas fa-times delete"
              onClick={() => deleteItem(index)}
            ></div>
            <div className="image">
              <img src={data.image.url} />
            </div>

            <div className="title">
              <h3>{data.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
