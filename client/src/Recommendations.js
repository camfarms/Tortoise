import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';


const spotifyWebApi = new Spotify()

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var req = new XMLHttpRequest();
        req.responseType = 'json';
        req.onreadystatechange = function() {
            if (req.readyState === 4 && req.status === 200)
                aCallback(req.response);
        }
        var accessToken = spotifyWebApi.getAccessToken();
        req.open('GET', aUrl, true);
        req.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        req.send();
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

    getRecommendations(limit) {
        var client = new HttpClient();
        var baseUrl = 'https://api.spotify.com/v1/recommendations?';
        var artistSeed = 'seed_artists=';
        var trackSeed = 'seed_tracks=';
        var limitParam = 'limit=' + limit;
        var getUrl = baseUrl;
        if (!(this.state.artistSeed === undefined) && !(this.state.trackSeed === undefined)) {
            getUrl = getUrl + artistSeed + this.state.artistSeed + '&' + trackSeed + this.state.trackSeed + '&' + limitParam;
        }
        client.get(getUrl, function(response) {
            var recs = [];
            if (!(response === undefined)) {
                for (var i = 0; i < limit; i++) {
                    var name = response.tracks[i].name;
                    var artist = response.tracks[i].artists[0].name;
                    var track = name + " - " + artist;
                    console.log(track);
                }
            }
        });
    }

    componentDidMount() {
        this.getSeeds();
        
    }

    render() {
        this.getRecommendations(10);
        return (
            <div>
                test: {this.state.tracks}
            </div>
        )
    }

}

export default Recommendations;