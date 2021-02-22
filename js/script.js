(() => {

    // const media650=matchMedia('(max-width: 650px)');

    Magic.create('.cart-slider', {
        slideToScroll: 1,
        slideToShow: 2,
        nextButton: $('<button class="slide-btn next"></button>'),
        prevButton: $('<button class="slide-btn prev"></button>'),
        breakpoint: {
            media: '(max-width: 650px)',
            props: {
                slideToShow: 1
            }
        }
    })




    //галлерея из 6ти изображений
    gw.create('.gallery__grid', {
        exitButton: $('<div class="gallery-exit"><span class="fs"></span><span class="ss"></span></div>')
    });


    // работа с инпутами
    $('.input').on('click', function () {
        if ($(this).attr('value') === 'Введите имя' || $(this).attr('value') === 'E-mail' || $(this).attr('value') === 'Введите телефон') {
            $(this).attr('value', '');
        }
    })

    function closeThemes(t){
        t.animate({
            opacity: 0,
            top: '400%'
        }, function () {
            t.css('display', 'none')
        });
    }
    function openThemes(){
        $('.themes-list').css('display', 'block').animate({
            opacity: 1,
            top: '70%'
        });
    }
    $('.switch-theme').on('mouseenter', function (event) {
        openThemes();
    })
    $('.themes-list').on('mouseleave', function (event) {
        if($(event.relatedget)!=$('.switch-theme')){
            closeThemes($(this));
        }
    })
    $('.theme-item').on('click',function(event){
        $('.switch-theme>span').text($(this).text());
        closeThemes($('.themes-list'));
    })

})();