(() => {

    //создание первого слайдера
    let lastIndex=0;
    Magic.create('.cart-slider', {
        slideToScroll: 1,
        slideToShow: 2,
        nextButton: $('<button class="slide-btn next"></button>'),
        prevButton: $('<button class="slide-btn prev"></button>'),
        dotBox: $('<div class="scroll-track"><div class="scroll-item"></div></div>'),
            onScroll: function (index,slider) {
                if(lastIndex!=index){
                    let item=$('.scroll-item');
                    let size=parseFloat(item.css('width'));
                    let x=parseFloat($('.scroll-track').css('width'))/slider.maxSlidingNum;

                    item.css({
                        'left':parseFloat(item.css('left'))+((lastIndex<index)?+x-size:-x+size)+'px'
                    })
                    lastIndex=index;
                }
            },
        breakpoints:[
            {
                media: '(max-width: 767px)'
            },
            {
                media: '(max-width: 476px)',
                props: {
                    slideToShow: 1,
                    slideToScroll: 1,
                    onScroll: function (index,slider) {
                        if(lastIndex!=index){
                            let item=$('.scroll-item');
                            let size=parseFloat(item.css('width'));
                            let x=parseFloat($('.scroll-track').css('width'))/slider.maxSlidingNum;
        
                            item.css({
                                'left':parseFloat(item.css('left'))+((lastIndex<index)?+x:-x)+'px',
                                'transform':'translate(-50%, -50%)'
                            })
                            lastIndex=index;
                        }
                    },
                }
            }
        ] 
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

    function closeThemes(t) {
        t.animate({
            opacity: 0,
            top: '400%'
        }, function () {
            t.css('display', 'none')
        });
    }
    function openThemes() {
        $('.themes-list').css('display', 'block').animate({
            opacity: 1,
            top: '70%'
        });
    }
    $('.switch-theme').on('mouseenter', function (event) {
        openThemes();
    })
    $('.themes-list').on('mouseleave', function (event) {
        if ($(event.relatedget) != $('.switch-theme')) {
            closeThemes($(this));
        }
    })
    $('.theme-item').on('click', function (event) {
        $('.switch-theme>span').text($(this).text());
        closeThemes($('.themes-list'));
    })

})();