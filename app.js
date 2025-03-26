/**
 * 主应用入口
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化星空背景
    Starfield.init();
    
    // 导航切换
    const musicTimelineBtn = document.getElementById('musicTimelineBtn');
    const arAlbumBtn = document.getElementById('arAlbumBtn');
    const musicTimeline = document.getElementById('musicTimeline');
    const arAlbum = document.getElementById('arAlbum');
    
    musicTimelineBtn.addEventListener('click', () => {
        musicTimelineBtn.classList.add('active');
        arAlbumBtn.classList.remove('active');
        musicTimeline.classList.add('active');
        arAlbum.classList.remove('active');
    });
    
    arAlbumBtn.addEventListener('click', () => {
        arAlbumBtn.classList.add('active');
        musicTimelineBtn.classList.remove('active');
        arAlbum.classList.add('active');
        musicTimeline.classList.remove('active');
    });
    
    console.log('应用初始化完成');
});