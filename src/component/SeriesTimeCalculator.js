import React, { Component } from "react";
import "./SeriesTimeCalculator.css";
export default class SeriesTimeCalculator extends Component {
  state = {
    input: "",
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
    this.setState({
      items: [...this.state.items, input],
      input: "",
    });
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
