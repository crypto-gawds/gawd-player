declare class Props {
    url: string;
    container: HTMLElement;
}
declare class Gawd {
    name: string;
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
export { Props as PlayerProps, Gawd, GawdAsset };
export default class Player {
    private props;
    private scene;
    private renderer;
    private spatialPlayer;
    private camera;
    constructor(props?: object);
    private initThree;
    private render;
    private onMouseMove;
    private initGawd;
    private initMedia;
    private loadSpatialPlayer;
    private loadGawdConfig;
    private setProps;
    get aspectRatio(): number;
}
