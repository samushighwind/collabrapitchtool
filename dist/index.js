(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'react', 'react-dom', 'soundfont-player'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('react'), require('react-dom'), require('soundfont-player'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React, global.ReactDOM, global.soundfont);
    global.index = mod.exports;
  }
})(this, function (exports, _react, _reactDom, _soundfontPlayer) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _React = _interopRequireDefault(_react);

  var _ReactDOM = _interopRequireDefault(_reactDom);

  var _soundfont = _interopRequireDefault(_soundfontPlayer);
});

