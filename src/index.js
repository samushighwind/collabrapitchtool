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
           onTouchStart={ this.playNote }
           onMouseEnter={ this.playNote }
           onMouseUp={ this.releaseNote }
           onTouchEnd={ this.releaseNote }
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
      actualWidth: null,
      isVisible: !props.includeVisibilityToggle
    };
  }

  componentDidMount () {
    this.computeActualWidth();
    window.addEventListener('resize', this.computeActualWidth);

    const ctx = new AudioContext();
    Soundfont.nameToUrl = function (name) {
      return 'https://cdn.collabramusic.com/soundfonts/' + name + '-mp3.js';
    };
    const soundfont = new Soundfont(ctx);
    // in returned function, 'this' refers to the invoking instrument object.
    var getWavePlayFn = function (vcoType) {
      return function (note) {
        return this.player.play(note, ctx.currentTime, -1, {
          vcoType: vcoType,
          gain: 0.08
        });
      };
    };
    this.instruments = {
      piano: {
        player: soundfont.instrument('acoustic_grand_piano'),
        // necessary to get soundfont-specific play method
        play: function (note) {
          return this.player.play(note, ctx.currentTime, -1);
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
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    if ((e.type === 'mouseenter' && !this.state.isMouseDown) || (e.type !== 'mouseenter' && this.state.isMouseDown)) {
      return false;
    }
    const noteToStop = this.instruments[this.state.instrument].isPolyphonic ? note : this.state.lastNote;
    this.stopNote(noteToStop, () => {
      // releaseNote call will be removed if multitouch is supported
      this.releaseNote(this.state.lastNote, () => {
        const sources = this.state.sources;
        sources[note] = this.instruments[this.state.instrument].play(note);
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

  toggleVisibility = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
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

  renderPitchTool () {
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
    if (this.state.isVisible) {
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
    }

    const outerStyle = {
      width: this.state.widthAndHeight.width,
      height: this.state.widthAndHeight.height
    };
    if (!this.state.isVisible) {
      outerStyle.display = 'none';
    }
    if (this.props.includeVisibilityToggle) {
      outerStyle.position = 'absolute';
      outerStyle.top = '36px';
      outerStyle.right = '0';
      outerStyle.boxShadow = '5px 5px 30px -5px #333';
    }

    return (
      <div className={ this.CONTAINER_CLASS_NAME } style={ outerStyle }>
        <div className={ classNames('pitch-tool', 'selection-disabled', { [widthClass]: widthClass }) }>
          <div className='control-box'>
            <div className='controls'>
              <div className='controls-octave'>
                <span className='control-label'>Octave: </span>
                <span className={ classNames('octave-shifter', { 'exhausted': this.state.octave <= this.OCTAVE_MIN }) }
                      title='Shift down one octave'
                      onClick={ this.shiftOctave.bind(this, 'left') }>{ '\u2039' }</span>
                <span className='current-octave'>{ this.state.octave }</span>
                <span className={ classNames('octave-shifter', { 'exhausted': this.state.octave >= this.OCTAVE_MAX - n }) }
                      title='Shift up one octave'
                      onClick={ this.shiftOctave.bind(this, 'right') }>{ '\u203a' }</span>
              </div>
              <div className='controls-instrument'>
                <span className='control-label'>Sound: </span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'piano' }) }
                      title='Piano'
                      onClick={ this.swapInstrument.bind(this, 'piano') }>
                  <svg version='1.1'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='25 -24.2 149.2 149.2'>
                    <path d={ `M120.6,51c-7.4-3-14-16-17.5-25.1C96.1,8,89.4-2.9,69.8-2.4C44.9-1.8,43.4,21.3,43.4,21.3v77.2c0,3.2,2.6,5.8,5.8,5.8h97.5
                               c3.2,0,6.4-2.5,6.9-5.7c2-13,4.3-43.6-19-44.8C128.8,53.6,124.2,52.5,120.6,51z M147.3,98.8H48.1V77.1h5.7V93H60V77.1h5.1V93h6.2
                               V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h8.7L147.3,98.8
                               L147.3,98.8z` }/>
                  </svg>
                </span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'sine' }) }
                      title='Sine Wave'
                      onClick={ this.swapInstrument.bind(this, 'sine') }>
                  <svg version='1.1'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 827.389 561.869'>
                    <path d={ `M325.609,561.869c-93.906,0-106.291-122.96-117.219-231.44c-4.472-44.406-14.942-148.407-34.956-148.407
                               c-27.979,0-34.437,11.342-48.983,44.148c-15.519,34.995-38.971,87.872-118.641,87.872c-3.21,0-5.811-2.603-5.811-5.798V253.67
                               c0-3.208,2.601-5.813,5.811-5.813c35.214,0,42.826-14,58.134-48.517c14.744-33.252,37.031-83.506,109.49-83.506
                               c79.872,0,90.521,105.719,100.818,207.956c6.894,68.456,17.311,171.896,51.359,171.896c9.387,0,20.705-19.523,29.532-50.935
                               c11.963-42.601,18.828-102.906,25.457-161.223C397.187,137.724,412.854,0,509.299,0c98.542,0,107.222,121.698,114.866,229.076
                               c4.281,60.038,10.745,150.775,36.665,150.775c37.168,0,44.343-14.317,58.354-49.63c13.023-32.804,32.691-82.363,101.614-82.363
                               c3.634,0,6.59,2.956,6.59,6.594v52.996c0,3.649-2.956,6.595-6.59,6.595c-21.914,0-26.824,7.175-40.095,40.59
                               c-14.447,36.393-36.282,91.403-119.874,91.403c-87.555,0-95.601-112.762-102.68-212.254c-5.331-74.667-11.94-167.592-48.854-167.592
                               c-37.362,0-53.362,140.735-62.927,224.813C430.522,430.293,415.549,561.869,325.609,561.869z` }/>
                  </svg>
                </span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'square' }) }
                      title='Square Wave'
                      onClick={ this.swapInstrument.bind(this, 'square') }>
                  <svg version='1.1'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 275.164 186.819'>
                    <path d={ `M148.088,175.813c0,6.079-4.928,11.007-11.006,11.007H79.83c-6.078,0-11.006-4.928-11.006-11.007V60.536
                               H35.599v32.985c0,6.08-4.928,11.008-11.006,11.008H2.751c-1.521,0-2.751-1.233-2.751-2.751V85.266c0-1.52,1.231-2.752,2.751-2.752
                               h10.835V49.529c0-6.078,4.928-11.007,11.006-11.007H79.83c6.079,0,11.007,4.929,11.007,11.007v115.277h35.239v-153.8
                               C126.076,4.928,131.003,0,137.082,0h57.252c6.078,0,11.006,4.928,11.006,11.006v115.255h34.708V93.521
                               c0-6.078,4.928-11.007,11.006-11.007h21.357c1.521,0,2.752,1.232,2.752,2.752v16.511c0,1.518-1.23,2.751-2.752,2.751h-10.351v32.74
                               c0,6.078-4.928,11.006-11.007,11.006h-56.72c-6.079,0-11.007-4.928-11.007-11.006V22.013h-35.239V175.813z` }/>
                  </svg>
                </span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'triangle' }) }
                      title='Triangle Wave'
                      onClick={ this.swapInstrument.bind(this, 'triangle') }>
                  <svg version='1.1'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 307.071 208.386'>
                    <path d={ `M122.984,208.369c-0.195,0.012-0.39,0.018-0.585,0.018c-4.759,0-9.116-2.759-11.137-7.107L55.057,80.275
                               l-20.535,30.742c-2.279,3.413-6.111,5.458-10.214,5.458H3.07c-1.695,0-3.07-1.374-3.07-3.071V94.981c0-1.696,1.375-3.071,3.07-3.071
                               h14.67l29.034-43.458c2.468-3.691,6.771-5.746,11.158-5.425c4.426,0.342,8.324,3.047,10.196,7.071l52.739,113.54L175.903,8.186
                               c1.676-4.732,6.061-7.968,11.077-8.174c4.96-0.216,9.65,2.663,11.707,7.242l54.169,120.653l20.559-30.567
                               c2.282-3.392,6.103-5.428,10.193-5.428H304c1.695,0,3.071,1.375,3.071,3.071v18.422c0,1.697-1.376,3.071-3.071,3.071h-13.851
                               l-29.25,43.494c-2.492,3.701-6.798,5.752-11.236,5.38c-4.444-0.378-8.333-3.137-10.163-7.203L188.831,45.277L133.98,200.2
                               C132.316,204.908,127.968,208.134,122.984,208.369z` }/>
                  </svg>
                </span>
                <span className={ classNames('instrument-selector', { 'selected': this.state.instrument === 'sawtooth' }) }
                      title='Sawtooth Wave'
                      onClick={ this.swapInstrument.bind(this, 'sawtooth') }>
                  <svg version='1.1'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 271.242 184.157'>
                    <path d={ `M135.406,184.157c-3.03,0-5.992-1.271-8.089-3.618L34.928,77.232v14.982c0,5.993-4.858,10.851-10.85,10.851
                               H2.712c-1.499,0-2.712-1.216-2.712-2.712V84.077c0-1.498,1.213-2.712,2.712-2.712h10.516V48.826c0-4.498,2.776-8.529,6.98-10.134
                               c4.196-1.611,8.958-0.453,11.957,2.903l92.389,103.307V10.852c0-4.498,2.776-8.529,6.979-10.135
                               c4.193-1.61,8.958-0.453,11.957,2.903l92.389,103.306V92.214c0-5.992,4.858-10.85,10.85-10.85h21.801
                               c1.499,0,2.712,1.214,2.712,2.712v16.276c0,1.497-1.213,2.712-2.712,2.712h-10.951v32.268c0,4.498-2.775,8.529-6.979,10.135
                               c-4.198,1.605-8.961,0.45-11.957-2.903L146.253,39.258v134.049c0,4.497-2.776,8.529-6.98,10.134
                               C138.015,183.923,136.704,184.157,135.406,184.157z` }/>
                  </svg>
                </span>
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

  render () {
    if (this.props.includeVisibilityToggle) {
      return (
        <div style={ { position: 'relative', display: 'inline-block' } }>
          <button className={ classNames('pitch-tool-toggle', 'btn', 'btn-default', { 'open': this.state.isVisible }) }
               title={ this.state.isVisible ? 'Close pitch tool' : 'Open pitch tool' }
               onClick={ this.toggleVisibility }>
            <svg version='1.1'
                 xmlns='http://www.w3.org/2000/svg'
                 viewBox='0 0 100 100'>
              <path d={ `M79.609,27.625L47.056,60.178c-1.996,1.996-5.238,1.996-7.234,0c-1.996-1.996-1.996-5.238,0-7.234
                         l32.553-32.553l-7.234-7.234L32.588,45.71c-4.709,4.709-5.654,11.72-2.95,17.419L17.847,74.92c-0.84-0.223-1.707-0.38-2.617-0.38
                         C9.58,74.539,5,79.119,5,84.77C5,90.42,9.58,95,15.23,95s10.23-4.58,10.23-10.23c0-0.91-0.157-1.777-0.38-2.617l11.791-11.791
                         c5.699,2.704,12.71,1.759,17.419-2.95l32.553-32.553L79.609,27.625z` }/>
              <path d={ `M33.576,33.009L28.85,31.05c3.137-7.573,9.034-13.472,16.607-16.609l1.958,4.726
                         C41.103,21.782,36.188,26.697,33.576,33.009z` }/>
              <path d={ `M68.955,71.148l-1.958-4.726c6.309-2.613,11.224-7.525,13.837-13.839l4.726,1.958
                         C82.422,62.116,76.522,68.015,68.955,71.148z` }/>
              <path d={ `M72.866,80.589l-1.958-4.726c8.832-3.662,15.71-10.54,19.367-19.369L95,58.452
                         C90.819,68.545,82.961,76.408,72.866,80.589z` }/>
              <path d={ `M24.134,29.097l-4.726-1.958C23.587,17.046,31.45,9.184,41.545,5l1.958,4.726
                         C34.669,13.385,27.791,20.266,24.134,29.097z` }/>
            </svg>
            Pitch Tool
          </button>
          { this.renderPitchTool() }
        </div>
      );
    }
    return this.renderPitchTool();
  }
};