import { SpatialProps } from './spatial-viewer';
import { PlayerProps } from '..';
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
    constructor(init?: Partial<Gawd>);
}
declare class GawdAsset {
    url: string;
    spatial: string;
    quilt: GawdQuilt;
    quiltType: string;
    size: Resolution;
    viewSize: Resolution;
    contentType: string;
    constructor(init?: Partial<GawdAsset>);
}
declare class GawdQuilt {
    columns: number;
    rows: number;
    constructor(init?: Partial<GawdQuilt>);
}
declare class Resolution {
    width: number;
    height: number;
    constructor(init?: Partial<Resolution>);
}
export { Props as PlayerProps, Gawd, GawdAsset, GawdQuilt, Resolution };
export default class Player {
    private _props;
    private scene;
    private renderer;
    private spatialPlayer;
    private camera;
    private clock;
    private gawd;
    private video;
    private startAngle;
    private targetAngle;
    private totalAngles;
    private aniCurTime;
    private aniDuration;
    constructor(props?: Props);
    private setProps;
    private initThree;
    private resize;
    private initGawd;
    private initMedia;
    private loadSpatialPlayer;
    private loadGawdConfig;
    private onMouseMove;
    private render;
    private lerp;
    dispose(): void;
    get aspectRatio(): number;
    get props(): PlayerProps;
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
