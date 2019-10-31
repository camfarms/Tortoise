import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import NavBar from './components/headerComponent/navBar.js';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import 'bootstrap/dist/css/bootstrap.min.css';

const spotifyWebApi = new Spotify()

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
      }
      this.setState({
        nowPlaying: {
          name: tempName,
          image: tempImage
        }
      })
    })
  }

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
      <Button onClick={() => this.getNowPlaying()}> 
        Check Now Playing
      </Button>
      <div> 
        <ButtonGroup>
          <Button>Lyrics</Button>
          <Button>Artist Facts</Button>
          <Button>Song Facts</Button>
          <Button> Visuals (Fractals)</Button>
          <Button> Settings</Button>
        </ButtonGroup>
      </div>
    </div>
  );
  }
}

  
export default App;

