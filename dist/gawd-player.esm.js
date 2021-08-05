import { SpatialType, StereoMode, QuiltConfig, Player as Player$1, Props as Props$1 } from 'three-spatial-viewer';
import { Scene, WebGLRenderer, PerspectiveCamera, TextureLoader, VideoTexture } from 'three';

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
    this.spatialProps = new Props$1();
  }

}

class Gawd {
  constructor() {
    this.name = void 0;
    this.assets = void 0;
  }

}

class GawdAsset {
  constructor() {
    this.url = void 0;
    this.spatial = void 0;
    this.quilt = void 0;
    this.quiltType = void 0;
    this.size = void 0;
    this.viewSize = void 0;
    this.contentType = void 0;
  }

}

class GawdQuilt {
  constructor() {
    this.columns = void 0;
    this.rows = void 0;
  }

}
class Player {
  constructor(props) {
    var _this = this;

    this.props = new Props();
    this.scene = void 0;
    this.renderer = void 0;
    this.spatialPlayer = void 0;
    this.camera = void 0;
    // Defaults
    this.props.spatialProps.spatialType = SpatialType.LOOKING_GLASS;
    this.props.spatialProps.stereoMode = StereoMode.COLOR;
    this.setProps(this.props, props);

    if (this.props.container) {
      this.initThree();
    } else {
      console.warn("No container was set");
      return;
    }

    if (this.props.url) {
      this.loadGawdConfig(this.props.url).then(function (data) {
        _this.initGawd(data);
      });
    }
  }

  initThree() {
    var _this2 = this;

    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(this.props.container.clientWidth, this.props.container.clientHeight);
    this.renderer.xr.enabled = false;
    this.props.container.appendChild(this.renderer.domElement);
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

      _this2.renderer.setSize(_this2.props.container.clientWidth, _this2.props.container.clientHeight);
    });
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove(e) {
    if (this.spatialPlayer) {
      var totalAngles = this.spatialPlayer.quiltColumns * this.spatialPlayer.quiltRows;
      var xpos = e.clientX / window.innerWidth; // console.log(e.clientX, window.innerWidth, xpos, totalAngles)

      this.spatialPlayer.quiltAngle = Math.round(-xpos * totalAngles);
    }
  }

  initGawd(gawd) {
    var result = detect();
    var lkgAsset = null; // if firefox+windows or mobile, default to PNG

    if (result.name == "firefox" && result.os.match(/windows/i) || result.os.match(/iOS|android/i)) {
      lkgAsset = gawd.assets.filter(function (a) {
        return a.spatial == 'lookingglass' && a.quiltType == 'FourKSquare' && a.contentType == "image/png";
      })[0];
    } else {
      lkgAsset = gawd.assets.filter(function (a) {
        return a.spatial == 'lookingglass' && a.quiltType == 'FourKSquare' && a.contentType == "video/mp4";
      })[0];
    }

    this.initMedia(lkgAsset);
  }

  initMedia(asset) {
    if (asset.contentType == "image/png") {
      // console.log(`Loading image: ${asset.url}`)
      var loader = new TextureLoader();
      loader.load(asset.url, function (tex) {
        this.loadSpatialPlayer(tex, asset);
      }.bind(this));
    } else if (asset.contentType == 'video/mp4') {
      var video = document.createElement('video');
      video.src = asset.url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.style.display = "none";
      document.body.appendChild(video);
      video.play();
      var videoTex = new VideoTexture(video);
      this.loadSpatialPlayer(videoTex, asset);
    }
  }

  loadSpatialPlayer(texture, asset) {
    var config = new QuiltConfig();
    config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8;
    config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6;
    config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480;
    config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640;
    this.props.spatialProps.quilt = config;
    this.spatialPlayer = new Player$1(texture, null, this.props.spatialProps);
    this.scene.add(this.spatialPlayer);
    var dist = this.camera.position.z - this.spatialPlayer.position.z;
    var height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?

    this.camera.fov = Math.atan(height / dist) * (180 / Math.PI);
    this.camera.updateProjectionMatrix(); // console.log(this.spatialPlayer)
  }

  loadGawdConfig(url) {
    return _asyncToGenerator(function* () {
      var response = yield fetch(url);
      return yield response.json();
    })();
  }

  setProps(viewerProps, userProps) {
    if (!userProps) return;

    for (var prop in userProps) {
      if (prop in viewerProps) {
        viewerProps[prop] = userProps[prop];
      } else {
        console.warn("GawdViewer: Provided ".concat(prop, " in config but it is not a valid property and will be ignored"));
      }
    }
  }

  get aspectRatio() {
    return this.props.container.clientWidth / this.props.container.clientHeight;
  }

}

export { Gawd, GawdAsset, GawdQuilt, Player, Props as PlayerProps };
//# sourceMappingURL=gawd-player.esm.js.map
