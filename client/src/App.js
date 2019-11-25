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
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Vibrant from 'node-vibrant';

const spotifyWebApi = new Spotify()

var timeRemaining = undefined;
var imageUrl = '';

//theme variables
var adaptive = false;
var themeMode = "dark";
var primary = '#4caf50';
var secondary = grey;

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var theme = createMuiTheme( {
  palette: {
    type: themeMode,
    primary: {
      main: primary
    },
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
        imageUrl = tempImage;
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
    if (adaptive == true) {
      this.setColor();
    }
    var self = this
    setTimeout(function() {
      self.getNowPlaying();
      if (adaptive == true) {
        self.setColor();
      }
    }, 250);
    clearTimeout();
    setTimeout(function() {
      self.getNowPlaying();
      if (adaptive == true) {
        self.setColor();
      }
    }, 500);
    clearTimeout();
  }

  defaultTheme() {
    adaptive = false;
    primary = '#4caf50';
    theme = createMuiTheme( {
      palette: {
        type: themeMode,
        primary: {
          main: primary
        },
        secondary: secondary,
      },
    });
    console.log(adaptive);
    this.forceUpdate();
  }

  setColor() {
    console.log(imageUrl);
    if (imageUrl != '') {
      Vibrant.from(imageUrl).getPalette().then((palette) => primary = rgbToHex(Math.round(palette.Vibrant._rgb[0]), Math.round(palette.Vibrant._rgb[1]), Math.round(palette.Vibrant._rgb[2])));
      theme = createMuiTheme( {
        palette: {
          type: themeMode,
          primary: {
            main: primary
          },
          secondary: secondary,
        },
      });
      this.forceUpdate();
    }
  }

  updateTheme() {
    adaptive = true;
    console.log(adaptive);
    this.setColor();
    var self = this
    setTimeout(function() {
      self.setColor();
    }, 250);
    clearTimeout();
  }

  themeModeToggle() {
    if (themeMode == "dark") {
      themeMode = "light";
      theme = createMuiTheme( {
        palette: {
          type: themeMode,
          primary: {
            main: primary
          },
          secondary: secondary,
        },
      });
    }
    else {
      themeMode = "dark";
      theme = createMuiTheme( {
        palette: {
          type: themeMode,
          primary: {
            main: primary
          },
          secondary: secondary,
        },
      });
    }
    this.forceUpdate();
  }

  // to update whenever new song starts playing
  componentDidUpdate() {
    console.log(timeRemaining);
    if (timeRemaining != 0) {
      const timer = setTimeout(() => {
        this.getNowPlaying();
        if (adaptive == true) {
          this.updateTheme();
        }
      }, timeRemaining);
      return() => clearTimeout(timer);
    }
    else {
      const timer = setTimeout(() => {
        console.log("error");
      }, 5000);
      return() => clearTimeout(timer);
    }
  }
  
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
          <Button variant="contained" color="primary" onClick={() => this.getNowPlaying()}>Refresh</Button>
        </div>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={4} >
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
            </Grid>
            <Grid item xs={4}>
              <img src={this.state.nowPlaying.image } width={300} height={300} mode='fit' style = {{windows: 100}}/>
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
          </Grid>
        </div>
        <div><Button variant='outlined'>{this.state.nowPlaying.songInfo}</Button></div>
        <div>
          <ExpansionPanel>
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
          <ButtonGroup variant='contained' color='primary'>
            <Button onClick={() => this.defaultTheme()}>Default Theme</Button>
            <Button onClick={() => this.updateTheme()}>Adaptive Theme</Button>
          </ButtonGroup>
        </div>
        <div>
          <Button variant='outlined' color='primary' onClick={() => this.themeModeToggle()}>Dark/Light Mode Toggle</Button>
        </div>
      </MuiThemeProvider>
    </div>
  );
  }
}
  
export default App;

