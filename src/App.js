import React, { Component } from 'react';
import './App.css';


class Aggregate extends Component {
  render (){
    return(
    <div style={{width:'40%', display:'inline-block'}}>
      <h2 style={{color:'#111'}}>Number Text</h2>
    </div>
      )
  }
}
class Filter extends Component {
  render() {
    return(
      <div>
      <img/>
       <input type='text'/>
       Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
     <div style={{color: 'white', width:'20%', display:'inline-block'}}>
      <h3> PlayList Name </h3>
      <ul><li>Hello 1</li><li>Hello 2</li><li>Hello 3</li></ul>
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
      <h1> Title </h1>
      <Aggregate/>
      <Aggregate/>
      <Filter/>
      <Playlist/>
      <Playlist/>
      <Playlist/>

      </div>
    );
  }
}

export default App;
