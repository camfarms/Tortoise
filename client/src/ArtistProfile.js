import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';


class ArtistProfile extends Component {

    constructor() {
        super();
        this.state = {
            artist: undefined,
        }
    }

    //Get the artist object of the main artist of the currently playing song
    getArtist() {
        if (!(this.props.spotifyApi === undefined)) {
            this.props.spotifyApi.getMyCurrentPlaybackState().then((response) => {
                if (!(response.item === undefined)) {
                    this.setState({ 
                        artist: response.item.artists[0].name
                    })
                }
            })
        }
    }

    componentDidUpdate() {
        this.getArtist();
    }

    render() {

        return (
            <div>
                Artist: {this.state.artist}
            </div>
        )
    }

}

export default ArtistProfile;