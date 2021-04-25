import videojs from 'video.js';
// import {version as VERSION} from '../package.json';
import window from 'global/window';

// Default options for the plugin.
const defaults = {
  fullscreen: {
    enterOnRotate: true,
    alwaysInLandscapeMode: true,
    // MOD#0 true > false
    iOS: false
  }
};

const screen = window.screen;

/* eslint-disable no-console */
// MOD#1 Remove others orientation checks
const lockOrientationUniversal = mode => {
  screen.orientation.lock(mode).then(
    () => { },
    // MOD#2 Remove log
    // err => { console.log(err); }
    () => { }
  );
};

// const unlockOrientationUniversal = () => {
// 	screen.orientation.unlock();
// }

const angle = () => {
  // iOS
  if (typeof window.orientation === 'number') {
    return window.orientation;
  }
  // Android
  if (screen && screen.orientation && screen.orientation.angle) {
    return window.orientation;
  }
  // MOD#3 Remove log
  // videojs.log('angle unknown');
  return 0;
};

// Cross-compatibility for Video.js 5 and 6.
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
const onPlayerReady = (player, options) => {
  // MOD#5 Useless?
  // player.addClass('vjs-landscape-fullscreen');

  if (
    options.fullscreen.iOS &&
    videojs.browser.IS_IOS &&
    videojs.browser.IOS_VERSION > 9 &&
    !player.el_.ownerDocument.querySelector('.bc-iframe')
  ) {
    player.tech_.el_.setAttribute('playsinline', 'playsinline');
    player.tech_.supportsFullScreen = function() {
      return false;
    };
  }

  const rotationHandler = () => {
    const currentAngle = angle();

    if (
      currentAngle === 90 ||
      // MOD#6 Add comment
      // || currentAngle === 270
      currentAngle === -90
    ) {
      if (player.paused() === false) {
        player.requestFullscreen();
        // MOD#7 Change function
        lockOrientationUniversal('landscape');
        // screen.lockOrientationUniversal('landscape');
      }
    }

    // MOD#8 Add comment
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

  if (videojs.browser.IS_IOS) {
    window.addEventListener('orientationchange', rotationHandler);
  } else if (screen && screen.orientation) {
    // addEventListener('orientationchange') is not a user interaction on Android
    screen.orientation.onchange = rotationHandler;
  }

  // MOD#9 Useless?
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
const landscapeFullscreen = function(options) {
  if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
    this.ready(() => {
      onPlayerReady(this, videojs.mergeOptions(defaults, options));
    });
  }
};

// Register the plugin with video.js.
// MOD#10 Add comment
// registerPlugin('landscapeFullscreen', landscapeFullscreen);

// Include the version number.
// MOD#11 Add comment
// landscapeFullscreen.VERSION = VERSION;

// Async Poll
/* eslint-disable-next-line */
// MOD#10 Add comment
// fetch(`https://cdn.jsdelivr.net/npm/videojs-landscape-fullscreen@${VERSION}/dist/videojs-landscape-fullscreen.min.js`);

export default landscapeFullscreen;
