/*! @name videojs-landscape-fullscreen-2 @version 11.1.0 @license ISC */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js'), require('global/window')) :
  typeof define === 'function' && define.amd ? define(['video.js', 'global/window'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsLandscapeFullscreen2 = factory(global.videojs, global.window));
}(this, (function (videojs, window) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);
  var window__default = /*#__PURE__*/_interopDefaultLegacy(window);

  var defaults = {
    fullscreen: {
      enterOnRotate: true,
      alwaysInLandscapeMode: true,
      // MOD#0 true > false
      iOS: false
    }
  };
  var screen = window__default['default'].screen;
  /* eslint-disable no-console */
  // MOD#1 Remove others orientation checks

  var lockOrientationUniversal = function lockOrientationUniversal(mode) {
    screen.orientation.lock(mode).then(function () {}, // MOD#2 Remove log
    // err => { console.log(err); }
    function () {});
  }; // const unlockOrientationUniversal = () => {
  // 	screen.orientation.unlock();
  // }


  var angle = function angle() {
    // iOS
    if (typeof window__default['default'].orientation === 'number') {
      return window__default['default'].orientation;
    } // Android


    if (screen && screen.orientation && screen.orientation.angle) {
      return window__default['default'].orientation;
    } // MOD#3 Remove log
    // videojs.log('angle unknown');


    return 0;
  }; // Cross-compatibility for Video.js 5 and 6.
  // MOD#4 Add comment
  // const registerPlugin = videojs.registerPlugin || videojs.plugin;
  // const dom = videojs.dom || videojs;

  /**
   * Function to invoke when the player is ready.
   *
   * This is a great place for your plugin to initialize itself. When this
   * function is called, the player will have its DOM and child components
   * in place.
   *
   * @function onPlayerReady
   * @param    {Player} player
   *           A Video.js player object.
   *
   * @param    {Object} [options={}]
   *           A plain object containing options for the plugin.
   */


  var onPlayerReady = function onPlayerReady(player, options) {
    // MOD#5 Useless?
    // player.addClass('vjs-landscape-fullscreen');
    if (options.fullscreen.iOS && videojs__default['default'].browser.IS_IOS && videojs__default['default'].browser.IOS_VERSION > 9 && !player.el_.ownerDocument.querySelector('.bc-iframe')) {
      player.tech_.el_.setAttribute('playsinline', 'playsinline');

      player.tech_.supportsFullScreen = function () {
        return false;
      };
    }

    var rotationHandler = function rotationHandler() {
      var currentAngle = angle();

      if (currentAngle === 90 || // MOD#6 Add comment
      // || currentAngle === 270
      currentAngle === -90) {
        if (player.paused() === false) {
          player.requestFullscreen(); // MOD#7 Change function

          lockOrientationUniversal('landscape'); // screen.lockOrientationUniversal('landscape');
        }
      } // MOD#8 Add comment
      // if (
      //   currentAngle === 0
      //   // MOD#8 Add comment
      //   // || currentAngle === 180
      // ) {
      //   if (player.isFullscreen()) {
      //     player.exitFullscreen();
      //     // unlockOrientationUniversal()
      //   }
      // }

    };

    if (videojs__default['default'].browser.IS_IOS) {
      window__default['default'].addEventListener('orientationchange', rotationHandler);
    } else if (screen && screen.orientation) {
      // addEventListener('orientationchange') is not a user interaction on Android
      screen.orientation.onchange = rotationHandler;
    } // MOD#9 Useless?
    // player.on('fullscreenchange', () => {
    // 	if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
    // 		if (!angle() && player.isFullscreen() && options.fullscreen.alwaysInLandscapeMode) {
    // 			lockOrientationUniversal('landscape');	// MOD#8 Change function
    // 			// screen.lockOrientationUniversal('landscape');
    // 		}
    // 	}
    // })

  };
  /**
   * A video.js plugin.
   *
   * In the plugin function, the value of `this` is a video.js `Player`
   * instance. You cannot rely on the player being in a "ready" state here,
   * depending on how the plugin is invoked. This may or may not be important
   * to you; if not, remove the wait for "ready"!
   *
   * @function landscapeFullscreen
   * @param    {Object} [options={}]
   *           An object of options left to the plugin author to define.
   */


  var landscapeFullscreen = function landscapeFullscreen(options) {
    var _this = this;

    if (videojs__default['default'].browser.IS_ANDROID || videojs__default['default'].browser.IS_IOS) {
      this.ready(function () {
        onPlayerReady(_this, videojs__default['default'].mergeOptions(defaults, options));
      });
    }
  }; // Register the plugin with video.js.

  return landscapeFullscreen;

})));
