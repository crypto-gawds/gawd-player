import * as http from 'http';
import { SpatialType, StereoMode } from 'three-spatial-viewer';
import { SpatialPlayer, QuiltConfig } from './spatial-viewer'
import { WebGLRenderer, PerspectiveCamera, Scene, ImageLoader, TextureLoader, Texture } from './three'

class Props {
  public url: string
  public container: HTMLElement
}

class Gawd {
  public name: string
  public assets: Array<GawdAsset>
}

class GawdAsset {
  public url: string
  public spatial: string
  public quilt: GawdQuilt
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

export { Props as PlayerProps, Gawd, GawdAsset }

export default class Player {

  private props: Props = new Props()
  private scene: Scene
  private renderer: WebGLRenderer
  private spatialPlayer: SpatialPlayer
  private camera: PerspectiveCamera

  constructor(props?: object) {
    this.setProps(this.props, props)

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

    window.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.spatialPlayer) {
      let totalAngles = this.spatialPlayer.quiltColumns * this.spatialPlayer.quiltRows
      let xpos = e.clientX / window.innerWidth
      // console.log(e.clientX, window.innerWidth, xpos, totalAngles)
      this.spatialPlayer.quiltAngle = Math.round(xpos * totalAngles)
    }
  }

  private initGawd(gawd: Gawd): void {
    console.log(`Loading ${gawd.name}...`)
    let lkgAssets: GawdAsset[] = gawd.assets.filter(a => a.spatial == 'lookingglass')
    this.initMedia(lkgAssets[0])
  }

  private initMedia(asset: GawdAsset): void {
    if (asset.contentType == "image/png") {
      console.log(`Loading image: ${asset.url}`)
      const loader = new TextureLoader()
      loader.load(asset.url, function (tex) {
        this.loadSpatialPlayer(tex, asset)
      }.bind(this))
    }
    else if (asset.contentType == 'video/mp4') {
    }
  }

  private loadSpatialPlayer(texture: Texture, asset: GawdAsset): void {
    let config = new QuiltConfig();
    config.columns = asset.quilt.columns > 0 ? asset.quilt.columns : 8
    config.rows = asset.quilt.rows > 0 ? asset.quilt.rows : 6
    config.width = asset.viewSize.width > 0 ? asset.viewSize.width : 480
    config.height = asset.viewSize.height > 0 ? asset.viewSize.height : 640

    this.spatialPlayer = new SpatialPlayer(texture, null, {
      spatialType: SpatialType.LOOKING_GLASS,
      stereoMode: StereoMode.COLOR,
      quilt: config,
    })

    this.scene.add(this.spatialPlayer)

    let dist = this.camera.position.z - this.spatialPlayer.position.z;
    let height = this.aspectRatio; // desired height to fit WHY IS THIS CALLED HEIGHT?
    this.camera.fov = Math.atan(height / dist) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    console.log(this.spatialPlayer)
  }

  private async loadGawdConfig(url: string): Promise<any> {
    const response = await fetch(url)
    return await response.json()
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

  public get aspectRatio(): number {
    return this.props.container.clientWidth / this.props.container.clientHeight
  }
}
