import React from 'react';
import App from './App.js';
import ArtistProfile from './ArtistProfile.js';
import Adapter from 'enzyme-adapter-react-16';
import {render, fireEvent, getByRole} from '@testing-library/react';
import {shallow, configure, mount} from 'enzyme';
import Lyrics from './Lyrics.js';
import RecommendationsTable from './Recommendations/Recommendations.js';


/* Objects/Configurations necessary for tests */
configure({adapter: new Adapter()});
let pushatdesc = "Terrence LeVarr Thornton (born May 13, 1977), better known by his stage name Pusha T, is an American rapper, songwriter and record executive. He initially gained major recognition as half of hip hop duo Clipse, alongside his brother and fellow rapper No Malice, with whom he founded Re-Up Records. In September 2010, Thornton announced his signing to Kanye West's GOOD Music imprint, under the aegis of Def Jam Recordings. In March 2011, he released his first solo project, a mixtape titled Fear of God. Thornton released his debut solo album, My Name Is My Name, in October 2013. In November 2015, Kanye West appointed Pusha T to take over his role as president of GOOD Music.";
const blueURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEUAAP+KeNJXAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC";

//Create mock object for spotify api
const spotifyMock = {getMyCurrentPlaybackState: () => {
    return new Promise(function(resolve) {
        var response;
        response = {
            item: {
                name: 'Untouchable',
                artists: [{name: 'Pusha T'}, {name: 'The Beatles'}, {name: 'Wu-tang Clan'}],
                album: {
                    images: [{url: 'testurl'}]
                }
            }
        }
        resolve(response);
    });
}};

//Create mock with invalid songs
const spotifyInvalidMock = {getMyCurrentPlaybackState: () => {
    return new Promise(function(resolve) {
        var response;
        response = {
            item: undefined
        }
        resolve(response);
    });
}};


/* MAIN APP TESTS */
describe('App component tests', () => {

beforeEach(() => {
    jest.resetModules();
});

it('App component renders correctly', () => {
    const container = render(<App/>);
    expect(container.firstChild).toMatchSnapshot();
});

it('Test valid spotify api', () => {
    const validSpotifyApp = mount(<App/>);
    validSpotifyApp.instance().spotifyWebApi = spotifyMock;
    expect(validSpotifyApp.instance().state.nowPlaying.name).toEqual('Not Checked');
    validSpotifyApp.instance().getNowPlaying();  
});

it('assert no errors in methods', () => {
    const validSpotifyApp = mount(<App/>);
    validSpotifyApp.instance().refresh();
    validSpotifyApp.instance().defaultTheme();
    validSpotifyApp.instance().setColor();
    validSpotifyApp.instance().updateTheme();
    validSpotifyApp.instance().themeModeToggle();
    validSpotifyApp.instance().getNextSong();
    validSpotifyApp.instance().getLastSong();
    validSpotifyApp.instance().getPause();
    validSpotifyApp.instance().getShuffle();
});

it('test hotkeys', () => {
    const validSpotifyApp = mount(<App/>);
    validSpotifyApp.instance().onKeyDown('left', undefined, undefined);
    validSpotifyApp.instance().onKeyDown('right', undefined, undefined);
    validSpotifyApp.instance().onKeyDown('space', undefined, undefined);
    validSpotifyApp.instance().onKeyDown('s', undefined, undefined);
    validSpotifyApp.instance().onKeyDown('r', undefined, undefined);
});

it('Test with spotify api with invalid song objects', () => {
    const validSpotifyApp = mount(<App/>);
    validSpotifyApp.instance().spotifyWebApi = spotifyInvalidMock;
    validSpotifyApp.instance().getNowPlaying();
});

});


/* ARTIST PROFILE TESTS */
describe('Artist Profile component tests', () => {

it('Artist Profile component renders correctly', () => {
    const container = render(<ArtistProfile spotifyApi={undefined} onRef={ref => (undefined)}/>);
    expect(container.firstChild).toMatchSnapshot();
});

const wrapper1 = shallow(<ArtistProfile spotifyApi={spotifyMock} onRef={ref => (undefined)}/>);

wrapper1.instance().refreshArtist();

it('Spotify API is being properly read', () => {
    expect(wrapper1.instance().props.spotifyApi).not.toBe(undefined);
});

it('Successfully retrieves names from spotify api', () => {
    expect(wrapper1.instance().state.artist).toBe('Pusha T');
});

it('Successfully retrieves artist profile text', () => {
    const mockSuccessResponse = {
        "batchcomplete": "",
        "query": {
            "pageids": [
                "5957969"
            ],
            "pages": {
                "5957969": {
                    "pageid": 5957969,
                    "ns": 0,
                    "title": "Pusha T",
                    "extract": "Terrence LeVarr Thornton (born May 13, 1977), better known by his stage name Pusha T, is an American rapper, songwriter and record executive. He initially gained major recognition as half of hip hop duo Clipse, alongside his brother and fellow rapper No Malice, with whom he founded Re-Up Records. In September 2010, Thornton announced his signing to Kanye West's GOOD Music imprint, under the aegis of Def Jam Recordings. In March 2011, he released his first solo project, a mixtape titled Fear of God. Thornton released his debut solo album, My Name Is My Name, in October 2013. In November 2015, Kanye West appointed Pusha T to take over his role as president of GOOD Music."
                }
            }
        }
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
    
    expect(wrapper1.instance().state.artist).toBe('Pusha T');
    wrapper1.instance().getArtistInfo();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&indexpageids&titles=Pusha T');

    process.nextTick(() => {
        expect(wrapper1.instance().state.artistInfo).toEqual(pushatdesc);

        global.fetch.mockClear();
    })

    

});

it('Test invalid spotify api', () => {
    const wrapperInvalidAPI = shallow(<ArtistProfile spotifyApi={undefined} onRef={ref => (undefined)}/>);
    expect(wrapperInvalidAPI.instance().getArtist()).rejects.toEqual('Error: Invalid Spotify API');
});

it('Test invalid song', () => {
    const wrapperInvalidSong = shallow(<ArtistProfile spotifyApi={spotifyInvalidMock} onRef={ref => (undefined)}/>)
    expect(wrapperInvalidSong.instance().getArtist()).rejects.toEqual('Error: Invalid Song Object');
});

});

describe('Lyrics component tests', () => {

const lyricsWrapper = shallow(<Lyrics spotifyApi={spotifyMock} onRef={ref => (undefined)}/>);
lyricsWrapper.instance().refreshArtist();

it('Lyrics component renders correctly', () => {
    const container = render(<Lyrics spotifyApi={undefined} onRef={ref => (undefined)}/>);
    expect(container.firstChild).toMatchSnapshot();
});

it('Spotify API is being properly read', () => {
    expect(lyricsWrapper.instance().props.spotifyApi).not.toBe(undefined);
});
});
