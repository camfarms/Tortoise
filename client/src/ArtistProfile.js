import React, {Component} from 'react';
import './ArtistProfile.css';


/* This class is a react component containing the artist profile functionality. In order for this component
    to function properly, you must pass it a Spotify object from spotify-web-api-js through props.spotifyApi.
    Assuming a valid and functional Spotify object is passed in, this allows this component to view what song 
    the user is currently playing.
    
    To refresh the artist profile, simply call refreshArtist()*/
class ArtistProfile extends Component {

    //Make sure to pass the spotify api object as a prop
    constructor() {
        super();
        this.state = {
            artist: undefined,
            artistInfo: ""
        }
        this.refreshArtist = this.refreshArtist.bind(this);
    }

    /*Get the artist object of the main artist of the currently playing song.
      Returns a Promise that resolves if this component's state is succesfully updated to the currently
      playing artist.
      Returns a Promise so that you can ensure the currently playing artist is retrieved before doing anything
      else such as looking up that artist's info. */
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

    /*Updates this component's state so that it has the currently playing artist's info. */
    getArtistInfo() {
        var self = this;
        var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro' +
            '&explaintext&redirects=1&origin=*&indexpageids&titles=' + self.state.artist;
        fetch(wikiApiUrl)
        .then(response => {
            return response.json();
        }).then(data => {
            var pageid = data.query.pageids[0];
            let info = data['query']['pages'][pageid]['extract'];
            self.setState({artistInfo: info});
        })
    }


    async refreshArtist() {
        await this.getArtist();
        this.getArtistInfo();        
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    render() {

        return (
            <div class='artist'>
                {this.state.artistInfo}
            </div>

        )
    }

}

export default ArtistProfile;