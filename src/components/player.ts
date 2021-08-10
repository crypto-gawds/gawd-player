import { SpatialType, StereoMode, SpatialPlayer, QuiltConfig, SpatialProps } from './spatial-viewer'
import { WebGLRenderer, PerspectiveCamera, Scene, TextureLoader, Texture, VideoTexture } from './three'
import { detect } from 'detect-browser';
import { Clock } from 'three';

class Props {
  public url: string
  public container: HTMLElement
  public enableVideo: Boolean = true
  public enableMouseMove: Boolean = true
  public spatialProps: SpatialProps = new SpatialProps()
}

class Gawd {
  public name: string
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

    if (this.props.enableMouseMove) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }
  }

  private initGawd(gawd: Gawd): void {
    const result = detect()
    let lkgAsset: GawdAsset = null;

    // if firefox+windows or mobile, default to PNG
    // DEFAULT TO PNG FOR NOW
    if (true || (result.name == "firefox" && result.os.match(/windows/i)) || 
         result.os.match(/iOS|android/i) ||
         !this.props.enableVideo) {
      lkgAsset = gawd.assets.filter(a => a.spatial == 'lookingglass' && a.quiltType == 'FourKSquare' && a.contentType == "image/png")[0]
    }
    else {
      lkgAsset = gawd.assets.filter(a => a.spatial == 'lookingglass' && a.quiltType == 'FourKSquare' && a.contentType == "video/mp4")[0]
    }
    
    this.initMedia(lkgAsset)
  }

  private initMedia(asset: GawdAsset): void {
    if (asset.contentType == "image/png") {
      // console.log(`Loading image: ${asset.url}`)
      const loader = new TextureLoader()
      loader.load(asset.url, function (tex) {
        this.loadSpatialPlayer(tex, asset)
      }.bind(this))
    }
    else if (asset.contentType == 'video/mp4') {
      let video = document.createElement('video') as HTMLVideoElement;
      video.src = asset.url
      video.crossOrigin = "anonymous"
      video.muted = true
      video.autoplay = true
      video.loop = true
      video.playsInline = true
      video.style.display = "none"
      document.body.appendChild(video);
      video.play();
      
      const videoTex = new VideoTexture(video);
      this.loadSpatialPlayer(videoTex, asset)
    }
  }

  private loadSpatialPlayer(texture: Texture, asset: GawdAsset): void {
    let config = new QuiltConfig();
    config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8
    config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6
    config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480
    config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640

    this.props.spatialProps.quilt = config

    this.spatialPlayer = new SpatialPlayer(texture, null, this.props.spatialProps)
    this.totalAngles = this.spatialPlayer.quiltColumns * this.spatialPlayer.quiltRows

    this.scene.add(this.spatialPlayer)

    let dist = this.camera.position.z - this.spatialPlayer.position.z
    let height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?
    this.camera.fov = Math.atan(height / dist) * (180 / Math.PI)
    this.camera.updateProjectionMatrix();
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
    this.aniCurTime += this.clock.getDelta()

    if (this.spatialPlayer && this.aniCurTime / this.aniDuration <= 1) {
      this.spatialPlayer.quiltAngle = Math.round(this.lerp(
        this.startAngle, 
        this.targetAngle,
        this.EasingFunctions.easeOutCubic(this.aniCurTime / this.aniDuration)
      ))
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
