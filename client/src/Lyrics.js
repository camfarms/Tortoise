import React, {Component} from 'react';
import './Lyrics.css';

class Lyrics extends Component {

    //Make sure to pass the spotify api object as a prop
    constructor() {
        super();
        this.state = {
            artist: undefined,
            song: undefined,
            LyricsInfo: ""
        }
        this.refreshArtist = this.refreshArtist.bind(this);
    }

    /*Get the artist object of the main artist of the currently playing song.
      Returns a Promise that resolves if this component's state is succesfully updated to the currently
      playing artist.
      Returns a Promise so that you can ensure the currently playing artist is retrieved before doing anything
      else such as looking up that artist's info. */
    
      async getSong() {
        var self = this;
        return new Promise(function(resolve, reject) {
            if (!(self.props.spotifyApi === undefined)) {
                self.props.spotifyApi.getMyCurrentPlaybackState().then((response) => {
                    if (!(response.item === undefined)) {
                        self.setState({ 
                            song: response.item.name
                        })
                        resolve();
                    } else {reject()}
                })
            } else {reject()}
        });
    }

    async getArtist() {
        var self = this;
        return new Promise(function(resolve, reject) {
            if (!(self.props.spotifyApi === undefined)) {
                self.props.spotifyApi.getMyCurrentPlaybackState().then((response) => {
                    if (!(response.item === undefined)) {
                        self.setState({ 
                            artist: response.item.artists[0].name
                        })
                        resolve();
                    } else {reject()}
                })
            } else {reject()}
        });
    }
    
    async requestLyricsFor(title) {
        if (!title) throw new TypeError('Input value was undefined!');
        return new Promise(async function(resolve, reject) {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        var response = await fetch(proxyurl + `https://some-random-api.ml/lyrics/?title=${title}`)
        response = await response.json()
        resolve(response.lyrics)
    })
    }

    async getLyrics(){
      var self = this;
      var Song = self.state.song;
      var Artist = self.state.artist
    //   const solenolyrics= require("solenolyrics"); 
      var lyrics = await this.requestLyricsFor(self.state.song + " " + self.state.artist); 
      self.setState({LyricsInfo: lyrics})
      
      console.log(lyrics)
    }


    async refreshArtist() {
        await this.getSong();
        await this.getArtist();
        this.getLyrics();        
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    render() {
        return (
            <div class='lyrics'>
                {this.state.LyricsInfo.split('\n').map((item, i) => (
                    <p key={i} text-align='center'>{item}</p>
                ))}
            </div>

        )
    }

}

export default Lyrics;