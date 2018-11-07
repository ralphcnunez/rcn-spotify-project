import React, { Component } from 'react';
import './App.css';

  let fakeServerData = {
    user: {
      name: 'Ralph',
      playlists: [
        {
          name: 'Workout',
          songs:[{name:'Hello', duration: 1134}, {name:'I', duration: 1134}, {name:'Workout', duration: 1134}]
        },
        {
          name: 'Study',
          songs:[{name:'Hey', duration: 1134}, {name:'Start', duration: 1134}, {name:'Studying', duration: 1134}]

        },
        {
          name: 'Drive',
          songs:[{name:'Please', duration: 1134}, {name:'Drive', duration: 1134}, {name:'Safe', duration: 1134}]

        },
        {
          name: 'Relax',
          songs:[{name:'Refrain', duration: 1134}, {name:'From', duration: 1134}, {name:'Working', duration: 1134}]


        }

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
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {return songs.concat(eachPlaylist.songs)} ,[])
    console.log(allSongs)
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0 )
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
       <input type='text'/>
       Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    console.log(this.props)
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
      serverData: {}
    };
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({serverData: fakeServerData})
    }, 2000)
  }

  render() {
    return(

      <div className="App">
      {this.state.serverData.user ?
      <div>
      <h1>{ this.state.serverData.user.name}' Playlist</h1>
      <PlaylistCounter playlists={this.state.serverData.user.playlists} />
      <HoursCounter playlists= {this.state.serverData.user.playlists}/>
      <Filter/>
      {this.state.serverData.user.playlists.map(playlist => <Playlist playlist={playlist}/> )}
      </div> : <h1>'loding'</h1>
    }
    </div>
    );
  }
}

export default App;
