document.addEventListener("DOMContentLoaded", function() {
    const video1 = document.getElementById('projectvideo1');
    const video2 = document.getElementById('projectvideo2');
    const video3 = document.getElementById('projectvideo3');

    const videolist = [video1, video2, video3];

    videolist.forEach(function(video) {
        if (video) {  // Ensure the video element exists
            video.addEventListener('mouseover', function() {
                // Ensure the video is paused initially and then play on hover
                if (video.paused) {
                    video.play();
                }
            });
            video.addEventListener('mouseout', function() {
                // Pause the video when mouse leaves
                if (!video.paused) {
                    video.pause();
                }
            });
        }
    });
});
