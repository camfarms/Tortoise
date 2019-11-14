import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TableBody } from '@material-ui/core';

const spotifyWebApi = new Spotify()

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

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

function createData(song, artist, albumCover, preview, addToQueue) {
    return { song, artist ,albumCover, preview, addToQueue };
}

const rows = [];
const classes = useStyles();

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
                    var previewUrl = response.tracks[i].previewUrl;
                    var albumArtUrl = response.tracks[i].album.images[0].url;
                    rows.push(createData(track_name, artist, albumArtUrl, previewUrl));
                }
            }
            console.log(rows);
        });
    }

    componentDidMount() {
        this.setSeeds();
    }

    render() {
        this.getRecommendations(10);
        if (rows.length > 0) {
            return (
                <Paper className={classes.root}>
                    <Table className={classes.table} aria-label="Song Recommendations">
                        <TableHead>
                            <TableRow>
                                <TableCell>Song Name</TableCell>
                                <TableCell align="right">Artist</TableCell>
                                <TableCell align="right">Album Art</TableCell>
                                <TableCell align="right">Preview</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.song}>
                                    <TableCell component="th" scope="row">{row.song}</TableCell>
                                    <TableCell align="right">{row.artist}</TableCell>
                                    <TableCell align="right">{row.albumCover}</TableCell>
                                    <TableCell align="right">{row.addToQueue}</TableCell>
                                </TableRow>  
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            );
        }
        else {
            return (
                <div>
                    "error"
                </div>
            )
        }
    }

}

export default Recommendations;