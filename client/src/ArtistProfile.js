import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';
import { string } from 'prop-types';


class ArtistProfile extends Component {

    constructor() {
        super();
        this.state = {
            artist: undefined,
            artistInfo: "",
            spotifyApi: undefined
        }
    }

    //Get the artist object of the main artist of the currently playing song
    getArtist() {
        if (!(this.state.spotifyApi === undefined)) {
            this.state.spotifyApi.getMyCurrentPlaybackState().then((response) => {
                if (!(response.item === undefined)) {
                    this.setState({ 
                        artist: response.item.artists[0].name
                    })
                }
            })
        }
    }

    getArtistInfo() {
         var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro' +
            '&explaintext&redirects=1&origin=*&indexpageids&titles=' + this.state.artist;
        fetch(wikiApiUrl)
        .then(response => {
            return response.json();
        }).then(data => {
            var pageid = data.query.pageids[0];
            let info = data['query']['pages'][pageid]['extract'];
            this.setState({artistInfo: info});
        })
    }

    refreshArtist() {
        this.getArtist();
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
            <div>
                <h1>Artist: {this.state.artist} </h1>
                {this.state.artistInfo}
            </div>

        )
    }

}

export default ArtistProfile;