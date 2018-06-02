/*jshint esversion: 6 */


const {
    ipcRenderer
} = require('electron');
const fs = require('fs')
const child = require('child_process')

const toggleMirror = document.querySelector('#toggleMirror');
const toggleCapture = document.querySelector('#toggleCapture');
// const toggleDev = document.querySelector('#toggleDev');
const filter = document.querySelector('#filter');
const aside = document.querySelector('aside')
const toggleWindow = document.querySelector('#toggleWindow');
const exit = document.querySelector('#exit');
const video = document.querySelector('#video');
// const download = document.querySelector('#download');
const canvas = document.querySelector('#canvas');
const shot_wav = document.querySelector('#shot_wav');

let vw, vh; //视频分辨率,取决于摄像头
//访问用户媒体设备的兼容方法


//当用户同意打开摄像头后   
//当然,在electron中因为node的权限足够大到不需要经过用户同意....
function success(stream) {
    //兼容webkit核心浏览器
    // const CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
    // console.log(stream);

    //video.src = CompatibleURL.createObjectURL(stream);
    video.srcObject = stream;
    video.play().then( //返回promise !!!!
        () => { //画布设置为为摄像头的分辨率!!!!!
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

//调用用户媒体设备, 访问摄像头
//醉了,摄像头是720p的,还没我屏幕分辨率高...
(function getCamera(constraints, success, error) {
    let get = undefined;
    // 影响方法的运行结果有两个因素:参数和对象
    if (get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)) {
        //最新的标准API  //promise对象
        //返回的promise对象可能既不会resolve也不会reject，因为用户不是必须选择允许或拒绝。
        get(constraints).then(success).catch(error);
    } else if (get = (navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia).bind(navigator)) {
        //webkit核心浏览器  //firfox浏览器  //旧版API
        get(constraints, success, error)
    } else {
        alert('不支持访问用户媒体,程序即将退出');
        ipcRenderer.send('exit');
    }
})({
    video: {
        width: {
            min: 1280
        },
        height: {
            min: 720
        }
    }
}, success, error);

// capture.addEventListener('click', function () {
//这个也行..
// context.drawImage(video, 0, 0, 480, 320);
// });

toggleMirror.addEventListener('click', function () {
    if (video.classList.contains('mirror')) {
        document.title = `${vw} * ${vh} --- 自然`;
        video.classList.remove('mirror');
    } else {
        document.title = `${vw} * ${vh} --- 镜像`;
        video.classList.add('mirror');
    }
});


exit.addEventListener('click', () => {
    ipcRenderer.send('exit')
});

toggleWindow.addEventListener('click', () => {
    ipcRenderer.send('toggleWindow');
})


toggleCapture.addEventListener('click', (e) => {
    // alert同步阻塞线程,起到暂停的作用 
    if (confirm('是否保存?')) { //同步的
        shot_wav.play(); //播放卡擦声
        canvas.getContext("2d").drawImage(video, 0, 0); //应该是同步吧,因为不考虑显示..
        // download.download = new Date().toString().substr(0, 24); //文件名
        // download.href = canvas.toDataURL("image/png");
        // 去掉前面的`data:image/png;base64,`
        let base64 = canvas.toDataURL("image/png").replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
        // replace第一个参数如果是字符串对象只会替换第一个匹配...全局匹配得用正则//g
        // 目录拼接到与.app目录同级的目录
        let fileName = `${__dirname}/../../../../ugly_selfie_${new Date().toString().substr(0, 24)}.png`.replace(/ /g, '-');

        //writeFileSync
        fs.writeFile(fileName, dataBuffer, err => {
            if (err) console.log(err);
            else {
                console.log(`图片写入成功:\n${fileName}`);
                child.exec(`open ${fileName}`)
            }
        })
        // 这一步发生了crush...待解决...
        // 貌似通过<a>标签下载本地大图片会导致href属性过大而崩溃......
        // download.click();
    }
})

// electron囊括了浏览器和nodejs的核心库:
// 既包含DOM也有深入OS的模块
console.log('__dirname: ' + __dirname);
console.log('See ur Pathetic true Face !')