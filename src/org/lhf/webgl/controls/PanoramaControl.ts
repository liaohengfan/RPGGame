import {OrbitControls, START_EVENT, STATE, ThreeEvent} from "./OrbitControls";
import * as THREE from 'three';
import {Camera, PerspectiveCamera} from "three";

/** * 全景摄像头控制器 */
class PanoramaControl extends OrbitControls{

    static FOV: number = 60;

    //小行星视角配置
    static FOV_MIN: number = 30;
    static FOV_MAX: number = 80;

    //panorama
    panorama:boolean=false;
    curFov: number = 60;

    camera:PerspectiveCamera;

    constructor(object: THREE.Camera, domElement?: HTMLElement, domWindow?: Window){
        super(object, domElement, domWindow);
        this.camera=object as PerspectiveCamera;
    }

    dollyIn( dollyScale:number ) {
        if(this.panorama){
            this.panoramaIn(dollyScale);
            return;
        }
        if ( this.object instanceof THREE.PerspectiveCamera ) {
            this.scale /= dollyScale;
        } else if ( this.object instanceof THREE.OrthographicCamera ) {
            const cobject:THREE.OrthographicCamera=(this.object as THREE.OrthographicCamera);
            cobject.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, cobject.zoom * dollyScale ) );
            cobject.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {
            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
            this.enableZoom = false;
        }
    }

    dollyOut( dollyScale:number ) {

        if(this.panorama){
            this.panoramaOut(dollyScale);
            return;
        }

        if ( this.object instanceof THREE.PerspectiveCamera ) {
            this.scale *= dollyScale;
        } else if ( this.object instanceof THREE.OrthographicCamera ) {
            const cobject:THREE.OrthographicCamera=(this.object as THREE.OrthographicCamera);
            cobject.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, cobject.zoom / dollyScale ) );
            cobject.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {
            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
            this.enableZoom = false;
        }
    }

    initScaleControl():void{
        this.panorama=true;
    }
    panoramaIn=(val:number)=>{
        let fov:number=this.curFov/=val;
        fov>PanoramaControl.FOV_MAX?fov=PanoramaControl.FOV_MAX:fov;
        this.curFov=fov;
        this.camera.fov=fov;
        this.camera.updateProjectionMatrix();
    };

    panoramaOut=(val:number)=>{
        let fov:number=this.curFov*=val;
        fov<PanoramaControl.FOV_MIN?fov=PanoramaControl.FOV_MIN:fov;
        this.curFov=fov;
        this.camera.fov=fov;
        this.camera.updateProjectionMatrix();
    };

    onTouchStart = ( event: ThreeEvent ) => {
        if ( this.enabled === false && !this.panorama) return;

        switch ( event.touches.length ) {
            // one-fingered touch: rotate
            case 1: {
                if ( this.enableRotate === false || (this.panorama && !this.enabled) ) return;

                this.rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                this.state = STATE.TOUCH_ROTATE;
            } break;
            // two-fingered touch: dolly
            case 2:	{
                if ( this.enableZoom === false ) return;

                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

                var distance = Math.sqrt( dx * dx + dy * dy );
                this.dollyStart.set( 0, distance );
                this.state = STATE.TOUCH_DOLLY;
            } break;
            // three-fingered touch: pan
            case 3: {
                if ( this.enablePan === false || (this.panorama && !this.enabled) ) return;

                this.panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                this.state = STATE.TOUCH_PAN;
            } break;
            default: {
                this.state = STATE.NONE;
            }
        }

        if ( this.state !== STATE.NONE ) {
            this.dispatchEvent( START_EVENT );
        }
    };

    onTouchMove = ( event: ThreeEvent ) => {

        if ( this.enabled === false) return;
        //if(this.enabled) {
        event.preventDefault();
        event.stopPropagation();
        //}

        switch ( event.touches.length ) {
            // one-fingered touch: rotate
            case 1: {
                if ( this.enableRotate === false|| (this.panorama && !this.enabled) ) return;
                if ( this.state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

                this.rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

                var element = this.domElement === document ? (this.domElement as HTMLDocument).body : this.domElement;

                // rotating across whole screen goes 360 degrees around
                this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / (element as any).clientWidth * this.rotateSpeed );

                // rotating up and down along whole screen attempts to go 360, but limited to 180
                this.rotateUp( 2 * Math.PI * this.rotateDelta.y / (element as any).clientHeight * this.rotateSpeed );

                this.rotateStart.copy( this.rotateEnd );

                this.update();
            } break;
            // two-fingered touch: dolly
            case 2: {
                if ( this.enableZoom === false ) return;
                if ( this.state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

                //console.log( 'handleTouchMoveDolly' );
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

                var distance = Math.sqrt( dx * dx + dy * dy );

                this.dollyEnd.set( 0, distance );

                this.dollyDelta.subVectors( this.dollyEnd, this.dollyStart );

                if ( this.dollyDelta.y > 0 ) {
                    this.dollyOut( this.getZoomScale() );
                } else if ( this.dollyDelta.y < 0 ) {
                    this.dollyIn( this.getZoomScale() );
                }

                this.dollyStart.copy( this.dollyEnd );
                this.update();
            } break;
            // three-fingered touch: pan
            case 3: {
                if ( this.enablePan === false || (this.panorama && !this.enabled) ) return;
                if ( this.state !== STATE.TOUCH_PAN ) return; // is this needed?...
                this.panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                this.panDelta.subVectors( this.panEnd, this.panStart );
                this.pan( this.panDelta.x, this.panDelta.y );
                this.panStart.copy( this.panEnd );
                this.update();
            } break;
            default: {
                this.state = STATE.NONE;
            }
        }
    };
}

export {PanoramaControl};