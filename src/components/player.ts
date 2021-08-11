import { SpatialType, StereoMode, SpatialPlayer, QuiltConfig, SpatialProps } from './spatial-viewer'
import { WebGLRenderer, PerspectiveCamera, Scene, TextureLoader, Texture, VideoTexture } from './three'
import { detect } from 'detect-browser';
import { Clock } from 'three';

class Props {
  public url: string
  public container: HTMLElement
  public enableMouseMove: Boolean = true
  public defaultAsset: GawdAsset = new GawdAsset()
  public defaultMobileAsset: GawdAsset = new GawdAsset()
  public spatialProps: SpatialProps = new SpatialProps()
}

class Gawd {
  public name: string
  public hash: string
  public assets: Array<GawdAsset>
}

class GawdAsset {
  public url: string
  public spatial: string
  public quilt: GawdQuilt
  public quiltType: string
  public size: Resolution
  public viewSize: Resolution
  public contentType: string
}

class GawdQuilt {
  public columns: number
  public rows: number
}

class Resolution {
  public width: number
  public height: number
}

export { Props as PlayerProps, Gawd, GawdAsset, GawdQuilt, Resolution }

export default class Player {

  private props: Props = new Props()
  private scene: Scene
  private renderer: WebGLRenderer
  private spatialPlayer: SpatialPlayer
  private camera: PerspectiveCamera
  private clock: Clock
  private gawd: Gawd

  // Animation
  private startAngle: number = 0
  private targetAngle: number = 0
  private totalAngles: number = 0
  private aniCurTime: number = 0
  private aniDuration: number = 0.5

  constructor(props?: Props) {
    // Defaults
    this.props.spatialProps.spatialType = SpatialType.LOOKING_GLASS
    this.props.spatialProps.stereoMode  = StereoMode.OFF

    // Default desktop asset
    this.props.defaultAsset.spatial = 'lookingglass'
    this.props.defaultAsset.quiltType = 'FourKSquare'
    this.props.defaultAsset.size = new Resolution()
    this.props.defaultAsset.size.width = 4320
    this.props.defaultAsset.contentType = 'image/png'

    // Default mobile asset
    this.props.defaultMobileAsset.spatial = '2d'
    this.props.defaultMobileAsset.size = new Resolution()
    this.props.defaultMobileAsset.size.width = 1080
    this.props.defaultMobileAsset.contentType = 'video/mp4'

    this.setProps(this.props, props)

    this.clock = new Clock();

    if (this.props.container) {
      this.initThree()
    }
    else {
      console.warn(`No container was set`)
      return;
    }

    if (this.props.url) {
      this.loadGawdConfig(this.props.url).then(data => {
        this.initGawd(data)
      });
    }
  }

  private setProps(viewerProps: Props, userProps?: object): void {
    if (!userProps) return

    for (let prop in userProps) {
      if (prop in viewerProps) {
        viewerProps[prop] = userProps[prop]
      } else {
        console.warn(
          `GawdViewer: Provided ${prop} in config but it is not a valid property and will be ignored`,
        )
      }
    }
  }
  
  private initThree(): void {
    this.scene = new Scene();

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.props.container.clientWidth, this.props.container.clientHeight);
    this.renderer.xr.enabled = false;
    this.props.container.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(90, this.aspectRatio, 0.01, 1000);
    this.camera.position

    this.scene.add(this.camera);

    this.camera.position.z = 10;

    this.renderer.setAnimationLoop(() => {
      this.render()
    });

