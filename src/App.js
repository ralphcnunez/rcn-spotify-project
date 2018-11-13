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
      <h2 style={{color:'#111'}}> {this.props.playlists.length} playlists</h2>
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
      <h2 style={{color:'#111'}}> {Math.round(totalDuration/60)} Hours</h2>
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
    let playlist = this.props.playlist
    return (
     <div style={{color: 'white', width:'20%', display:'inline-block'}}>
     <img src= {playlist.imageUrl} style={{width: '150px', 'padding-top': '20px' }} />
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
    if (!accessToken)
    return

  fetch('https://api.spotify.com/v1/me',{
    headers: { 'Authorization': 'Bearer ' + accessToken }})
    .then(response => response.json())
    .then(data => this.setState({
      user:{
        name: data.display_name
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists',{
      headers: { 'Authorization': 'Bearer ' + accessToken }})
      .then(response => response.json())
      .then(data => this.setState({
        playlists: data.items.map(item => {
          console.log(data.items)
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
          }
        })
      }))
    }

  render() {
    let playlistToRender =
    this.state.user && this.state.playlists ?
    this.state.playlists.filter(playlist=>
      playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      : []
    return(

      <div className="App">
      {this.state.user ?
        <div>
        <h1>{ this.state.user.name}'s Playlist</h1>
        <PlaylistCounter playlists ={playlistToRender} />
        <HoursCounter playlists= {playlistToRender}/>
        <Filter onTextChange = {text => this.setState({filterString: text})
      }/>
          {playlistToRender.map(playlist => <Playlist playlist={playlist}/>
        )}
        </div> : <button onClick={()=> window.location = 'http://localhost:8888/login'}
        style ={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>
        Sign in with Spotify </button>
      }
        </div>
    );
  }
}

export default App;
