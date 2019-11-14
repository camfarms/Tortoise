import React, {Component} from 'react';
import './Recommendations.css';
import Spotify from 'spotify-web-api-js';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { TableBody } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

const spotifyWebApi = new Spotify()

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    tableWrapper: {
        maxHeight: 440,
        overflow: 'auto',
    },
});

var baseUrl = 'https://api.spotify.com/v1/recommendations?';
// function that makes http  requests
// TODO: make other http functions when needed
// TODO: move this out into own "util" js file
class HttpClient {
    constructor() {
        this.get = function (url, callback) {
            var req = new XMLHttpRequest();
            req.responseType = 'json';
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200)
                    callback(req.response);
            };
            var accessToken = spotifyWebApi.getAccessToken();
            req.open('GET', url, true);
            req.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            req.send();
        };
    }
}

function createData(song, artist, albumCover, preview, addToQueue) {
    return { song, artist ,albumCover, preview, addToQueue };
}

const recs = [];
var trackSeed = undefined;
var artistSeed = undefined;

// function that gets current playback state and sets state of track seed and artist seed
function setSeeds() {
    if (!(spotifyWebApi === undefined)) {
        spotifyWebApi.getMyCurrentPlaybackState().then((response) => {
            if (!(response.item === undefined)) {
                    trackSeed = response.item.id;
                    // TODO: handle array states for songs with multiple artists
                    artistSeed  = response.item.artists[0].id;
            }
        })
    }
}
// function that gets recommendations based on seeds set and returns the indicated number of song recs
function getRecommendations(limit) {
    var client = new HttpClient();
    var getUrl = baseUrl;
    if (!(artistSeed === undefined) && !(trackSeed === undefined)) {
        getUrl = getUrl + 'seed_artists=' + artistSeed + 
                        '&seed_tracks=' + trackSeed + 
                        '&limit=' + limit +
                        '&market=US';
        client.get(getUrl, function(response) {
            if (!(response === undefined)) {
                for (var i = 0; i < limit; i++) {
                    var track_name = response.tracks[i].name;
                    var artist = response.tracks[i].artists[0].name;
                    if (response.tracks[i].preview_url != null) {
                        var previewUrl = response.tracks[i].preview_url;
                    }
                    else {
                        var previewUrl = "No Preview Availble";
                    }
                    var albumArtUrl = response.tracks[i].album.images[0].url;
                    recs.push(createData(track_name, artist, albumArtUrl, previewUrl));
                }
            }
            console.log(recs);
        });
    }
}

export default function RecommendationsTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const previewSongButton = <Icon>play_circle_outline</Icon>;

    setSeeds();
    getRecommendations(50);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (recs.length > 0) {
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} stickyHeader aria-label="Song Recommendations">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="left">Song Name</TableCell>
                                <TableCell align="left">Artist</TableCell>
                                <TableCell align="left">Preview</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                                <TableRow hover className="Row" key={row.song}>
                                    <TableCell className="AlbumCover" align="left">
                                        <div className="img"><img src={row.albumCover}/></div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">{row.song}</TableCell>
                                    <TableCell align="left">{row.artist}</TableCell>
                                    <TableCell align="left" component="a" href={row.preview}>
                                        <div>{previewSongButton}</div>
                                    </TableCell>
                                </TableRow>  
                            ))}
                        </TableBody>
                    </Table>
                    </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={recs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                'aria-label': 'next page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
        );
    }
    else {
        return (
            <div>
            </div>
        )
    }
}