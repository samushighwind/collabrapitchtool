(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-dom', 'soundfont-player', 'classnames'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-dom'), require('soundfont-player'), require('classnames'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global.ReactDOM, global.Soundfont, global.classNames);
    global.index = mod.exports;
  }
})(this, function (exports, module, _react, _reactDom, _soundfontPlayer, _classnames) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var _ReactDOM = _interopRequireDefault(_reactDom);

  var _Soundfont = _interopRequireDefault(_soundfontPlayer);

  var _classNames = _interopRequireDefault(_classnames);

  var Key = (function (_Component) {
    _inherits(Key, _Component);

    function Key(props) {
      var _this = this;

      _classCallCheck(this, Key);

      _get(Object.getPrototypeOf(Key.prototype), 'constructor', this).call(this, props);

      this.playNote = function (e) {
        _this.setState({
          pressed: true
        });
        console.log('down');
        _this.props.playNote(e, _this.props.note);
      };

      this.releaseNote = function (e) {
        _this.setState({
          pressed: false
        });
        console.log('up');
        _this.props.releaseNote(e, _this.props.note);
      };

      this.state = {
        pressed: false
      };
    }

    _createClass(Key, [{
      key: 'getKeyNameDiv',
      value: function getKeyNameDiv() {
        if (!this.props.showKeyName) {
          return null;
        }
        return _React['default'].createElement(
          'div',
          { className: 'key-name' },
          this.props.keyName
        );
      }
    }, {
      key: 'render',
      value: function render() {
        return _React['default'].createElement(
          'div',
          { className: (0, _classNames['default'])(this.props.color + '-key', { 'pressed': this.state.pressed }),
            onMouseDown: this.playNote,
            onMouseUp: this.releaseNote,
            onMouseLeave: this.releaseNote },
          this.getKeyNameDiv()
        );
      }
    }]);

    return Key;
  })(_react.Component);

  var _default = (function (_Component2) {
    _inherits(_default, _Component2);

    function _default(props) {
      var _this2 = this;

      _classCallCheck(this, _default);

      _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this, props);

      this.playNote = function (e, note) {
        var noteToStop = _this2.instruments[_this2.state.instrument].isPolyphonic ? note : _this2.state.lastNote;
        _this2.stopNote(noteToStop, function () {
          var sources = _this2.state.sources;
          sources[note] = _this2.instruments[_this2.state.instrument].play(note, 0);
          _this2.setState({
            lastNote: note,
            sources: sources
          });
        });
      };

      this.releaseNote = function (e, note) {
        if (!_this2.state.sources[note]) {
          return;
        }
        var state = _this2.state;
        if (note) {
          state.stopNoteTimeouts[note] = setTimeout(function () {
            _this2.stopNote(note);
          }, _this2.instruments[state.instrument].delay * 1000);
        }
      };

      this.stopNote = function (note, cb) {
        var stopNoteTimeouts = _this2.state.stopNoteTimeouts;
        var timeout = stopNoteTimeouts[note];
        if (timeout) {
          clearTimeout(timeout);
          stopNoteTimeouts[note] = null;
          _this2.setState({
            stopNoteTimeouts: stopNoteTimeouts
          });
        }
        var sources = _this2.state.sources;
        var source = _this2.state.sources[note];
        if (source) {
          source.stop(_this2.context.currentTime);
          sources[note] = null;
          _this2.setState({
            sources: sources
          }, cb);
        } else if (cb) {
          cb();
        }
      };

      this.swapInstrument = function (instrument) {
        if (_this2.state.instrument === instrument) {
          return;
        }
        if (Object.keys(_this2.instruments).indexOf(instrument) !== -1) {
          _this2.setState({
            instrument: instrument
          });
        }
      };

      this.shiftOctave = function (direction) {
        var octave = _this2.state.octave;
        if (direction === 'up' && octave < 6) {
          octave++;
        } else if (direction === 'down' && octave > 1) {
          octave--;
        }
        _this2.setState({
          octave: octave
        });
      };

      this.NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
      this.state = {
        instrument: 'sawtooth',
        lastNote: null,
        sources: {},
        stopNoteTimeouts: {},
        octave: 3
      };
    }

    _createClass(_default, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.context = new AudioContext();
        var soundfont = new _Soundfont['default'](this.context);
        /* wrapper needed to get the soundfont-specific play
         * method and not the default.
         */
        var playWrapper = function playWrapper(note, time, duration) {
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
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var n = 2; // number of octaves to display
        var notes = [];

        var _loop = function (i, limit) {
          _this3.NOTES.forEach(function (note) {
            notes.push('' + note + i);
          });
        };

        for (var i = this.state.octave, limit = i + n; i < limit; i++) {
          _loop(i, limit);
        }
        notes.push('' + this.NOTES[0] + (this.state.octave + n));

        var keys = notes.map(function (note) {
          var isFlat = note.indexOf('b') !== -1;
          var color = isFlat ? 'black' : 'white';
          var showKeyName = !isFlat;
          return _React['default'].createElement(Key, { key: note,
            note: note,
            color: color,
            keyName: note.replace(/\d/, ''),
            showKeyName: showKeyName,
            playNote: _this3.playNote,
            releaseNote: _this3.releaseNote });
        });
        return _React['default'].createElement(
          'div',
          { className: (0, _classNames['default'])('keys', 'selection-disabled') },
          keys
        );
      }
    }]);

    return _default;
  })(_react.Component);

  module.exports = _default;
  ;
});

