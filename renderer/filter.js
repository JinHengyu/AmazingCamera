(function init_filter() {
    global['blur'] = 0
    global['brightness'] = 100
    global['contrast'] = 100
    global['grayscale'] = 0
    global['hue'] = 0
    global['invert'] = 0
    global['opacity'] = 100
    global['saturate'] = 150
    global['sepia'] = 0
})();

// 两个连续的立即函数之间必须加分号！！！

(global.updateFilter = (name, value) => {
    if (name && value) global[name] = value;
    const filter_expression = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hue}deg) invert(${invert}%) opacity(${opacity}%) saturate(${saturate}%) sepia(${sepia}%)`;
    video.style.filter = filter_expression;
})(undefined, undefined);

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