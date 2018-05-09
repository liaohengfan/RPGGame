import * as THREE from 'three';
import {EventDispatcher} from "three";
const CHANGE_EVENT = { type: 'change' };
const START_EVENT = { type: 'start' };
const END_EVENT = { type: 'end' };

const STATE = {
    NONE: - 1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_DOLLY: 4,
    TOUCH_PAN: 5
};
interface ThreeEvent extends Event {
    clientX: number;
    clientY: number;
    deltaY: number;
    button: THREE.MOUSE;
    touches: Array<any>;
    keyCode: number;
}
class DeviceOrientationControls extends EventDispatcher{
    object:any;
    enabled:any=false;
    dRenabled:any=false;
    deviceOrientation:any={};
    screenOrientation:any=0;
    alpha:any=0;
    alphaOffsetAngleZ:any=0;
    alphaOffsetAngleY:any=0;
    update:any=null;
    connect:any=null;
    disconnect:any=null;
    updateAlphaOffsetAngle:any=null;
    dispose:any=null;

    onTouchStartFun:EventListener;
    onTouchMoveFun:EventListener;
    onTouchEndFun:EventListener;
    state:number=STATE.NONE;

    rotateStart:THREE.Vector2 = new THREE.Vector2();
    rotateEnd:THREE.Vector2 = new THREE.Vector2();
    rotateDelta:THREE.Vector2 = new THREE.Vector2();
    rotateSpeed:number=1;
    enableRotate:boolean=true;
    domElement: HTMLElement | HTMLDocument;
    constructor(object:THREE.Object3D,domElement:any=undefined){
        super();
        var scope = this;
        this.object = object;
        this.object.rotation.reorder( "YXZ" );
        this.domElement = ( domElement !== undefined ) ? domElement : document;
        this.enabled = true;

        this.deviceOrientation = {};
        this.screenOrientation = 0;

        this.alpha = 0;
        this.alphaOffsetAngleZ = 0;
        this.alphaOffsetAngleY = 0;


        var onDeviceOrientationChangeEvent = function( event:any ) {
            scope.enabled=true;
            scope.deviceOrientation = event;

        };

        var onScreenOrientationChangeEvent = function() {

            scope.enabled=true;
            scope.screenOrientation = window.orientation || 0;

        };

        // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

        var setObjectQuaternion = function() {

            var zee = new THREE.Vector3( 0, 0, 1 );

            var euler = new THREE.Euler();

            var q0 = new THREE.Quaternion();

            var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

            return function( quaternion:any, alpha:any, beta:any, gamma:any, orient:any ) {

                euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

                quaternion.setFromEuler( euler ); // orient the device

                quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

                quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

            }

        }();
        this.connect = function() {

            onScreenOrientationChangeEvent(); // run once on load

            window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
            window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

            scope.enabled = true;

        };

        this.disconnect = function() {
            window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
            window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
            scope.enabled = false;
        };

        this.update = function() {

            if ( scope.enabled === false ) return;

            var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngleZ : 0; // Z
            var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
            var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
            var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

            if(!alpha&& !beta && !gamma && !orient){
                scope.enabled=false;
                return;
            }
            setObjectQuaternion( scope.object.quaternion, alpha, -beta, -gamma, orient );
            this.alpha = alpha;

        };

        this.updateAlphaOffsetAngle = function( angle:any ) {

            this.alphaOffsetAngle = angle;
            this.update();

        };

        this.onTouchStartFun = ( event: ThreeEvent ) => {
            if ( this.dRenabled === false) return;

            switch ( event.touches.length ) {
                // one-fingered touch: rotate
                case 1: {
                    if ( this.enableRotate === false ) return;

                    this.rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    this.state = STATE.TOUCH_ROTATE;
                } break;
                default: {
                    this.state = STATE.NONE;
                }
            }

            if ( this.state !== STATE.NONE ) {
                this.dispatchEvent( START_EVENT );
            }
        };

        this.onTouchMoveFun = ( event: ThreeEvent ) => {

            if ( this.dRenabled === false) return;
            event.preventDefault();
            event.stopPropagation();

            switch ( event.touches.length ) {
                // one-fingered touch: rotate
                case 1: {
                    if ( this.enableRotate === false) return;
                    if ( this.state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

                    this.rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

                    var element = this.domElement === document ? this.domElement.body : this.domElement;

                    // rotating across whole screen goes 360 degrees around
                    this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / (element as any).clientWidth * this.rotateSpeed );

                    // rotating up and down along whole screen attempts to go 360, but limited to 180
                    this.rotateUp( 2 * Math.PI * this.rotateDelta.y / (element as any).clientHeight * this.rotateSpeed );

                    this.rotateStart.copy( this.rotateEnd );

                    this.update();
                } break;
                default: {
                    this.state = STATE.NONE;
                }
            }
        };

        this.onTouchEndFun = ( event: Event ) => {

            if ( this.dRenabled === false ) return;
            this.dispatchEvent( END_EVENT );
            this.state = STATE.NONE;
        };

        this.domElement.addEventListener( 'touchstart', this.onTouchStartFun, false );
        this.domElement.addEventListener( 'touchend', this.onTouchEndFun, false );
        this.domElement.addEventListener( 'touchmove', this.onTouchMoveFun, false );


        this.dispose = function() {

            this.disconnect();

        };
    }

    rotateLeft( angle: number ) {
        this.alphaOffsetAngleZ-=(angle*.5);
    }
    rotateUp( angle: number ) {
        this.alphaOffsetAngleY-=(angle*.5);
    }
}

export { DeviceOrientationControls};