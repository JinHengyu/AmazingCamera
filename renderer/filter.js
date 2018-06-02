

function toggleFilter(){
    if(filter.isShow){
        aside.style.right='-30%'
        filter.isShow=false;
    }else{
        aside.style.right='0'
        filter.isShow=true;
    }
}


filter.isShow=false;
filter.addEventListener('click',toggleFilter)
video.addEventListener('click',toggleFilter)