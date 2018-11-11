import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'

  let fakeServerData = {
    user: {
      name: 'Ralph',
      playlists: [
        {
          name: 'Workout',
          songs:[{name:'Hello', duration: 1134}, {name:'I', duration: 1134}, {name:'Workout', duration: 1134}]
        },
      ]
    }
  }



class PlaylistCounter extends Component {
  render (){
    return(
    <div style={{width:'40%', display:'inline-block'}}>
      <h2 style={{color:'#111'}}>playlists</h2>
    </div>
  );
  }
}

class HoursCounter extends Component {

  render (){
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)} ,[])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return(
    <div style={{width:'40%', display:'inline-block'}}>
      <h2 style={{color:'#111'}}>{Math.round(totalDuration/60)} Hours</h2>
    </div>
  );
  }
}


class Filter extends Component {
  render() {
    return(
      <div>
       <input type='text' onKeyUp = {e =>
       this.props.onTextChange(e.target.value)}/>
       Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
     <div style={{color: 'white', width:'20%', display:'inline-block'}}>
      <h3> {this.props.playlist.name} </h3>
      <ul>
      {this.props.playlist.songs.map(song => <li> {song.name}</li> )}


      </ul>
      </div>
    );
  }
}





class App extends Component {
  constructor() {
    super();

    this.state = {
      serverData: {},
      filterString: ''
    };
  }
  componentDidMount(){
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token

    fetch('https://api.spotify.com/v1/me',{
       headers: { 'Authorization': 'Bearer ' + accessToken }
     }).then(response => response.json())
  .then(data => this.setState({serverData: {user: {name: data.display_name}}}))

  }

  render() {
    let playlistToRender = this.state.serverData.user &&
     this.state.serverData.user.playlists
     ? this.state.serverData.user.playlists.filter(playlist=>
      playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      : []
    return(

      <div className="App">
      {this.state.serverData.user ?
      <div>
        <h1>{ this.state.serverData.user.name}' Playlist</h1>
        <PlaylistCounter playlists ={playlistToRender} />
        <HoursCounter playlists= {playlistToRender}/>
        <Filter onTextChange = {text => this.setState({filterString: text})}/>
          {playlistToRender.map(playlist => <Playlist playlist={playlist}/>
        )}
      </div>
      : <button onClick={()=> window.location = 'http://localhost:8888/login'}
      style={{padding: '20px', 'font                                                                                                                                      ize': '50px','marginTop':'20px'}}>Sign in with Spotify</button>
     }
    </div>
    );
  }
}

export default App;
