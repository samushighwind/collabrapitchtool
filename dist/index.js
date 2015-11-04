(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-dom', 'soundfont-player'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-dom'), require('soundfont-player'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global.ReactDOM, global.Soundfont);
    global.index = mod.exports;
  }
})(this, function (exports, module, _react, _reactDom, _soundfontPlayer) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var _ReactDOM = _interopRequireDefault(_reactDom);

  var _Soundfont = _interopRequireDefault(_soundfontPlayer);

  var PitchTool = (function (_React$Component) {
    _inherits(PitchTool, _React$Component);

    function PitchTool(props) {
      var _this = this;

      _classCallCheck(this, PitchTool);

      _get(Object.getPrototypeOf(PitchTool.prototype), 'constructor', this).call(this, props);

      this.playNote = function (e) {
        if (!note) var note = 'C4';
        _this.endNote();
        console.log('playing');
        _this.setState({
          source: _this.instruments[_this.state.instrument].play(note, 0)
        }, function () {
          console.log('source recorded');
        });
      };

      this.endNote = function () {
        console.log('ending');
        if (_this.state.source) {
          _this.state.source.stop();
          _this.setState({
            source: null
          }, function () {
            console.log('source now null');
          });
        }
      };

      this.swapInstrument = function (instrument) {
        if (_this.state.instrument === instrument) return;
        if (Object.keys(_this.instruments).indexOf(instrument) !== -1) {
          _this.setState({
            instrument: instrument
          });
        }
      };

      this.state = {
        instrument: 'sine',
        source: null
      };
    }

    _createClass(PitchTool, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var soundfont = new _Soundfont['default'](new AudioContext());
        this.instruments = {
          sine: soundfont.instrument(),
          piano: soundfont.instrument('acoustic_grand_piano')
        };
      }
    }, {
      key: 'render',
      value: function render() {
        return _React['default'].createElement(
          'div',
          { onMouseDown: this.playNote, onMouseUp: this.endNote, onMouseLeave: this.endNote },
          'HERE I AM'
        );
      }
    }]);

    return PitchTool;
  })(_React['default'].Component);

  module.exports = PitchTool;
  ;
});

