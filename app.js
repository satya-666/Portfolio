const video1 = document.getElementById('projectvideo1');
const video2 = document.getElementById('projectvideo2');
const video3 = document.getElementById('projectvideo3');

const videolist = [video1, video2, video3];

videolist.forEach(function(video){
    video.addEventListener('mouseover',function(){
        video.play()
    })
    video.addEventListener('mouseout',function(){
        video.pause()
    })
})