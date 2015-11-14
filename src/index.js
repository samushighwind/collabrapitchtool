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
    this.props.playNote(this.props.note, e);
  };

  releaseNote = (e) => {
    this.setState({
      pressed: false
    });
    this.props.releaseNote(this.props.note, e);
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
      instrument: 'piano',
      lastNote: null,
      sources: {},
      stopNoteTimeouts: {},
      octave: 3
    };
  }

  componentDidMount () {
    this.context = new AudioContext();
    const soundfont = new Soundfont(this.context);
    // in returned function, 'this' refers to the invoking instrument object.
    var getWavePlayFn = function (vcoType) {
      return function (note, time, duration) {
        return this.player.play(note, time, duration, { vcoType: vcoType });
      };
    };
    this.instruments = {
      piano: {
        player: soundfont.instrument('acoustic_grand_piano'),
        // necessary to get soundfont-specific play method
        play: function (note, time, duration) {
          return this.player.play(note, time, duration);
        },
        isPolyphonic: true,
        delay: 1.5
      },
      sine: {
        player: soundfont.instrument(),
        play: getWavePlayFn('sine'),
        isPolyphonic: false,
        delay: 0.15
      },
      square: {
        player: soundfont.instrument(),
        play: getWavePlayFn('square'),
        isPolyphonic: false,
        delay: 0.15
      },
      triangle: {
        player: soundfont.instrument(),
        play: getWavePlayFn('triangle'),
        isPolyphonic: false,
        delay: 0.15
      },
      sawtooth: {
        player: soundfont.instrument(),
        play: getWavePlayFn('sawtooth'),
        isPolyphonic: false,
        delay: 0.15
      }
    };
  }

  playNote = (note) => {
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

  releaseNote = (note) => {
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

  swapInstrument (instrument) {
    if (this.state.instrument === instrument) {
      return;
    }
    if (Object.keys(this.instruments).indexOf(instrument) !== -1) {
      this.setState({
        instrument: instrument
      });
    }
  };

  shiftOctave (direction) {
    let octave = this.state.octave;
    if (direction === 'left' && octave > 1) {
      octave--;
    } else if (direction === 'right' && octave < 6) {
      octave++;
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
      <div className={ classNames('pitch-tool', 'selection-disabled') }>
        <div className='control-box'>
          <div className='controls'>
            <div className='controls-octave'>
              <span>Octave: </span>
              <span className='octave-shifter'
                    onClick={ this.shiftOctave.bind(this, 'left') }>{ ' < ' }</span>
              <span>{ this.state.octave }</span>
              <span className='octave-shifter'
                    onClick={ this.shiftOctave.bind(this, 'right') }>{ ' > ' }</span>
            </div>
            <div className='controls-instrument'>
              <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'piano' }) }
                    title='Piano'
                    onClick={ this.swapInstrument.bind(this, 'piano') }>{ ' \ud83c\udfb9 ' }</span>
              <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'sine' }) }
                    title='Sine Wave'
                    onClick={ this.swapInstrument.bind(this, 'sine') }>{ ' \u223F ' }</span>
            </div>
          </div>
        </div>
        <div className='keys'>
          { keys }
        </div>
      </div>
    );
  }
};