import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Soundfont from 'soundfont-player';
import classNames from 'classnames';

class Key extends Component {

  constructor (props) {
    super(props);
    this.state = {
      pressed: false
    };
  }

  playNote = (e) => {
    this.setState({
      pressed: true
    });
    this.props.playNote(e, this.props.note);
  };

  releaseNote = (e) => {
    this.setState({
      pressed: false
    });
    this.props.releaseNote(e, this.props.note);
  };

  getKeyNameDiv () {
    if (!this.props.showKeyName) {
      return null;
    }
    return (
      <div className='key-name'>{ this.props.keyName }</div>
    );
  }

  render () {
    return (
      <div className={ classNames(`${ this.props.color }-key`, { 'pressed': this.state.pressed }) }
           onMouseDown={ this.playNote }
           onMouseUp={ this.releaseNote }
           onMouseLeave={ this.releaseNote }>
        { this.getKeyNameDiv() }

      </div>
    );
  }
}

export default class extends Component {

  constructor (props) {
    super(props);
    this.NOTES = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb', 'B'];
    this.state = {
      instrument: 'sawtooth',
      lastNote: null,
      sources: {},
      stopNoteTimeouts: {},
      octave: 3
    };
  }

  componentDidMount () {
    this.context = new AudioContext();
    const soundfont = new Soundfont(this.context);
    /* wrapper needed to get the soundfont-specific play
     * method and not the default.
     */
    const playWrapper = function (note, time, duration) {
      /* 'this' is the instrument from which playWrapper is
       * being called.
       */
      return this.sound.play(note, time, duration);
    };
    this.instruments = {
      sine: {
        play: soundfont.instrument().play,
        isPolyphonic: false,
        delay: 0.15
      },
      piano: {
        sound: soundfont.instrument('acoustic_grand_piano'),
        play: playWrapper,
        isPolyphonic: true,
        delay: 1.5
      },
      square: {
        sound: soundfont.instrument('lead_1_square'),
        play: playWrapper,
        isPolyphonic: false,
        delay: 0.15
      },
      sawtooth: {
        sound: soundfont.instrument('lead_2_sawtooth'),
        play: playWrapper,
        isPolyphonic: false,
        delay: 0.15
      }
    };
  }

  playNote = (e, note) => {
    const noteToStop = this.instruments[this.state.instrument].isPolyphonic ? note : this.state.lastNote;
    this.stopNote(noteToStop, () => {
      const sources = this.state.sources;
      sources[note] = this.instruments[this.state.instrument].play(note, 0);
      this.setState({
        lastNote: note,
        sources: sources
      });
    });
  };

  releaseNote = (e, note) => {
    if (!this.state.sources[note]) {
      return;
    }
    const state = this.state;
    if (note) {
      state.stopNoteTimeouts[note] = setTimeout(() => {
        this.stopNote(note);
      }, this.instruments[state.instrument].delay * 1000);
    }
  };

  stopNote = (note, cb) => {
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
      }, cb);
    } else if (cb) {
      cb();
    }
  };

  swapInstrument = (instrument) => {
    if (this.state.instrument === instrument) {
      return;
    }
    if (Object.keys(this.instruments).indexOf(instrument) !== -1) {
      this.setState({
        instrument: instrument
      });
    }
  };

  shiftOctave = (direction) => {
    let octave = this.state.octave;
    if (direction === 'up' && octave < 6) {
      octave++;
    } else if (direction === 'down' && octave > 1) {
      octave--;
    }
    this.setState({
      octave: octave
    });
  };

  render () {
    const n = 2; // number of octaves to display
    const notes = [];
    for (let i = this.state.octave, limit = i + n; i < limit; i++) {
      this.NOTES.forEach((note) => {
        notes.push(`${ note }${ i }`);
      });
    }
    notes.push(`${ this.NOTES[0] }${ this.state.octave + n }`);

    const keys = notes.map((note) => {
      const isFlat = note.indexOf('b') !== -1;
      const color = isFlat ? 'black' : 'white';
      const showKeyName = !isFlat;
      return (
        <Key key={ note }
             note={ note }
             color={ color }
             keyName={ note.replace(/\d/, '') }
             showKeyName={ showKeyName }
             playNote={ this.playNote }
             releaseNote={ this.releaseNote } />
      );
    });

    return (
      <div className={ classNames('keys', 'selection-disabled') }>
        { keys }
      </div>
    );
  }
};