import { SpatialType, StereoMode, SpatialPlayer, QuiltConfig, SpatialProps } from './spatial-viewer'
import { WebGLRenderer, PerspectiveCamera, Scene, TextureLoader, Texture, VideoTexture } from './three'
import { detect } from 'detect-browser';
import { Clock } from 'three';
import { PlayerProps } from '..';

class Props {
  public url: string
  public container: HTMLElement
  public enableMouseMove: Boolean = true
  public toggleModes: Boolean = false
  public defaultThumbnailSize: number = 640
  public defaultAsset: GawdAsset = new GawdAsset({
    spatial: 'lookingglass',
    quiltType: 'FourKSquare',
    size: new Resolution({ width: 4320 }),
    contentType: 'image/png'
  })

  public defaultMobileAsset: GawdAsset = new GawdAsset({
    spatial: '2d',
    size: new Resolution({ width: 1080 }),
    contentType: 'video/mp4'
  })

  public animationAsset: GawdAsset = new GawdAsset({
    spatial: '2d',
    size: new Resolution({ width: 1080 }),
    contentType: 'video/mp4'
  })

  public spatialProps: SpatialProps = {
    spatialType: SpatialType.LOOKING_GLASS,
    stereoMode: StereoMode.OFF,
    quilt: null
  }

  public gawdData: Gawd // optionally pass in all the data (instead of loading via json)
}

class Gawd {
  public name: string
  public hash: string
  public assets: Array<GawdAsset>

  public constructor(init?: Partial<Gawd>) {
    Object.assign(this, init);
  }
}

class GawdAsset {
  public url: string
  public spatial: string
  public quilt: GawdQuilt
  public quiltType: string
  public size: Resolution
  public viewSize: Resolution
  public contentType: string

  public constructor(init?: Partial<GawdAsset>) {
    Object.assign(this, init);
  }
}

class GawdQuilt {
  public columns: number
  public rows: number

  public constructor(init?: Partial<GawdQuilt>) {
    Object.assign(this, init);
  }
}

class Resolution {
  public width: number
  public height: number

  public constructor(init?: Partial<Resolution>) {
    Object.assign(this, init);
  }
}

export { Props as PlayerProps, Gawd, GawdAsset, GawdQuilt, Resolution }

export default class Player {

  private _props: Props = new Props()
  private scene: Scene
  private renderer: WebGLRenderer
  private spatialPlayer: SpatialPlayer
  private camera: PerspectiveCamera
  private clock: Clock
  private gawd: Gawd
  private video: HTMLVideoElement
  private thumbnail: HTMLImageElement

  // Animation
  private startAngle: number = 0
  private targetAngle: number = 0
  private totalAngles: number = 0
  private aniCurTime: number = 0
  private aniDuration: number = 0.5

  private hideThumbnail: boolean = false
  private thumbCurTime: number = 0

  constructor(props?: Props) {
    this.setProps(this._props, props)

    this.clock = new Clock();

    if (!this._props.container) {
      console.warn(`No container was set`)
      return;
    }

    // If passing in gawd data direclty, then just load immediately
    if (this._props.gawdData && this._props.gawdData.assets && this._props.gawdData.assets.length > 0) {
      this.initGawd(this._props.gawdData)
    }
    // Otherwise load from json url
    else if (this._props.url) {
      this.loadGawdConfig(this._props.url).then(data => {
        this.initGawd(data)
      });
    }
  }

  private setProps(playerProps: Props, userProps?: object): void {
    if (!userProps) return

    for (let prop in userProps) {
      if (prop in playerProps) {
        playerProps[prop] = userProps[prop]
      } else {
        console.warn(
          `GawdViewer: Provided ${prop} in config but it is not a valid property and will be ignored`,
        )
      }
    }
  }

  private initThree(): void {
    if (!this.scene) {
      this.scene = new Scene();

      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.xr.enabled = false;
      this._props.container.appendChild(this.renderer.domElement);

      this.camera = new PerspectiveCamera(90, this.aspectRatio, 0.01, 1000);
      this.camera.position.z = 10;
      this.scene.add(this.camera);

      this.resize()

      this.renderer.setAnimationLoop(() => {
        this.render()
      });

      window.addEventListener('resize', this.resize.bind(this))

      if (this._props.toggleModes) {
        this._props.container.addEventListener('click', this.toggleDisplayMode.bind(this))
      }
    }
  }

