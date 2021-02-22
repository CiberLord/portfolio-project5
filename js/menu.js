(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const media450=window.matchMedia('(max-width: 450px)');

    let isOpen=false;
    let menuList=$('<div class="menu-list"></div>');
    let menu=$('.menu').append(menuList);
    let menuButton=$('.menu-button');



    if(media.matches){
        menuInit();
    }
    media.addListener(function(e){
        if(e.matches){
            menuInit();
        }
    })
    if(media450.matches){
        menuList.append($('.contact-item'));
    }
    media450.addListener(function(e){
        if(e.matches){
            menuList.append($('.contact-item'));            
        }
    })

    function menuInit(){
        menuList.append($('.menu-item'));
        menuButton.on('click',function(){
            console.log("heello")
            if(!isOpen){
                menuList.css('display','block').animate({
                    opacity: 1,
                    top: '100%'
                })
            }else{
                menuList.animate({
                    opacity: 0,
                    top: '300%'
                },function(){
                    menuList.css('display','none')
                })
            }
            isOpen=!isOpen;
        })
    }
    
}) ();


