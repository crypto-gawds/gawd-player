import { QuiltConfig, Player as Player$1, SpatialType, StereoMode } from 'three-spatial-viewer';
import { Clock, Scene, WebGLRenderer, PerspectiveCamera, TextureLoader, VideoTexture, LinearMipmapLinearFilter } from 'three';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BrowserInfo = /** @class */ (function () {
    function BrowserInfo(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = 'browser';
    }
    return BrowserInfo;
}());
var NodeInfo = /** @class */ (function () {
    function NodeInfo(version) {
        this.version = version;
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
    return NodeInfo;
}());
var SearchBotDeviceInfo = /** @class */ (function () {
    function SearchBotDeviceInfo(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = 'bot-device';
    }
    return SearchBotDeviceInfo;
}());
var BotInfo = /** @class */ (function () {
    function BotInfo() {
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
    return BotInfo;
}());
var ReactNativeInfo = /** @class */ (function () {
    function ReactNativeInfo() {
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
    return ReactNativeInfo;
}());
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FBAV\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['Android OS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['Amazon OS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Open BSD', /OpenBSD/],
    ['Sun OS', /SunOS/],
    ['Chrome OS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
function detect(userAgent) {
    if (!!userAgent) {
        return parseUserAgent(userAgent);
    }
    if (typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return new ReactNativeInfo();
    }
    if (typeof navigator !== 'undefined') {
        return parseUserAgent(navigator.userAgent);
    }
    return getNodeVersion();
}
function matchUserAgent(ua) {
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (ua !== '' &&
        userAgentRules.reduce(function (matched, _a) {
            var browser = _a[0], regex = _a[1];
            if (matched) {
                return matched;
            }
            var uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false));
}
function parseUserAgent(ua) {
    var matchedRule = matchUserAgent(ua);
    if (!matchedRule) {
        return null;
    }
    var name = matchedRule[0], match = matchedRule[1];
    if (name === 'searchbot') {
        return new BotInfo();
    }
    var versionParts = match[1] && match[1].split(/[._]/).slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = __spreadArrays(versionParts, createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length));
        }
    }
    else {
        versionParts = [];
    }
    var version = versionParts.join('.');
    var os = detectOS(ua);
    var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
    for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
            return os;
        }
    }
    return null;
}
function getNodeVersion() {
    var isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
    var output = [];
    for (var ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}

class Props {
  constructor() {
    this.url = void 0;
    this.container = void 0;
    this.enableMouseMove = true;
    this.defaultAsset = new GawdAsset({
      spatial: 'lookingglass',
      quiltType: 'FourKSquare',
      size: new Resolution({
        width: 4320
      }),
      contentType: 'image/png'
    });
    this.defaultMobileAsset = new GawdAsset({
      spatial: '2d',
      size: new Resolution({
        width: 1080
      }),
      contentType: 'video/mp4'
    });
    this.spatialProps = {
      spatialType: SpatialType.LOOKING_GLASS,
      stereoMode: StereoMode.OFF,
      quilt: null
    };
  }

}

class Gawd {
  constructor(init) {
    this.name = void 0;
    this.hash = void 0;
    this.assets = void 0;
    Object.assign(this, init);
  }

}

class GawdAsset {
  constructor(init) {
    this.url = void 0;
    this.spatial = void 0;
    this.quilt = void 0;
    this.quiltType = void 0;
    this.size = void 0;
    this.viewSize = void 0;
    this.contentType = void 0;
    Object.assign(this, init);
  }

}

class GawdQuilt {
  constructor(init) {
    this.columns = void 0;
    this.rows = void 0;
    Object.assign(this, init);
  }

}

class Resolution {
  constructor(init) {
    this.width = void 0;
    this.height = void 0;
    Object.assign(this, init);
  }

}
class Player {
  // Animation
  constructor(props) {
    var _this = this;

    this._props = new Props();
    this.scene = void 0;
    this.renderer = void 0;
    this.spatialPlayer = void 0;
    this.camera = void 0;
    this.clock = void 0;
    this.gawd = void 0;
    this.startAngle = 0;
    this.targetAngle = 0;
    this.totalAngles = 0;
    this.aniCurTime = 0;
    this.aniDuration = 0.5;
    this.EasingFunctions = {
      // no easing, no acceleration
      linear: function linear(t) {
        return t;
      },
      // accelerating from zero velocity
      easeInQuad: function easeInQuad(t) {
        return t * t;
      },
      // decelerating to zero velocity
      easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
      },
      // acceleration until halfway, then deceleration
      easeInOutQuad: function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      // accelerating from zero velocity 
      easeInCubic: function easeInCubic(t) {
        return t * t * t;
      },
      // decelerating to zero velocity 
      easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
      },
      // acceleration until halfway, then deceleration 
      easeInOutCubic: function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      // accelerating from zero velocity 
      easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
      },
      // decelerating to zero velocity 
      easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
      },
      // acceleration until halfway, then deceleration
      easeInOutQuart: function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
      },
      // accelerating from zero velocity
      easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
      },
      // decelerating to zero velocity
      easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
      },
      // acceleration until halfway, then deceleration 
      easeInOutQuint: function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
      }
    };
    this.setProps(this._props, props);
    this.clock = new Clock();

    if (this._props.container) {
      this.initThree();
    } else {
      console.warn("No container was set");
      return;
    }

    if (this._props.url) {
      this.loadGawdConfig(this._props.url).then(function (data) {
        _this.initGawd(data);
      });
    }
  }

  setProps(playerProps, userProps) {
    if (!userProps) return;

    for (var prop in userProps) {
      if (prop in playerProps) {
        playerProps[prop] = userProps[prop];
      } else {
        console.warn("GawdViewer: Provided ".concat(prop, " in config but it is not a valid property and will be ignored"));
      }
    }
  }

  initThree() {
    var _this2 = this;

    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(this._props.container.clientWidth, this._props.container.clientHeight);
    this.renderer.xr.enabled = false;

    this._props.container.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(90, this.aspectRatio, 0.01, 1000);
    this.camera.position;
    this.scene.add(this.camera);
    this.camera.position.z = 10;
    this.renderer.setAnimationLoop(function () {
      _this2.render();
    });
    window.addEventListener('resize', function (ev) {
      _this2.camera.aspect = _this2.aspectRatio;

      _this2.camera.updateProjectionMatrix();

      _this2.renderer.setSize(_this2._props.container.clientWidth, _this2._props.container.clientHeight);
    });
  }

  initGawd(gawd) {
    var _this3 = this;

    this.gawd = gawd;
    var result = detect();
    var lkgAsset = null;

    if (result.os.match(/iOS|android/i)) {
      // Default mobile asset 
      lkgAsset = gawd.assets.filter(function (a) {
        return a.spatial == _this3._props.defaultMobileAsset.spatial && a.size.width == _this3._props.defaultMobileAsset.size.width && (a.quiltType == _this3._props.defaultMobileAsset.quiltType || !_this3._props.defaultMobileAsset.quiltType) && a.contentType == _this3._props.defaultMobileAsset.contentType;
      })[0];

      if (lkgAsset) {
        this.initMedia(lkgAsset);
        return;
      }
    } // Default desktop asset 


    lkgAsset = gawd.assets.filter(function (a) {
      return a.spatial == _this3._props.defaultAsset.spatial && a.size.width == _this3._props.defaultAsset.size.width && (a.quiltType == _this3._props.defaultAsset.quiltType || !_this3._props.defaultAsset.quiltType) && a.contentType == _this3._props.defaultAsset.contentType;
    })[0];
    this.initMedia(lkgAsset);
  }

  initMedia(asset) {
    if (!asset) {
      console.warn("No GawdAsset found!");
      return;
    }

    if (asset.contentType == "image/png") {
      var loader = new TextureLoader();
      loader.load(asset.url, function (tex) {
        this.loadSpatialPlayer(tex, asset);
      }.bind(this));
    } else if (asset.contentType == 'video/mp4') {
      var videoId = "gawd-video-" + this.gawd.hash;
      var video = document.getElementById(videoId);

      if (!video) {
        video = document.createElement('video');
        video.id = videoId;
        video.src = asset.url;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.style.display = "none";
        document.body.appendChild(video);
        video.play();
      }

      var videoTex = new VideoTexture(video);
      this.loadSpatialPlayer(videoTex, asset);
    }
  }

  loadSpatialPlayer(texture, asset) {
    var config = new QuiltConfig();

    if (asset.quilt) {
      config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8;
      config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6;
      config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480;
      config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640;
    } else {
      // disable quilt 
      config.columns = 1;
      config.rows = 1;
      config.width = asset.size.width;
      config.height = asset.size.height;
      this._props.enableMouseMove = false;
    }

    this._props.spatialProps.quilt = config;
    this.spatialPlayer = new Player$1(texture, null, this._props.spatialProps);
    var tex = this.spatialPlayer.texture;
    tex.minFilter = LinearMipmapLinearFilter;
    this.spatialPlayer.texture = tex;
    this.totalAngles = this.spatialPlayer.quiltColumns * this.spatialPlayer.quiltRows;
    this.scene.add(this.spatialPlayer);
    var dist = this.camera.position.z - this.spatialPlayer.position.z;
    var height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?

    this.camera.fov = Math.atan(height / dist) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    if (this._props.enableMouseMove) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }

  loadGawdConfig(url) {
    return _asyncToGenerator(function* () {
      var response = yield fetch(url);
      return yield response.json();
    })();
  }

  onMouseMove(e) {
    if (this.spatialPlayer) {
      this.targetAngle = (1 - e.clientX / window.innerWidth) * (this.totalAngles - 1);
      this.startAngle = this.spatialPlayer.quiltAngle;
      this.aniCurTime = 0;
    }
  }

  render() {
    if (this._props.enableMouseMove) {
      this.aniCurTime += this.clock.getDelta();

      if (this.spatialPlayer && this.aniCurTime / this.aniDuration <= 1) {
        this.spatialPlayer.quiltAngle = Math.round(this.lerp(this.startAngle, this.targetAngle, this.EasingFunctions.easeOutCubic(this.aniCurTime / this.aniDuration)));
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  }

  get aspectRatio() {
    return this._props.container.clientWidth / this._props.container.clientHeight;
  }

  get props() {
    return this._props;
  }

}

export { Gawd, GawdAsset, GawdQuilt, Player, Props as PlayerProps };
//# sourceMappingURL=gawd-player.esm.js.map
