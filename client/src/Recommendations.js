import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';


const spotifyWebApi = new Spotify()

var HttpClient = function() {
    this.get = function(accessToken, aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        anHttpRequest.send(null);
    }
}

class Recommendations extends Component {

    constructor() {
        super();
        this.state = {
            trackSeed : undefined,
            artistSeed: undefined,
            tracks : undefined,
        }
    }


    getSeeds() {
        if (!(this.props.spotifyApi === undefined)) {
            this.props.spotifyApi.getMyCurrentPlaybackState().then((response) => {
                if (!(response.item === undefined)) {
                    this.setState( {
                        trackSeed : response.item.id,
                        artistSeed : response.item.artists[0].id
                    })
                }
            })
        }
    }

    getRecommendations() {
        var client = new HttpClient();
        var baseUrl = "https://api.spotify.com/v1/recommendations?";
        var artistSeed = "seed_artists=";
        var trackSeed = "seed_tracks=";
        var getUrl = baseUrl;
        if (!(this.state.artistSeed === undefined) && !(this.state.trackSeed === undefined)) {
            getUrl = getUrl + artistSeed + this.state.artistSeed + trackSeed + this.state.trackSeed;
        }
        //console.log('"' + getUrl + '"');
        if (!this.props.spotifyApi === undefined) {
            var auth = spotifyWebApi.getAccessToken();
            console.log(auth);
            /*
            this.props.spotifyApi.getAccessToken().then((auth) => {
                if (!(auth === undefined)) {
                    console.log("auth", auth);
                }
                console.log("undefined");
            });
            */
            client.get(auth, getUrl, function(response) {
                if (!(response === undefined)) {
                    this.setState( {
                        tracks: response.tracks
                    })
                }
            })
        }

    }

    componentDidUpdate() {
        this.getSeeds();
        this.getRecommendations();
    }

    render() {

        return (
            <div>
                test: {this.state.tracks}
            </div>
        )
    }

}

export default Recommendations;