  private resize(): void {
    this.camera.aspect = this.aspectRatio
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this._props.container.clientWidth, this._props.container.clientHeight)
  }

  private isMobile(): boolean {
    const result = detect()
    return result.os.match(/iOS|android/i) != null
  }

  private initGawd(gawd: Gawd): void {
    this.gawd = gawd
    let defaultAsset: GawdAsset = null;

    // Default mobile asset 
    if (this.isMobile()) {
      defaultAsset = gawd.assets.filter(a =>
        a.spatial == this._props.defaultMobileAsset.spatial &&
        a.size.width == this._props.defaultMobileAsset.size.width &&
        (a.quiltType == this._props.defaultMobileAsset.quiltType || !this._props.defaultMobileAsset.quiltType) &&
        a.contentType == this._props.defaultMobileAsset.contentType)[0]
    }

    // Default desktop asset
    if (!defaultAsset) {
      defaultAsset = gawd.assets.filter(a =>
        a.spatial == this._props.defaultAsset.spatial &&
        a.size.width == this._props.defaultAsset.size.width &&
        (a.quiltType == this._props.defaultAsset.quiltType || !this._props.defaultAsset.quiltType) &&
        a.contentType == this._props.defaultAsset.contentType)[0]
    }

    this.initThumbnail()
    this.initMedia(defaultAsset)
  }

  private initThumbnail(): void {
    // Get preferred thumb size
    // if not, found it will use the next smallest thumb
    let thumbUrl = this.gawd.assets
      .sort((a1, a2) => a1.size.width - a2.size.width)
      .find((asset) => asset.contentType == 'image/png' && asset.size.width >= this._props.defaultThumbnailSize).url

    this.thumbnail = document.createElement('img') as HTMLImageElement
    this.thumbnail.src = thumbUrl
    this.thumbnail.crossOrigin = "anonymous"
    this.thumbnail.style.width = "100%"
    this.thumbnail.style.height = "100%"
    this.thumbnail.style.position = "absolute"
    this.thumbnail.style.left = "0"
    this._props.container.appendChild(this.thumbnail)
  }

  private hideThumb(): void {
    this.hideThumbnail = true
    this.thumbCurTime = 0
  }

  private initMedia(asset: GawdAsset, onLoad?: () => void): void {
    if (!asset) {
      console.warn("No GawdAsset found!");
      return
    }

    if (asset.contentType == "image/png") {
      const loader = new TextureLoader()
      loader.load(asset.url, function (tex) {
        this.loadSpatialPlayer(tex, asset)
        this.hideThumb()
        if (onLoad) {
          onLoad()
        }
      }.bind(this))
    }
    else if (asset.contentType == 'video/mp4') {
      this.initVideo(asset, () => {
        const videoTex = new VideoTexture(this.video);
        this.loadSpatialPlayer(videoTex, asset)
        this.hideThumb()
        if (onLoad) {
          onLoad()
        }
      })
    }
  }

  private initVideo(asset: GawdAsset, onLoad?: () => any): void {
    const videoId = "gawd-video-" + this.gawd.hash
    this.video = document.getElementById(videoId) as HTMLVideoElement

    if (!this.video) {
      this.video = document.createElement('video') as HTMLVideoElement
      this.video.id = videoId
      this.video.crossOrigin = "anonymous"
      this.video.muted = true
      this.video.preload = "auto"
      this.video.autoplay = true
      this.video.loop = true
      this.video.playsInline = true
      this.video.style.width = "100%"
      this.video.style.height = "100%"
      this.video.style.display = "none"
      this.props.container.appendChild(this.video);
    }
    
    if (onLoad) {
      this.video.ontimeupdate = function () {
        if (this.video.currentTime > 0) {
          onLoad()
          this.video.ontimeupdate = null
          onLoad = null
        }
      }.bind(this)

      this.video.src = asset.url
      this.video.play();
    }
  }


  private loadSpatialPlayer(texture: Texture, asset: GawdAsset): void {
    let config = new QuiltConfig();

    this.initThree()

    if (asset.quilt) {
      config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8
      config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6
      config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480
      config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640
      this._props.spatialProps.quilt = config

      this.spatialPlayer = new SpatialPlayer(texture, null, this._props.spatialProps)
      this.totalAngles = this.spatialPlayer.quiltColumns * this.spatialPlayer.quiltRows
      this.spatialPlayer.quiltAngle = this.targetAngle = this.totalAngles / 2 // starting angle
      this.scene.add(this.spatialPlayer)

      let dist = this.camera.position.z - this.spatialPlayer.position.z
      let height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?
      this.camera.fov = Math.atan(height / dist) * (180 / Math.PI)
      this.camera.updateProjectionMatrix();

      if (this._props.enableMouseMove) {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
      }
    }
    else {
      this.video.style.display = ''
      this._props.enableMouseMove = false
    }
  }

  private toggleDisplayMode(): void {
    if (this.spatialPlayer) {
      this.spatialPlayer.quiltStereoEyeDistance = 8

      if (this.video && this.video.style.display == '') {
        this.video.style.display = 'none'
        this.video.pause()
        this.renderer.domElement.style.display = ''
        this.spatialPlayer.stereoMode = StereoMode.OFF
      }
      else if (this.spatialPlayer.stereoMode == StereoMode.OFF) {
        this.spatialPlayer.stereoMode = StereoMode.COLOR
      }
      else if (this.spatialPlayer.stereoMode == StereoMode.COLOR) {
        this.initVideo(this.getAnimationAsset())
        this.renderer.domElement.style.display = 'none'
        this.video.style.display = ''
        this.video.play()
      }
    }
    else {
      this._props.enableMouseMove = true
      this.initMedia(this.getQuiltPNGAsset(), function () {
        this.video.style.display = 'none'
        this.renderer.domElement.style.display = ''
        this.spatialPlayer.stereoMode = StereoMode.OFF
      }.bind(this))
    }
  }

  private getQuiltPNGAsset(): GawdAsset {
    return this.gawd.assets
      .find((asset) => asset.contentType == 'image/png'
        && asset.quiltType == 'FourKSquare')
  }

  private getAnimationAsset(): GawdAsset {
    return this.gawd.assets
      .sort((a1, a2) => a2.size.width - a1.size.width)
      .find((asset) => asset.contentType == this._props.animationAsset.contentType
        && asset.size.width <= this._props.animationAsset.size.width
        && asset.spatial == this._props.animationAsset.spatial)
  }

  private async loadGawdConfig(url: string): Promise<any> {
    const response = await fetch(url)
    return await response.json()
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.spatialPlayer) {
      this.targetAngle = (1 - (e.clientX / window.innerWidth)) * (this.totalAngles - 1)
      this.startAngle = this.spatialPlayer.quiltAngle
      this.aniCurTime = 0
    }
  }

  private render(): void {
    let delta = this.clock.getDelta()
    if (this._props.enableMouseMove) {
      this.aniCurTime += delta

      if (this.spatialPlayer && this.aniCurTime / this.aniDuration <= 1 && this.thumbnail.style.opacity == "0") {
        this.spatialPlayer.quiltAngle = Math.round(this.lerp(
          this.startAngle,
          this.targetAngle,
          this.EasingFunctions.easeOutCubic(this.aniCurTime / this.aniDuration)
        ))
      }
    }

    if (this.hideThumbnail) {
      this.thumbCurTime += delta

      if (this.thumbnail && this.thumbnail.style.opacity != "0") {
        this.thumbnail.style.opacity = this.lerp(1, 0,
          this.EasingFunctions.linear(this.thumbCurTime / 0.25)
        ).toString()
      }
    }

    if (this.scene) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  private lerp(value1: number, value2: number, amount: number) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  }

  public dispose(): void {
    if (this.scene) {
      this.scene.remove(this.spatialPlayer)
    }

    if (this.spatialPlayer) {
      this.spatialPlayer.dispose()
    }

    window.removeEventListener('mousemove', this.onMouseMove.bind(this))
    window.removeEventListener('resize', this.resize.bind(this))
  }

  public get aspectRatio(): number {
    return this._props.container.clientWidth / this._props.container.clientHeight
  }

  public get props(): PlayerProps {
    return this._props
  }

  EasingFunctions = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t * t,
    // decelerating to zero velocity
    easeOutQuad: t => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // accelerating from zero velocity 
    easeInCubic: t => t * t * t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t) * t * t + 1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity 
    easeInQuart: t => t * t * t * t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1 - (--t) * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // accelerating from zero velocity
    easeInQuint: t => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
}
