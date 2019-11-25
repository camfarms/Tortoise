import React from 'react';
import App from './App.js';
import ArtistProfile from './ArtistProfile.js';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import {render, fireEvent, getByRole} from '@testing-library/react';
import {shallow, configure} from 'enzyme';

/* Objects/Configurations necessary for tests */
configure({adapter: new Adapter()});
let pushatdesc = "Terrence LeVarr Thornton (born May 13, 1977), better known by his stage name Pusha T, is an American rapper, songwriter and record executive. He initially gained major recognition as half of hip hop duo Clipse, alongside his brother and fellow rapper No Malice, with whom he founded Re-Up Records. In September 2010, Thornton announced his signing to Kanye West's GOOD Music imprint, under the aegis of Def Jam Recordings. In March 2011, he released his first solo project, a mixtape titled Fear of God. Thornton released his debut solo album, My Name Is My Name, in October 2013. In November 2015, Kanye West appointed Pusha T to take over his role as president of GOOD Music.";

//Create mock object for spotify api
const spotifyMock = {getMyCurrentPlaybackState: () => {
    return new Promise(function(resolve) {
        var response;
        response = {
            item: {
                artists: [{name: 'Pusha T'}, {name: 'The Beatles'}, {name: 'Wu-tang Clan'}]
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

it('App component renders correctly', () => {
    const container = render(<App/>);
    expect(container.firstChild).toMatchSnapshot();
});

it('', () => {
    const validSpotifyApp = shallow(<App/>);
    //validSpotifyApp.instance().spotifyWebApi = spotifyMock;
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
console.log('artist refreshed');

it('Spotify API is being properly read', () => {
    expect(wrapper1.instance().props.spotifyApi).not.toBe(undefined);
});

it('Successfully retrieves names from spotify api', () => {
    console.log('testing artist name');
    expect(wrapper1.instance().state.artist).toBe('Pusha T');
});

it('Successfully retrieves artist profile text', () => {
    (async () => {
        await wrapper1.instance().refreshArtist();
        expect(wrapper1.instance().state.artistInfo).toBe(pushatdesc);
    });
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