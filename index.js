const koa = require("koa");
const mount = require("koa-mount");
const koastatic = require("koa-static");

//const router =  new require('koa-router')();

const logger = require("koa-logger");

const app = new koa();
const port = process.env.PORT || "3000";
const http = require('http');
//replace your ffmpeg.exe to the path
const ffmpegPath = "D:\\Tools\\ffmpeg-20170321-db7a05d-win64-static\\bin\\ffmpeg.exe";
//replace your ffprobe.exe to the path
const ffprobePath = "D:\\Tools\\ffmpeg-20170321-db7a05d-win64-static\\bin\\ffprobe.exe";
//replace your stream source to the path
const sourcePath = "rtsp://xxx.xxxx.xxx.xxx/xx"


let io;
console.log("here");

console.log(__dirname + '/public');
app.use(logger());
app.use(mount('/public',koastatic(__dirname + '/public')));
console.log(__dirname + '/stream');
app.use(mount("/stream",koastatic(__dirname + '/stream')));
app.use(mount("/scripts",koastatic(__dirname + '/scripts')));

// app.use(ctx=>{
//     console.log("2");
//     ctx.body="Hello world";
// });
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

let server = app.listen(port, () => {
  console.log("started http://localhost:", port);
  recordTest();
});

function recordTest(){
    var ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg({ source: sourcePath })
  .addOption('-g',10)
  .addOption('-hls_list_size', 2)
  .addOption('-hls_time', 3)
  .addOption('-hls_flags', 'delete_segments')
  .on('end', function () {
    console.log('ended recording');
    process.exit(0);
  })
  .on('error', function (err) {
    console.log('an error happened: ' + err.message);
  })
  .save( __dirname + '/stream/test.m3u8');
}