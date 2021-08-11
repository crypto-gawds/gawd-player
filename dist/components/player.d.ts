import { SpatialProps } from './spatial-viewer';
declare class Props {
    url: string;
    container: HTMLElement;
    enableMouseMove: Boolean;
    defaultAsset: GawdAsset;
    defaultMobileAsset: GawdAsset;
    spatialProps: SpatialProps;
}
declare class Gawd {
    name: string;
    hash: string;
    assets: Array<GawdAsset>;
}
declare class GawdAsset {
    url: string;
    spatial: string;
    quilt: GawdQuilt;
    quiltType: string;
    size: Resolution;
    viewSize: Resolution;
    contentType: string;
}
declare class GawdQuilt {
    columns: number;
    rows: number;
}
declare class Resolution {
    width: number;
    height: number;
}
export { Props as PlayerProps, Gawd, GawdAsset, GawdQuilt, Resolution };
export default class Player {
    private props;
    private scene;
    private renderer;
    private spatialPlayer;
    private camera;
    private clock;
    private gawd;
    private startAngle;
    private targetAngle;
    private totalAngles;
    private aniCurTime;
    private aniDuration;
    constructor(props?: Props);
    private setProps;
    private initThree;
    private initGawd;
    private initMedia;
    private loadSpatialPlayer;
    private loadGawdConfig;
    private onMouseMove;
    private render;
    private lerp;
    get aspectRatio(): number;
    EasingFunctions: {
        linear: (t: any) => any;
        easeInQuad: (t: any) => number;
        easeOutQuad: (t: any) => number;
        easeInOutQuad: (t: any) => number;
        easeInCubic: (t: any) => number;
        easeOutCubic: (t: any) => number;
        easeInOutCubic: (t: any) => number;
        easeInQuart: (t: any) => number;
        easeOutQuart: (t: any) => number;
        easeInOutQuart: (t: any) => number;
        easeInQuint: (t: any) => number;
        easeOutQuint: (t: any) => number;
        easeInOutQuint: (t: any) => number;
    };
}
