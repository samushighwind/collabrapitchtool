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
    if (this.props.playNote(this.props.note, e)) {
      this.setState({
        pressed: true
      });
    }
  };

  releaseNote = () => {
    this.setState({
      pressed: false
    });
    this.props.releaseNote(this.props.note);
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
           onMouseEnter={ this.playNote }
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
    this.OCTAVE_MIN = 1;
    this.OCTAVE_MAX = 8;
    this.NUMBER_OF_OCTAVES_TO_DISPLAY = 2;
    this.BREAKPOINTS = [600, 800, 1000, 1200, 1400, 1600, 1800];
    this.CONTAINER_CLASS_NAME = 'pitch-tool-container';
    this.state = {
      instrument: 'sine',
      lastNote: null,
      sources: {},
      stopNoteTimeouts: {},
      octave: 4,
      isMouseDown: false,
      widthAndHeight: this.getWidthAndHeight(props),
      actualWidth: null
    };
  }

  componentDidMount () {
    this.computeActualWidth();
    window.addEventListener('resize', this.computeActualWidth);

    const soundfont = new Soundfont(new AudioContext());
    // in returned function, 'this' refers to the invoking instrument object.
    var getWavePlayFn = function (vcoType) {
      return function (note, time, duration) {
        return this.player.play(note, time, duration, { vcoType: vcoType, noStop: true });
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
        delay: 1.1
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

  componentDidUpdate () {
    this.computeActualWidth();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.computeActualWidth);
  }

  componentWillReceiveProps (props) {
    this.setState({
      widthAndHeight: this.getWidthAndHeight(props)
    });
  }

  getWidthAndHeight (props) {
    const getVal = (input) => {
      if (!input) {
        return null;
      } else if (!isNaN(input)) {
        return input;
      } else if (/(\d+)(px|%|vw|vh|vmin|vmax|em|ex|cm|mm|in|pt|pc|ch|rem)$/.test(input)) {
        return input;
      }
      return null;
    };
    const getSuffix = (val) => {
      if (!val) {
        return null;
      } else if (!isNaN(val)) {
        return 'px';
      }
      const intVal = parseInt(val);
      const floatVal = parseFloat(val);
      return val.replace(intVal.toString(), '').replace(floatVal.toString(), '');
    };

    const width = getVal(props.width);
    const height = getVal(props.height);
    const widthSuffix = getSuffix(width);
    const heightSuffix = getSuffix(height);
    const widthVal = width && isNaN(width) ? width.replace(widthSuffix, '') : width;
    const heightVal = height && isNaN(height) ? height.replace(heightSuffix, '') : height;

    if (width && height) {
      return {
        width: `${ widthVal }${ widthSuffix }`,
        height: `${ heightVal }${ heightSuffix }`
      };
    }
    if (width) {
      return {
        width: `${ widthVal }${ widthSuffix }`,
        height: widthSuffix === '%' ? '100%' : `${ widthVal / 3 }${ widthSuffix }`
      };
    }
    if (height) {
      return {
        width: heightSuffix === '%' ? '100%' : `${ heightVal * 3 }${ heightSuffix }`,
        height: `${ heightVal }${ heightSuffix }`
      };
    }
    return {
      width: '100%',
      height: '100%'
    };
  }

  computeActualWidth = () => {
    if (!this.doNotComputeWidthOnNextUpdate) {
      window.requestAnimationFrame(() => {
        this.setState({
          /* undesirable to break abstraction, but necessary since using refs inside
           * a separate component module will break React.
           */
          actualWidth: document.querySelector(`.${ this.CONTAINER_CLASS_NAME }`).getBoundingClientRect().width
        });
      });
      this.doNotComputeWidthOnNextUpdate = true;
    } else {
      this.doNotComputeWidthOnNextUpdate = false;
    }
  };

  playNote = (note, e) => {
    if ((e.type === 'mouseenter' && !this.state.isMouseDown) || (e.type !== 'mouseenter' && this.state.isMouseDown)) {
      return false;
    }
    const noteToStop = this.instruments[this.state.instrument].isPolyphonic ? note : this.state.lastNote;
    this.stopNote(noteToStop, () => {
      // releaseNote call will be removed if multitouch is supported
      this.releaseNote(this.state.lastNote, () => {
        const sources = this.state.sources;
        sources[note] = this.instruments[this.state.instrument].play(note, 0);
        this.setState({
          lastNote: note,
          sources: sources,
          isMouseDown: true
        });
      });
    });
    return true;
  };

  releaseNote = (note, cb) => {
    if (!this.state.sources[note]) {
      if (cb) {
        cb();
      }
      return;
    }
    const state = this.state;
    if (note) {
      state.stopNoteTimeouts[note] = setTimeout(() => {
        this.stopNote(note);
      }, this.instruments[state.instrument].delay * 1000);
    }
    this.setState({
      isMouseDown: false
    }, cb);
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
      source.stop();
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
    if (direction === 'left' && octave > this.OCTAVE_MIN) {
      octave--;
    } else if (direction === 'right' && octave < this.OCTAVE_MAX - this.NUMBER_OF_OCTAVES_TO_DISPLAY) {
      octave++;
    }
    this.setState({
      octave: octave
    });
  };

  render () {
    const n = this.NUMBER_OF_OCTAVES_TO_DISPLAY; // number of octaves to display
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

    const actualWidth = this.state.actualWidth;
    let widthClass = '';
    if (actualWidth) {
      const breakpoints = this.BREAKPOINTS;
      for (let i = breakpoints.length - 1; i >= 0; i--) {
        const breakpoint = breakpoints[i];
        if (actualWidth >= breakpoint) {
          widthClass = `above-${ breakpoint }`;
          break;
        }
      }
    }

    return (
      <div className={ this.CONTAINER_CLASS_NAME } style={ this.state.widthAndHeight }>
        <div className={ classNames('pitch-tool', 'selection-disabled', { [widthClass]: widthClass }) }>
          <div className='control-box'>
            <div className='controls'>
              <div className='controls-octave'>
                <span className='control-label'>Octave: </span>
                <span className={ classNames('octave-shifter', { 'exhausted': this.state.octave <= this.OCTAVE_MIN }) }
                      title='Shift down one octave'
                      onClick={ this.shiftOctave.bind(this, 'left') }>{ '\u2039' }</span>
                <span>{ this.state.octave }</span>
                <span className={ classNames('octave-shifter', { 'exhausted': this.state.octave >= this.OCTAVE_MAX - n }) }
                      title='Shift up one octave'
                      onClick={ this.shiftOctave.bind(this, 'right') }>{ '\u203a' }</span>
              </div>
              <div className='controls-instrument'>
                <span className='control-label'>Sound: </span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'piano' }) }
                      title='Piano'
                      onClick={ this.swapInstrument.bind(this, 'piano') }>{ '\ud83c\udfb9' }</span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'sine' }) }
                      title='Sine Wave'
                      onClick={ this.swapInstrument.bind(this, 'sine') }>{ '\u223F' }</span>
              </div>
            </div>
          </div>
          <div className='keys'>
            { keys }
          </div>
        </div>
      </div>
    );
  }
};