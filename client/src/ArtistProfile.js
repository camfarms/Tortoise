import React, {Component} from 'react';



class ArtistProfile extends Component {

    //Make sure to pass the spotify api object as a prop
    constructor() {
        super();
        this.state = {
            artist: undefined,
            artistInfo: "",
            spotifyApi: undefined
        }
        this.refreshArtist = this.refreshArtist.bind(this);
    }

    //Get the artist object of the main artist of the currently playing song
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

    async getArtistInfo() {
        var self = this;
        return new Promise(function(resolve, reject) {
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
            resolve();
        });
    }


    async refreshArtist() {
        await this.getArtist();
        await this.getArtistInfo();
        return new Promise(function(resolve, reject){resolve()});
        
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