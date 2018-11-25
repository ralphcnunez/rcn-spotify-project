import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'
import PropTypes from 'prop-types';

const size = {
  width: '100%',
  height: 300,
};
const view = 'list'; // or 'coverart'
const theme = 'black'; // or 'white'
const dimensionPropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
const sizePresets = {
  large: {
    width: 300,
    height: 380,
  },
  compact: {
    width: 300,
    height: 80,
  },
};
let currentPlaylist = 'spotify:user:313hzr2u5agbn4wtex6kuvmft4va:playlist:2yvROxduXs9XtFqQN70oIH'



class SpotifyPlayer extends Component {

  render() {
    SpotifyPlayer.propTypes = {

      // Spotify URI
      uri: PropTypes.string.isRequired,

      // Size as either a preset or as custom dimensions
      size: PropTypes.oneOfType([
        PropTypes.oneOf(['large', 'compact']),
        PropTypes.shape({
          width: dimensionPropType,
          height: dimensionPropType,
        }),
      ]),

      // View
      view: PropTypes.oneOf(['list', 'coverart']),

      // Theme
      theme: PropTypes.oneOf(['black', 'white']),
    };

    SpotifyPlayer.defaultProps = {
      size: 'large',
      view: 'list',
      theme: 'black',
    };
    const { uri, view, theme } = this.props;
    let { size } = this.props;

    if (typeof size === 'string') {
      size = sizePresets[size];
    }

    return (
      <iframe
        title="Spotify"
        className="SpotifyPlayer"
        src={`https://embed.spotify.com/?uri=${uri}&view=${view}&theme=${theme}`}
        width={size.width}
        height={size.height}
        frameBorder="0"
        allowtransparency="true"
      />
    );
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
    currentPlaylist = playlist.itemURI
    return (
     <div style={{color: 'white', width:'20%', display:'inline-block'}}>
     <img src= {playlist.imageUrl} style={{width: '150px', 'paddingTop': '20px' }} />
      <h3> {playlist.name} </h3>
      <ul>{playlist.songs.map(song => console.log(song)  )}
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
    return;




  fetch('https://api.spotify.com/v1/me',{
    headers: { 'Authorization': 'Bearer ' + accessToken }})
    .then(response => response.json())
    .then(data => this.setState({
      user:{
        name: data.display_name
      }
    }))
  

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer' + accessToken}
        })
        let trackDataPromise = responsePromise
        .then(response=> response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = Promise.all(trackDataPromises)
    let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData
        })
        return playlists
      })
      return playlistsPromise
    })
      .then(data => this.setState({
        playlists: data.items.map(item => {
          console.log(item.uri)
            return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: [],
            itemURI: item.uri
          }
          })
        }))
    }

  render() {
    let currentPlaylist = 'spotify:user:313hzr2u5agbn4wtex6kuvmft4va:playlist:2yvROxduXs9XtFqQN70oIH'

    let playlistToRender =
    this.state.user && this.state.playlists
     ?  this.state.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase()))
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
        <SpotifyPlayer

          uri={currentPlaylist}
          size={size}
          view={view}
          theme={theme}


           />

        </div> : <button onClick={()=> window.location = 'http://localhost:8888/login'}
        style ={{padding: '20px', 'fontSize': '50px', 'marginTop': '20px'}}>
        Sign in with Spotify </button>
      }
      </div>
    );
  }
}

export default App;
