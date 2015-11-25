(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("soundfont-player"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "soundfont-player"], factory);
	else if(typeof exports === 'object')
		exports["react-metronome"] = factory(require("react"), require("react-dom"), require("soundfont-player"));
	else
		root["react-metronome"] = factory(root["react"], root["react-dom"], root["soundfont-player"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _soundfontPlayer = __webpack_require__(3);

	var _soundfontPlayer2 = _interopRequireDefault(_soundfontPlayer);

	var _classnames = __webpack_require__(4);

	var _classnames2 = _interopRequireDefault(_classnames);

	var Key = (function (_Component) {
	  _inherits(Key, _Component);

	  function Key(props) {
	    var _this = this;

	    _classCallCheck(this, Key);

	    _get(Object.getPrototypeOf(Key.prototype), 'constructor', this).call(this, props);

	    this.playNote = function (e) {
	      if (_this.props.playNote(_this.props.note, e)) {
	        _this.setState({
	          pressed: true
	        });
	      }
	    };

	    this.releaseNote = function () {
	      _this.setState({
	        pressed: false
	      });
	      _this.props.releaseNote(_this.props.note);
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
	      return _react2['default'].createElement(
	        'div',
	        { className: 'key-name' },
	        this.props.keyName
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2['default'].createElement(
	        'div',
	        { className: (0, _classnames2['default'])(this.props.color + '-key', { 'pressed': this.state.pressed }),
	          onMouseDown: this.playNote,
	          onTouchStart: this.playNote,
	          onMouseEnter: this.playNote,
	          onMouseUp: this.releaseNote,
	          onTouchEnd: this.releaseNote,
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

	    this.computeActualWidth = function () {
	      if (!_this2.doNotComputeWidthOnNextUpdate) {
	        window.requestAnimationFrame(function () {
	          _this2.setState({
	            actualWidth: _this2.refs.pitchToolContainer.getBoundingClientRect().width
	          });
	        });
	        _this2.doNotComputeWidthOnNextUpdate = true;
	      } else {
	        _this2.doNotComputeWidthOnNextUpdate = false;
	      }
	    };

	    this.playNote = function (note, e) {
	      if (e.type === 'touchstart') {
	        e.preventDefault();
	      }
	      if (e.type === 'mouseenter' && !_this2.state.isMouseDown || e.type !== 'mouseenter' && _this2.state.isMouseDown) {
	        return false;
	      }
	      var noteToStop = _this2.instruments[_this2.state.instrument].isPolyphonic ? note : _this2.state.lastNote;
	      _this2.stopNote(noteToStop, function () {
	        // releaseNote call will be removed if multitouch is supported
	        _this2.releaseNote(_this2.state.lastNote, function () {
	          var sources = _this2.state.sources;
	          sources[note] = _this2.instruments[_this2.state.instrument].play(note);
	          _this2.setState({
	            lastNote: note,
	            sources: sources,
	            isMouseDown: true
	          });
	        });
	      });
	      return true;
	    };

	    this.releaseNote = function (note, cb) {
	      if (!_this2.state.sources[note]) {
	        if (cb) {
	          cb();
	        }
	        return;
	      }
	      var state = _this2.state;
	      if (note) {
	        state.stopNoteTimeouts[note] = setTimeout(function () {
	          _this2.stopNote(note);
	        }, _this2.instruments[state.instrument].delay * 1000);
	      }
	      _this2.setState({
	        isMouseDown: false
	      }, cb);
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
	        source.stop();
	        sources[note] = null;
	        _this2.setState({
	          sources: sources
	        }, cb);
	      } else if (cb) {
	        cb();
	      }
	    };

	    this.toggleVisibility = function () {
	      _this2.setState({
	        isVisible: !_this2.state.isVisible
	      });
	    };

	    this.NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
	    this.OCTAVE_MIN = 1;
	    this.OCTAVE_MAX = 8;
	    this.NUMBER_OF_OCTAVES_TO_DISPLAY = 2;
	    this.BREAKPOINTS = [400, 600, 800, 1000, 1200, 1400, 1600, 1800];
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

	  _createClass(_default, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      __webpack_require__(5);
	      this.computeActualWidth();
	      window.addEventListener('resize', this.computeActualWidth);

	      var ctx = new AudioContext();
	      _soundfontPlayer2['default'].nameToUrl = function (name) {
	        return 'https://cdn.collabramusic.com/soundfonts/' + name + '-mp3.js';
	      };
	      var soundfont = new _soundfontPlayer2['default'](ctx);
	      // in returned function, 'this' refers to the invoking instrument object.
	      var getWavePlayFn = function getWavePlayFn(vcoType) {
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
	          play: function play(note) {
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
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this.computeActualWidth();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      window.removeEventListener('resize', this.computeActualWidth);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(props) {
	      this.setState({
	        widthAndHeight: this.getWidthAndHeight(props)
	      });
	    }
	  }, {
	    key: 'getWidthAndHeight',
	    value: function getWidthAndHeight(props) {
	      var getVal = function getVal(input) {
	        if (!input) {
	          return null;
	        } else if (!isNaN(input)) {
	          return input;
	        } else if (/(\d+)(px|%|vw|vh|vmin|vmax|em|ex|cm|mm|in|pt|pc|ch|rem)$/.test(input)) {
	          return input;
	        }
	        return null;
	      };
	      var getSuffix = function getSuffix(val) {
	        if (!val) {
	          return null;
	        } else if (!isNaN(val)) {
	          return 'px';
	        }
	        var intVal = parseInt(val);
	        var floatVal = parseFloat(val);
	        return val.replace(intVal.toString(), '').replace(floatVal.toString(), '');
	      };

	      var width = getVal(props.width);
	      var height = getVal(props.height);
	      var widthSuffix = getSuffix(width);
	      var heightSuffix = getSuffix(height);
	      var widthVal = width && isNaN(width) ? width.replace(widthSuffix, '') : width;
	      var heightVal = height && isNaN(height) ? height.replace(heightSuffix, '') : height;

	      if (width && height) {
	        return {
	          width: '' + widthVal + widthSuffix,
	          height: '' + heightVal + heightSuffix
	        };
	      }
	      if (width) {
	        return {
	          width: '' + widthVal + widthSuffix,
	          height: widthSuffix === '%' ? '100%' : '' + widthVal / 3 + widthSuffix
	        };
	      }
	      if (height) {
	        return {
	          width: heightSuffix === '%' ? '100%' : '' + heightVal * 3 + heightSuffix,
	          height: '' + heightVal + heightSuffix
	        };
	      }
	      return {
	        width: '100%',
	        height: '100%'
	      };
	    }
	  }, {
	    key: 'swapInstrument',
	    value: function swapInstrument(instrument) {
	      if (this.state.instrument === instrument) {
	        return;
	      }
	      if (Object.keys(this.instruments).indexOf(instrument) !== -1) {
	        this.setState({
	          instrument: instrument
	        });
	      }
	    }
	  }, {
	    key: 'shiftOctave',
	    value: function shiftOctave(direction) {
	      var octave = this.state.octave;
	      if (direction === 'left' && octave > this.OCTAVE_MIN) {
	        octave--;
	      } else if (direction === 'right' && octave < this.OCTAVE_MAX - this.NUMBER_OF_OCTAVES_TO_DISPLAY) {
	        octave++;
	      }
	      this.setState({
	        octave: octave
	      });
	    }
	  }, {
	    key: 'renderPitchTool',
	    value: function renderPitchTool() {
	      var _this3 = this;

	      var n = this.NUMBER_OF_OCTAVES_TO_DISPLAY; // number of octaves to display
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
	        return _react2['default'].createElement(Key, { key: note,
	          note: note,
	          color: color,
	          keyName: note.replace(/\d/, ''),
	          showKeyName: showKeyName,
	          playNote: _this3.playNote,
	          releaseNote: _this3.releaseNote });
	      });

	      var actualWidth = this.state.actualWidth;
	      var widthClass = '';
	      if (this.state.isVisible) {
	        if (actualWidth) {
	          var breakpoints = this.BREAKPOINTS;
	          for (var i = breakpoints.length - 1; i >= 0; i--) {
	            var breakpoint = breakpoints[i];
	            if (actualWidth >= breakpoint) {
	              widthClass = 'above-' + breakpoint;
	              break;
	            }
	          }
	        }
	      }

	      var outerStyle = {
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

	      return _react2['default'].createElement(
	        'div',
	        { ref: 'pitchToolContainer', className: 'pitch-tool-container', style: outerStyle },
	        _react2['default'].createElement(
	          'div',
	          { className: (0, _classnames2['default'])('pitch-tool', 'selection-disabled', _defineProperty({}, widthClass, widthClass)) },
	          _react2['default'].createElement(
	            'div',
	            { className: 'control-box' },
	            _react2['default'].createElement(
	              'div',
	              { className: 'controls' },
	              _react2['default'].createElement(
	                'div',
	                { className: 'controls-octave' },
	                _react2['default'].createElement(
	                  'span',
	                  { className: 'control-label' },
	                  'Octave: '
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('octave-shifter', { 'exhausted': this.state.octave <= this.OCTAVE_MIN }),
	                    title: 'Shift down one octave',
	                    onClick: this.shiftOctave.bind(this, 'left') },
	                  '‹'
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: 'current-octave' },
	                  this.state.octave
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('octave-shifter', { 'exhausted': this.state.octave >= this.OCTAVE_MAX - n }),
	                    title: 'Shift up one octave',
	                    onClick: this.shiftOctave.bind(this, 'right') },
	                  '›'
	                )
	              ),
	              _react2['default'].createElement(
	                'div',
	                { className: 'controls-instrument' },
	                _react2['default'].createElement(
	                  'span',
	                  { className: 'control-label' },
	                  'Sound: '
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('instrument-selector', { 'selected': this.state.instrument === 'piano' }),
	                    title: 'Piano',
	                    onClick: this.swapInstrument.bind(this, 'piano') },
	                  _react2['default'].createElement(
	                    'svg',
	                    { version: '1.1',
	                      xmlns: 'http://www.w3.org/2000/svg',
	                      viewBox: '25 -24.2 149.2 149.2' },
	                    _react2['default'].createElement('path', { d: 'M120.6,51c-7.4-3-14-16-17.5-25.1C96.1,8,89.4-2.9,69.8-2.4C44.9-1.8,43.4,21.3,43.4,21.3v77.2c0,3.2,2.6,5.8,5.8,5.8h97.5\n                               c3.2,0,6.4-2.5,6.9-5.7c2-13,4.3-43.6-19-44.8C128.8,53.6,124.2,52.5,120.6,51z M147.3,98.8H48.1V77.1h5.7V93H60V77.1h5.1V93h6.2\n                               V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h5.1V93h6.2V77.1h8.7L147.3,98.8\n                               L147.3,98.8z' })
	                  )
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('instrument-selector', { 'selected': this.state.instrument === 'sine' }),
	                    title: 'Sine Wave',
	                    onClick: this.swapInstrument.bind(this, 'sine') },
	                  _react2['default'].createElement(
	                    'svg',
	                    { version: '1.1',
	                      xmlns: 'http://www.w3.org/2000/svg',
	                      viewBox: '0 0 827.389 561.869' },
	                    _react2['default'].createElement('path', { d: 'M325.609,561.869c-93.906,0-106.291-122.96-117.219-231.44c-4.472-44.406-14.942-148.407-34.956-148.407\n                               c-27.979,0-34.437,11.342-48.983,44.148c-15.519,34.995-38.971,87.872-118.641,87.872c-3.21,0-5.811-2.603-5.811-5.798V253.67\n                               c0-3.208,2.601-5.813,5.811-5.813c35.214,0,42.826-14,58.134-48.517c14.744-33.252,37.031-83.506,109.49-83.506\n                               c79.872,0,90.521,105.719,100.818,207.956c6.894,68.456,17.311,171.896,51.359,171.896c9.387,0,20.705-19.523,29.532-50.935\n                               c11.963-42.601,18.828-102.906,25.457-161.223C397.187,137.724,412.854,0,509.299,0c98.542,0,107.222,121.698,114.866,229.076\n                               c4.281,60.038,10.745,150.775,36.665,150.775c37.168,0,44.343-14.317,58.354-49.63c13.023-32.804,32.691-82.363,101.614-82.363\n                               c3.634,0,6.59,2.956,6.59,6.594v52.996c0,3.649-2.956,6.595-6.59,6.595c-21.914,0-26.824,7.175-40.095,40.59\n                               c-14.447,36.393-36.282,91.403-119.874,91.403c-87.555,0-95.601-112.762-102.68-212.254c-5.331-74.667-11.94-167.592-48.854-167.592\n                               c-37.362,0-53.362,140.735-62.927,224.813C430.522,430.293,415.549,561.869,325.609,561.869z' })
	                  )
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('instrument-selector', { 'selected': this.state.instrument === 'square' }),
	                    title: 'Square Wave',
	                    onClick: this.swapInstrument.bind(this, 'square') },
	                  _react2['default'].createElement(
	                    'svg',
	                    { version: '1.1',
	                      xmlns: 'http://www.w3.org/2000/svg',
	                      viewBox: '0 0 275.164 186.819' },
	                    _react2['default'].createElement('path', { d: 'M148.088,175.813c0,6.079-4.928,11.007-11.006,11.007H79.83c-6.078,0-11.006-4.928-11.006-11.007V60.536\n                               H35.599v32.985c0,6.08-4.928,11.008-11.006,11.008H2.751c-1.521,0-2.751-1.233-2.751-2.751V85.266c0-1.52,1.231-2.752,2.751-2.752\n                               h10.835V49.529c0-6.078,4.928-11.007,11.006-11.007H79.83c6.079,0,11.007,4.929,11.007,11.007v115.277h35.239v-153.8\n                               C126.076,4.928,131.003,0,137.082,0h57.252c6.078,0,11.006,4.928,11.006,11.006v115.255h34.708V93.521\n                               c0-6.078,4.928-11.007,11.006-11.007h21.357c1.521,0,2.752,1.232,2.752,2.752v16.511c0,1.518-1.23,2.751-2.752,2.751h-10.351v32.74\n                               c0,6.078-4.928,11.006-11.007,11.006h-56.72c-6.079,0-11.007-4.928-11.007-11.006V22.013h-35.239V175.813z' })
	                  )
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('instrument-selector', { 'selected': this.state.instrument === 'triangle' }),
	                    title: 'Triangle Wave',
	                    onClick: this.swapInstrument.bind(this, 'triangle') },
	                  _react2['default'].createElement(
	                    'svg',
	                    { version: '1.1',
	                      xmlns: 'http://www.w3.org/2000/svg',
	                      viewBox: '0 0 307.071 208.386' },
	                    _react2['default'].createElement('path', { d: 'M122.984,208.369c-0.195,0.012-0.39,0.018-0.585,0.018c-4.759,0-9.116-2.759-11.137-7.107L55.057,80.275\n                               l-20.535,30.742c-2.279,3.413-6.111,5.458-10.214,5.458H3.07c-1.695,0-3.07-1.374-3.07-3.071V94.981c0-1.696,1.375-3.071,3.07-3.071\n                               h14.67l29.034-43.458c2.468-3.691,6.771-5.746,11.158-5.425c4.426,0.342,8.324,3.047,10.196,7.071l52.739,113.54L175.903,8.186\n                               c1.676-4.732,6.061-7.968,11.077-8.174c4.96-0.216,9.65,2.663,11.707,7.242l54.169,120.653l20.559-30.567\n                               c2.282-3.392,6.103-5.428,10.193-5.428H304c1.695,0,3.071,1.375,3.071,3.071v18.422c0,1.697-1.376,3.071-3.071,3.071h-13.851\n                               l-29.25,43.494c-2.492,3.701-6.798,5.752-11.236,5.38c-4.444-0.378-8.333-3.137-10.163-7.203L188.831,45.277L133.98,200.2\n                               C132.316,204.908,127.968,208.134,122.984,208.369z' })
	                  )
	                ),
	                _react2['default'].createElement(
	                  'span',
	                  { className: (0, _classnames2['default'])('instrument-selector', { 'selected': this.state.instrument === 'sawtooth' }),
	                    title: 'Sawtooth Wave',
	                    onClick: this.swapInstrument.bind(this, 'sawtooth') },
	                  _react2['default'].createElement(
	                    'svg',
	                    { version: '1.1',
	                      xmlns: 'http://www.w3.org/2000/svg',
	                      viewBox: '0 0 271.242 184.157' },
	                    _react2['default'].createElement('path', { d: 'M135.406,184.157c-3.03,0-5.992-1.271-8.089-3.618L34.928,77.232v14.982c0,5.993-4.858,10.851-10.85,10.851\n                               H2.712c-1.499,0-2.712-1.216-2.712-2.712V84.077c0-1.498,1.213-2.712,2.712-2.712h10.516V48.826c0-4.498,2.776-8.529,6.98-10.134\n                               c4.196-1.611,8.958-0.453,11.957,2.903l92.389,103.307V10.852c0-4.498,2.776-8.529,6.979-10.135\n                               c4.193-1.61,8.958-0.453,11.957,2.903l92.389,103.306V92.214c0-5.992,4.858-10.85,10.85-10.85h21.801\n                               c1.499,0,2.712,1.214,2.712,2.712v16.276c0,1.497-1.213,2.712-2.712,2.712h-10.951v32.268c0,4.498-2.775,8.529-6.979,10.135\n                               c-4.198,1.605-8.961,0.45-11.957-2.903L146.253,39.258v134.049c0,4.497-2.776,8.529-6.98,10.134\n                               C138.015,183.923,136.704,184.157,135.406,184.157z' })
	                  )
	                )
	              )
	            )
	          ),
	          _react2['default'].createElement(
	            'div',
	            { className: 'keys' },
	            keys
	          )
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.props.includeVisibilityToggle) {
	        return _react2['default'].createElement(
	          'div',
	          { style: { position: 'relative', display: 'inline-block' } },
	          _react2['default'].createElement(
	            'button',
	            { className: (0, _classnames2['default'])('pitch-tool-toggle', 'btn', 'btn-default', { 'open': this.state.isVisible }),
	              title: this.state.isVisible ? 'Close pitch tool' : 'Open pitch tool',
	              onClick: this.toggleVisibility },
	            _react2['default'].createElement(
	              'svg',
	              { version: '1.1',
	                xmlns: 'http://www.w3.org/2000/svg',
	                viewBox: '0 0 100 100' },
	              _react2['default'].createElement('path', { d: 'M79.609,27.625L47.056,60.178c-1.996,1.996-5.238,1.996-7.234,0c-1.996-1.996-1.996-5.238,0-7.234\n                         l32.553-32.553l-7.234-7.234L32.588,45.71c-4.709,4.709-5.654,11.72-2.95,17.419L17.847,74.92c-0.84-0.223-1.707-0.38-2.617-0.38\n                         C9.58,74.539,5,79.119,5,84.77C5,90.42,9.58,95,15.23,95s10.23-4.58,10.23-10.23c0-0.91-0.157-1.777-0.38-2.617l11.791-11.791\n                         c5.699,2.704,12.71,1.759,17.419-2.95l32.553-32.553L79.609,27.625z' }),
	              _react2['default'].createElement('path', { d: 'M33.576,33.009L28.85,31.05c3.137-7.573,9.034-13.472,16.607-16.609l1.958,4.726\n                         C41.103,21.782,36.188,26.697,33.576,33.009z' }),
	              _react2['default'].createElement('path', { d: 'M68.955,71.148l-1.958-4.726c6.309-2.613,11.224-7.525,13.837-13.839l4.726,1.958\n                         C82.422,62.116,76.522,68.015,68.955,71.148z' }),
	              _react2['default'].createElement('path', { d: 'M72.866,80.589l-1.958-4.726c8.832-3.662,15.71-10.54,19.367-19.369L95,58.452\n                         C90.819,68.545,82.961,76.408,72.866,80.589z' }),
	              _react2['default'].createElement('path', { d: 'M24.134,29.097l-4.726-1.958C23.587,17.046,31.45,9.184,41.545,5l1.958,4.726\n                         C34.669,13.385,27.791,20.266,24.134,29.097z' })
	            ),
	            'Pitch Tool'
	          ),
	          this.renderPitchTool()
	        );
	      }
	      return this.renderPitchTool();
	    }
	  }]);

	  return _default;
	})(_react.Component);

	exports['default'] = _default;
	;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = '';

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes += ' ' + arg;
				} else if (Array.isArray(arg)) {
					classes += ' ' + classNames.apply(null, arg);
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes += ' ' + key;
						}
					}
				}
			}

			return classes.substr(1);
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 5 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;