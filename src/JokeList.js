import React from "react";
import Joke from "./Joke";
import axios from "axios";
import "./JokeList.css";

const API_URL = "https://icanhazdadjoke.com/";

class JokeList extends React.Component {
  static defaultProps = {
    numJokes: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      isLoading: false,
    };
    this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  async getJokes() {
    try {
      let jokes = [];
      while (jokes.length < 10) {
        let res = await axios.get(API_URL, {
          headers: { Accept: "application/json" },
        });
        let newJoke = res.data.joke;
        if (!this.seenJokes.has(newJoke)) {
          jokes.push({ text: newJoke, votes: 0, id: res.data.id });
        }
      }
      this.setState((prevState) => ({
        jokes: [...prevState.jokes, ...jokes],
        isLoading: false,
      }));
      window.localStorage.setItem("jokes", JSON.stringify(jokes));
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleVoting = (id, change) => {
    this.setState(
      (prevState) => ({
        jokes: prevState.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + change } : j
        ),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  };

  handleClick = () => {
    this.setState({ isLoading: true });
    this.getJokes();
  };

  render() {
    let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes)
    return this.state.isLoading ? (
      <div className="JokeList-loader">
        <i className="far fa-8x fa-laugh fa-spin" />
        <h1 className="JokeList-title">Loading...</h1>
      </div>
    ) : (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="laughing emoji"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            New Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {jokes.map((joke) => (
            <Joke
              key={joke.id}
              id={joke.id}
              joke={joke.text}
              votes={joke.votes}
              handleVoting={this.handleVoting}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
