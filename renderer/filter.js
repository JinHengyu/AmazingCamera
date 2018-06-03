global['blur'] = 0
global['brightness'] = 100



global.updateFilter = () => {
    const filter_expression = `blur(${blur}px) brightness(${brightness}%)`
    video.style.filter = filter_expression

}

function toggleFilter() {
    if (filter.isShow) {
        aside.style.right = '-30%'
        filter.isShow = false;
    } else {
        aside.style.right = '0'
        filter.isShow = true;
    }
}


filter.isShow = false;
filter.addEventListener('click', toggleFilter)
video.addEventListener('click', toggleFilter)