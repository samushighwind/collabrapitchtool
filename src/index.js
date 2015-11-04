import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Soundfont from 'soundfont-player';

export default class PitchTool extends Component {

  constructor (props) {
    super(props);
    this.state = {
      instrument: 'sine',
      source: null
    };
  }

  componentDidMount () {
    const soundfont = new Soundfont(new AudioContext());
    this.instruments = {
      sine: soundfont.instrument(),
      piano: soundfont.instrument('acoustic_grand_piano')
    };
  }

  playNote = (e) => {
    if(!note) var note = 'C4';
    this.endNote();
    console.log('playing');
    this.setState({
      source: this.instruments[this.state.instrument].play(note, 0)
    }, function () {
      console.log('source recorded');
    });
  };

  endNote = () => {
    console.log('ending');
    if (this.state.source) {
      this.state.source.stop();
      this.setState({
        source: null
      }, () => {
        console.log('source now null');
      });
    }
  };

  swapInstrument = (instrument) => {
    if (this.state.instrument === instrument) return;
    if (Object.keys(this.instruments).indexOf(instrument) !== -1) {
      this.setState({
        instrument: instrument
      });
    }
  };

  render () {
    return <div onMouseDown={this.playNote} onMouseUp={this.endNote} onMouseLeave={this.endNote}>HERE I AM</div>;
  }
};