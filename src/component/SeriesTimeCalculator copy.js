import React, { Component } from "react";
import "./SeriesTimeCalculator.css";

import axios from "axios";

// const options = {
//   method: 'GET',
//   url: 'https://imdb8.p.rapidapi.com/title/find',
//   params: {q: 'game of thrones'},
//   headers: {
//     'x-rapidapi-key': '350b05e5efmshbe4a30ce50ae94ap1bc047jsnd95e5bf5097e',
//     'x-rapidapi-host': 'imdb8.p.rapidapi.com'
//   }
// };

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });


export default class SeriesTimeCalculator extends Component {
  state = {
    input: "",
    results: [],
    items: [],
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  storeItems = (event) => {
    event.preventDefault();
    const { input } = this.state;
    // const allItems = this.state.items;
    // allItems.push(input);
    // this.setState({
    //   items: allItems,
    // });
    // this.setState({
    //   items: [...this.state.items, input],
    //   input: "",
    // });

    async function updateResult() {
      const title = this.state.input;

      const options = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/title/find',
        params: {q: this.state.input},
        headers: {
          'x-rapidapi-key': '350b05e5efmshbe4a30ce50ae94ap1bc047jsnd95e5bf5097e',
          'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const results = response.data.results.filter((result) => result.titleType === 'tvSeries' && result.title.toLowerCase() === title.toLowerCase());
        console.log(results);
  
        this.setState({
          ...this.state,
          results: this.state.results.push(results[0])
        });
      } catch(err) {
        console.log(err.message);
      }

    }

    updateResult();



    // axios.request(options)
    // .then(function (response) {
    //   // console.log(response.data);

    // })
    // .catch(function (error) {
    //   console.error(error);
    // });

  };
  deleteItem = (key) => {
    //   const allItems=this.state.items;
    //   allItems.splice(key,1);
    //   this.setState({
    //       items:allItems
    //   })
    this.setState({
      items: this.state.items.filter((data, index) => index !== key),
    });
  };

  render() {
    const { input, items } = this.state;
    return (
      <div className="input-container">
        <form className="input-section" onSubmit={this.storeItems}>
          <h1>Series Time Calculator</h1>
          <input
            type="text"
            name="input"
            onChange={this.handleChange}
            value={input}
            placeholder="Type in a TV Show"
          />
        </form>
        <ul>
          {items.map((data, index) => (
            <li key={index}>
              {data}

              <i
                className="fas fa-times"
                onClick={() => this.deleteItem(index)}
              ></i>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
