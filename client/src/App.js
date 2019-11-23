import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import NavBar from './components/headerComponent/navBar.js';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ArtistProfile from './ArtistProfile.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import RecommendationsTable from './Recommendations/Recommendations.js';
import { withThemeCreator } from '@material-ui/styles';

const spotifyWebApi = new Spotify()

var timeRemaining = undefined;

class App extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    this.state ={
      loggedIn: params.access_token? true: false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      }
    }
    if (params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  getNowPlaying(){
    if (!(ArtistProfile === undefined)) {
      this.ArtistProfile.refreshArtist();
    }

    spotifyWebApi.getMyCurrentPlaybackState()
    .then((response) => {
      var tempName;
      var tempImage;
      if (response.item === undefined) {
        tempName = 'You are not currently playing any songs on Spotify';
        tempImage = undefined;
      }
      else {
        tempName = response.item.name;
        tempImage = response.item.album.images[0].url;
        var songProgress = response.progress_ms;
        var songDuration = response.item.duration_ms;
        timeRemaining = songDuration - songProgress;
      }
      this.setState({
        nowPlaying: {
          name: tempName,
          image: tempImage
        }
      })
    })
    
    
  }
  
  // to get currently playing song on load
  componentDidMount() {
    this.getNowPlaying();
  }

  getRecommendations() {
    this.getNowPlaying();
    var self = this
    setTimeout(function() {
      self.getNowPlaying();
    }, 250);
    clearTimeout();
    setTimeout(function() {
      self.getNowPlaying();
    }, 500);
    clearTimeout();
  }


  // to update whenever new song starts playing
  //TODO: make sure this doesn't break or else it will cause overflow error
  componentDidUpdate() {
    console.log(timeRemaining);
    if (timeRemaining != 0) {
      const timer = setTimeout(() => {
        this.getRecommendations();
      }, timeRemaining);
      return() => clearTimeout(timer);
    }
    else {
      const timer = setTimeout(() => {
      }, 3000);
      return() => clearTimeout(timer);
    }
  }
  

  //TODO: how to update each component when new song starts
  render(){
    return (
    <div className="App">
      <div>
        <NavBar />
      </div>
      <a href='http://localhost:4002'> 
      <Button variant="success">Login with Spotify</Button> 
      </a>
      <div> Now Playing: {this.state.nowPlaying.name} </div>
      <div> 
        <img src={this.state.nowPlaying.image } style = {{widows: 100}}/>
      </div>
      <div>
        <ArtistProfile spotifyApi={spotifyWebApi} onRef={ref => (this.ArtistProfile = ref)} />
      </div>
      <ButtonGroup>
        <Button onClick={() => this.getNowPlaying()}> 
          Check Now Playing
        </Button>
        <Button onClick={() => this.getRecommendations()}>
          Get Song Recommendations
        </Button>
      </ButtonGroup>
      <div>
        <RecommendationsTable/>
      </div>
    </div>
  );
  }
}
  
export default App;

