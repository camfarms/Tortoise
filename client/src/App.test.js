import React from 'react';
import App from './App.js';
import ArtistProfile from './ArtistProfile.js';
import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';

describe('App component tests', () => {

it('renders App component', () => {
    const container = render(<App/>);
    expect(container.firstChild).toMatchSnapshot();
});

});

describe('Artist Profile component tests', () => {

it('renders Artist Profile', () => {
    const container = render(<ArtistProfile spotifyApi={undefined} onRef={ref => (undefined)}/>);
    expect(container.firstChild).toMatchSnapshot();
});

it('Test wikipedia calls', () => {
    const spotifyMock = class {
        getMyCurrentPlaybackState() {
            return new Promise(function(resolve, reject) {
                var response;
                response.item.artists[0].name = 'Wu-tang clan';
                return response;
                resolve();
            });
        }
    }
    const container = render(<ArtistProfile spotifyApi={spotifyMock} onRef={ref => (undefined)}/>);
    
});

});