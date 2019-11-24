import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import NavBar from './components/headerComponent/navBar.js';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArtistProfile from './ArtistProfile.js';
import Lyrics from './Lyrics.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import RecommendationsTable from './Recommendations/Recommendations.js';
import {createMuiTheme} from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { green } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const spotifyWebApi = new Spotify()

var timeRemaining = undefined;

//theme variables
var themeMode = "dark";
var primary = green;
var secondary = grey;

var theme = createMuiTheme( {
  palette: {
    type: themeMode,
    primary: primary,
    secondary: secondary,
  },
});

class App extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    this.state ={
      loggedIn: params.access_token? true: false,
      nowPlaying: {
        name: 'Not Checked',
        artistName: 'Not Checked',
        songInfo: '',
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

    if (!(Lyrics === undefined)) {
      this.Lyrics.refreshArtist();
      
    }

    spotifyWebApi.getMyCurrentPlaybackState()
    .then((response) => {
      var tempName;
      var tempArtist;
      var tempImage;
      var songInfo;
      if (response.item === undefined) {
        tempName = 'You are not currently playing any songs on Spotify';
        tempArtist = 'You are not currently playing any songs on Spotify';
        songInfo = '';
        tempImage = undefined;
      }
      else {
        tempName = response.item.name;
        tempArtist = response.item.artists[0].name;
        tempImage = response.item.album.images[0].url;
        songInfo = tempName + " - " + tempArtist;
        var songProgress = response.progress_ms;
        var songDuration = response.item.duration_ms;
        timeRemaining = songDuration - songProgress;
      }
      this.setState({
        nowPlaying: {
          name: tempName,
          artistName: tempArtist,
          image: tempImage,
          songInfo: songInfo
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

  themeModeToggle() {
    if (themeMode == "dark") {
      themeMode = "light";
      theme = createMuiTheme( {
        palette: {
          type: themeMode,
          primary: primary,
          secondary: secondary,
        },
      });
    }
    else {
      themeMode = "dark";
      theme = createMuiTheme( {
        palette: {
          type: themeMode,
          primary: primary,
          secondary: secondary,
        },
      });
    }
    this.forceUpdate();
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
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <NavBar />
        </div>
        <a href='http://localhost:4002'> 
        <Button variant="contained" color="primary">Login with Spotify</Button> 
        </a>
        <div> 
          <img src={this.state.nowPlaying.image } style = {{windows: 100}}/>
        </div>
        <div><Button>Now Playing: {this.state.nowPlaying.songInfo} </Button></div>
        <ButtonGroup
          variant="contained"
          color="primary">
          <Button onClick={() => this.getNowPlaying()}> 
            Check Now Playing
          </Button>
          <Button onClick={() => this.getRecommendations()}>
            Get Song Recommendations
          </Button>
        </ButtonGroup>
        <div>
        <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon color='primary'/>}
            >
              <Typography>Artist Profile</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails padding="0">
            <ArtistProfile spotifyApi={spotifyWebApi} onRef={ref => (this.ArtistProfile = ref)} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>

        <div>
        <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon color='primary'/>}
            >
              <Typography>Lyrics</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails padding="0">
            <Lyrics spotifyApi={spotifyWebApi} onRef={ref => (this.Lyrics = ref)} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>

        <div>
          <ExpansionPanel margin="0" onClick={() => this.getNowPlaying()}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon color='primary'/>}
            >
              <Typography>Song Recommendations</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <RecommendationsTable/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div>
        <Button variant="contained" color='primary' onClick={() => this.themeModeToggle()}>Theme Mode</Button>
        </div>
      </MuiThemeProvider>
    </div>
  );
  }
}
  
export default App;

