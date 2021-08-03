define(['exports', 'three-spatial-viewer', 'three'], function (exports, threeSpatialViewer, three) { 'use strict';

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

  class Props {
    constructor() {
      this.url = void 0;
      this.container = void 0;
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

      this.scene = new three.Scene();
      this.renderer = new three.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(this.props.container.clientWidth, this.props.container.clientHeight);
      this.renderer.xr.enabled = false;
      this.props.container.appendChild(this.renderer.domElement);
      this.camera = new three.PerspectiveCamera(90, this.aspectRatio, 0.01, 1000);
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

        this.spatialPlayer.quiltAngle = Math.round(xpos * totalAngles);
      }
    }

    initGawd(gawd) {
      console.log("Loading ".concat(gawd.name, "..."));
      var lkgAssets = gawd.assets.filter(function (a) {
        return a.spatial == 'lookingglass' && a.quiltType == 'FourKSquare';
      });
      this.initMedia(lkgAssets[0]);
    }

    initMedia(asset) {
      if (asset.contentType == "image/png") {
        console.log("Loading image: ".concat(asset.url));
        var loader = new three.TextureLoader();
        loader.load(asset.url, function (tex) {
          this.loadSpatialPlayer(tex, asset);
        }.bind(this));
      } else if (asset.contentType == 'video/mp4') ;
    }

    loadSpatialPlayer(texture, asset) {
      var config = new threeSpatialViewer.QuiltConfig();
      config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8;
      config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6;
      config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480;
      config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640;
      this.spatialPlayer = new threeSpatialViewer.Player(texture, null, {
        spatialType: threeSpatialViewer.SpatialType.LOOKING_GLASS,
        stereoMode: threeSpatialViewer.StereoMode.COLOR,
        quilt: config
      });
      this.scene.add(this.spatialPlayer);
      var dist = this.camera.position.z - this.spatialPlayer.position.z;
      var height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?

      this.camera.fov = Math.atan(height / dist) * (180 / Math.PI);
      this.camera.updateProjectionMatrix();
      console.log(this.spatialPlayer);
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

  exports.Player = Player;
  exports.PlayerProps = Props;

  Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=gawd-player.amd.js.map
