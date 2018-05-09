/** * 摄像头初始化 */
class CameraInit {
    getUserMedia: any = null;
    exArray: any[] = [];
    video: any = null;

    constructor(video: HTMLVideoElement) {
        this.video = video;
        let NAV: any = navigator;
        let WIND: any = window;
        navigator.getUserMedia = navigator.getUserMedia || NAV.webkitGetUserMedia || NAV.mozGetUserMedia || NAV.msGetUserMedia;
        window.URL = WIND.URL || WIND.webkitURL || WIND.mozURL || WIND.msURL;
        this.getUserMedia = NAV.getUserMedia;
        let MEDIASTREAMTRACK: any = WIND.MediaStreamTrack;
        if (!MEDIASTREAMTRACK.getSources) {
            return;
        }
        try {
            MEDIASTREAMTRACK.getSources((sourceInfos: any)=> {
                let i: number = 0;
                let sourceInfo: any = null;
                for (i = 0; i != sourceInfos.length; ++i) {
                    sourceInfo = sourceInfos[i];
                    //这里会遍历audio,video，所以要加以区分
                    if (sourceInfo.kind === 'video') {
                        this.exArray.push(sourceInfo.id);
                    }
                }
                this.getMedia();
            });
        } catch (e) {
            throw new Error("MediaStreamTrack Fun not!");
        }

        //this.getMedia();

        /*setTimeout(()=> {
            this.getMedia();
        },2000);*/
    }

    /**     * 获取摄像头     */
    getMedia() {
        let that = this;
        let video = that.video;

        function successFunc(stream: any) {
            if (video.mozSrcObject !== undefined) {
                //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持
                video.mozSrcObject = stream;
            }
            else {
                video.src = window.URL && window.URL.createObjectURL(stream) || stream;
            }
            video.play();
        }

        function errorFunc(e: any) {
            alert('Error！' + e);
        }
        if (navigator.getUserMedia) {
            let config: any = {
                'video': {
                    'optional': [{
                        'sourceId': that.exArray[1] //0为前置摄像头，1为后置
                    }]
                },
                'audio': false
            };
            navigator.getUserMedia(config, successFunc, errorFunc);    //success是获取成功的回调函数
        }
        else {
            alert('Native device media streaming (getUserMedia) not supported in this browser.');
        }
    }
}
export default CameraInit;