    window.addEventListener('resize', ev => {
      this.camera.aspect = this.aspectRatio
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.props.container.clientWidth, this.props.container.clientHeight)
    })
  }

  private initGawd(gawd: Gawd): void {
    this.gawd = gawd

    const result = detect()
    let lkgAsset: GawdAsset = null;

    if (result.os.match(/iOS|android/i)) {
      // Default mobile asset 
      lkgAsset = gawd.assets.filter(a => 
        a.spatial == this.props.defaultMobileAsset.spatial && 
        a.size.width == this.props.defaultMobileAsset.size.width && 
        (a.quiltType == this.props.defaultMobileAsset.quiltType || !this.props.defaultMobileAsset.quiltType)  && 
        a.contentType == this.props.defaultMobileAsset.contentType)[0]
      
      if (lkgAsset) {
        this.initMedia(lkgAsset)
        return
      }
    }
    
    // Default desktop asset 
    lkgAsset = gawd.assets.filter(a => 
      a.spatial == this.props.defaultAsset.spatial && 
      a.size.width == this.props.defaultAsset.size.width && 
      (a.quiltType == this.props.defaultAsset.quiltType || !this.props.defaultAsset.quiltType)  && 
      a.contentType == this.props.defaultAsset.contentType )[0]
    this.initMedia(lkgAsset)
  }

  private initMedia(asset: GawdAsset): void {
    if (!asset) {
      console.warn("No GawdAsset found!");
      return
    }

    if (asset.contentType == "image/png") {
      const loader = new TextureLoader()
      loader.load(asset.url, function (tex) {
        this.loadSpatialPlayer(tex, asset)
      }.bind(this))
    }
    else if (asset.contentType == 'video/mp4') {
      const videoId = "gawd-video-" + this.gawd.hash
      let video = document.getElementById(videoId) as HTMLVideoElement

      if (!video)
      {
        video = document.createElement('video') as HTMLVideoElement
        video.id = videoId
        video.src = asset.url
        video.crossOrigin = "anonymous"
        video.muted = true
        video.autoplay = true
        video.loop = true
        video.playsInline = true
        video.style.display = "none"
        document.body.appendChild(video);
        video.play();
      }
        
      const videoTex = new VideoTexture(video);
      this.loadSpatialPlayer(videoTex, asset)
    }
  }

  private loadSpatialPlayer(texture: Texture, asset: GawdAsset): void {
    let config = new QuiltConfig();

    if (asset.quilt)
    {
      config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8
      config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6
      config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480
      config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640
    }
    else
    {
      // disable quilt 
      config.columns = 1
      config.rows = 1
      config.width = asset.size.width
      config.height = asset.size.height
      this.props.enableMouseMove = false
    }

    this.props.spatialProps.quilt = config

    this.spatialPlayer = new SpatialPlayer(texture, null, this.props.spatialProps)
    this.totalAngles = this.spatialPlayer.quiltColumns * this.spatialPlayer.quiltRows

    this.scene.add(this.spatialPlayer)

    let dist = this.camera.position.z - this.spatialPlayer.position.z
    let height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?
    this.camera.fov = Math.atan(height / dist) * (180 / Math.PI)
    this.camera.updateProjectionMatrix();

    if (this.props.enableMouseMove) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }
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
    if (this.props.enableMouseMove)
    {
      this.aniCurTime += this.clock.getDelta()

      if (this.spatialPlayer && this.aniCurTime / this.aniDuration <= 1) {
        this.spatialPlayer.quiltAngle = Math.round(this.lerp(
          this.startAngle, 
          this.targetAngle,
          this.EasingFunctions.easeOutCubic(this.aniCurTime / this.aniDuration)
        ))
      }
    }
    
    this.renderer.render(this.scene, this.camera)
  }

  private lerp(value1: number, value2: number, amount: number) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  }

  public get aspectRatio(): number {
    return this.props.container.clientWidth / this.props.container.clientHeight
  }

  EasingFunctions = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t*t,
    // decelerating to zero velocity
    easeOutQuad: t => t*(2-t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    // accelerating from zero velocity 
    easeInCubic: t => t*t*t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t)*t*t+1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    // accelerating from zero velocity 
    easeInQuart: t => t*t*t*t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1-(--t)*t*t*t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    // accelerating from zero velocity
    easeInQuint: t => t*t*t*t*t,
    // decelerating to zero velocity
    easeOutQuint: t => 1+(--t)*t*t*t*t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
  }
}
