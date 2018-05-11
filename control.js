
const { ipcRenderer } = require('electron');

const toggleMirror = document.querySelector('#toggleMirror');
const toggleCapture = document.querySelector('#toggleCapture');
const toggleDev = document.querySelector('#toggleDev');
const toggleWindow = document.querySelector('#toggleWindow');
const exit = document.querySelector('#exit');
const video = document.querySelector('#video');
const download = document.querySelector('#download');
const canvas = document.querySelector('#canvas');
const shot_wav = document.querySelector('#shot_wav');

let vw, vh; //视频分辨率,取决于摄像头
//访问用户媒体设备的兼容方法
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API  //promise对象
        //返回的promise对象可能既不会resolve也不会reject，因为用户不是必须选择允许或拒绝。
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}

//当用户同意打开摄像头后   
//当然,在electron中因为node的权限足够大到不需要经过用户同意....
function success(stream) {
    //兼容webkit核心浏览器
    // const CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
    // console.log(stream);
    
    //video.src = CompatibleURL.createObjectURL(stream);
    video.srcObject = stream;
    video.play().then(  //返回promise !!!!
        () => {            //画布设置为为摄像头的分辨率!!!!!
            canvas.width = vw = video.videoWidth;
            canvas.height = vh = video.videoHeight;
            document.title = `${vw} * ${vh} --- 自然`;
        }
    );
    // var Promise = HTMLMediaElement.play();
}

function error(error) {
    console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
}

if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    //调用用户媒体设备, 访问摄像头
    //醉了,摄像头是720p的,还没我屏幕分辨率高...
    getUserMedia({ video: { width: { min: 1280 }, height: { min: 720 } } }, success, error);
} else {
    alert('不支持访问用户媒体');
}

// capture.addEventListener('click', function () {
    //这个也行..
// context.drawImage(video, 0, 0, 480, 320);
// });

toggleMirror.addEventListener('click', function () {
    if (video.classList.contains('mirror')) {
        document.title = `${vw} * ${vh} --- 自然`;
        video.classList.remove('mirror');
    }
    else {
        document.title = `${vw} * ${vh} --- 镜像`;
        video.classList.add('mirror');
    }
});


toggleDev.addEventListener('click', () => {
    ipcRenderer.send('toggleDev')
});

exit.addEventListener('click', () => {
    ipcRenderer.send('exit')
});

toggleWindow.addEventListener('click', () => {
    ipcRenderer.send('toggleWindow');
})


toggleCapture.addEventListener('click', (e) => {
    if (video.paused) {
        e.target.innerHTML = '拍照';
        video.play();
    }
    else {
        e.target.innerHTML = '重拍';
        video.pause();
        if (confirm('是否保存?')) { //同步的
            shot_wav.play();    //播放卡擦声
            canvas.getContext("2d").drawImage(video, 0, 0); //应该是同步吧,因为不考虑显示..
            console.log('1');
            download.download = new Date().toString().substr(0, 24);    //文件名
            console.log('2');
            download.href = canvas.toDataURL("image/png");
            console.log('3');
            download.click();
            console.log('4');
        }
    }
})