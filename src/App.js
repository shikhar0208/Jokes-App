import React from 'react';
import JokeList from './JokeList';
import './App.css';

class App extends React.Component{
  render() {
    return(
      <div className="App">
        <JokeList />
      </div>
    )
  }
}


export default App;
