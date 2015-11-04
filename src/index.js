import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Soundfont from 'soundfont-player';

export default class PitchTool extends Component {

  constructor (props) {
    super(props);
    this.state = {
      instrument: 'piano',
      lastNote: null,
      sources: {},
      stopNoteTimeouts: {}
    };
  }

  componentDidMount () {
    this.context = new AudioContext();
    const soundfont = new Soundfont(this.context);
    this.instruments = {
      sine: {
        play: soundfont.instrument().play,
        isPolyphonic: false,
        delay: 1.5
      },
      piano: {
        play: soundfont.instrument('acoustic_grand_piano').play,
        isPolyphonic: true,
        delay: 1.5
      }
    };
  }

  playNote = (e) => {
    if(!note) var note = e.target.id || 'C4';
    this.endNote();
    this.lastNote = note;
    this.setState({
      source: this.instruments[this.state.instrument].play(note, 0)
    });
  };

  releaseNote = (e) => {
    const state = this.state;
    const note = state.lastNote;
    if (note) {
      const currentSource = state.sources[note];
      state.stopNoteTimeouts[note] = setTimeout(() => {
        this.stopNote(note);
      }, this.instruments[state.instrument].delay * 1000);
    }
  };

  stopNote = (note) => {
    const stopNoteTimeouts = this.state.stopNoteTimeouts;
    const timeout = stopNoteTimeouts[note];
    if (timeout) {
      clearTimeout(timeout);
      stopNoteTimeouts[note] = null;
      this.setState({
        stopNoteTimeouts: stopNoteTimeouts
      });
    }
    const sources = this.state.sources;
    const source = this.state.sources[note];
    if (source) {
      source.stop(this.context.currentTime);
      sources[note] = null;
      this.setState({
        sources: sources
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
    return (
      <div>
        <div id='C4' onMouseDown={this.playNote} onMouseUp={this.releaseNote} onMouseLeave={this.releaseNote}>ONE</div>
        <div id='G3' onMouseDown={this.playNote} onMouseUp={this.releaseNote} onMouseLeave={this.releaseNote}>TWO</div>
      </div>
    );
  }
};