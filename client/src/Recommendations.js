import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify()

var baseUrl = 'https://api.spotify.com/v1/recommendations?';
// function that makes http  requests
// TODO: make other http functions when needed
// TODO: move this out into own "util" js file
var HttpClient = function() {
    this.get = function(url, callback) {
        var req = new XMLHttpRequest();
        req.responseType = 'json';
        req.onreadystatechange = function() {
            if (req.readyState === 4 && req.status === 200)
                callback(req.response);
        }
        var accessToken = spotifyWebApi.getAccessToken();
        req.open('GET', url, true);
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

    // function that gets current playback state and sets state of track seed and artist seed
    setSeeds() {
        if (!(this.props.spotifyApi === undefined)) {
            this.props.spotifyApi.getMyCurrentPlaybackState().then((response) => {
                if (!(response.item === undefined)) {
                    this.setState( {
                        trackSeed : response.item.id,
                        // TODO: handle array states for songs with multiple artists
                        artistSeed : response.item.artists[0].id
                    })
                }
            })
        }
    }
    // function that gets recommendations based on seeds set and returns the indicated number of song recs
    // TODO: idea? return each track as iterable list or something for use in 'row' of recommendation table
    getRecommendations(limit) {
        var client = new HttpClient();
        var getUrl = baseUrl;
        if (!(this.state.artistSeed === undefined) && !(this.state.trackSeed === undefined)) {
            getUrl = getUrl + 'seed_artists=' + this.state.artistSeed + 
                            '&seed_tracks=' + this.state.trackSeed + 
                            '&limit=' + limit;
        }
        client.get(getUrl, function(response) {
            var recs = [];
            if (!(response === undefined)) {
                for (var i = 0; i < limit; i++) {
                    var track_name = response.tracks[i].name;
                    var artist = response.tracks[i].artists[0].name;
                    var track = track_name + " - " + artist;
                    var preview_url = response.tracks[i].preview_url;
                    var album_art_url = response.tracks[i].album.images[0].url;
                    console.log(track);
                    console.log('preview: ' + preview_url);
                    console.log('album art: ' + album_art_url);
                }
            }
        });
    }

    componentDidMount() {
        this.setSeeds();
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