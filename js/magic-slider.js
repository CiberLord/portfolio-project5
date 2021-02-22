(function () {


    let m = {};

    let Slider = function (props) {
        this.currentIndex = 0;//индекс текущего элменета
        this.deltaX = 0;//ширина самого длинного слайла с учетом горизонтального отступа
        this.slides = [];//массив слайдов
        this.viewport = '<div class="magic-viewport"></div>';//то место будут хранится слайдеры

        // параметрические свойства
        this.prev = $('<button class="magic-button magic-prev-button">prev</button>');//кнпока назад
        this.next = $('<button class="magic-button magic-next-button">next</button>')//кнопка вперед
        this.infinite = false;
        this.slideToShow = 1;//количество которые нужно показать в окне
        this.slideToScroll = 1;//на сколько слайдов скролить
        this.buttons = true;
        this.dots = false;
        this.dotbox=null;
        this.dotList = [];
        this.dotItemClass = "magic-dots-item";
        this.activedotItemClass = "magic-dot-activ";
        this.onScroll = null; //функция срабатывающая при скролле слайдов
        // перебор всех заданных свойств аргумента
        if (props) {
            for (let key of Object.keys(props)) {
                switch (key) {
                    case 'prevButton': {
                        this.prev = props[key];
                        break;
                    }
                    case 'nextButton': {
                        this.next = props[key];
                        break;
                    }
                    case 'slideToShow': {
                        this.slideToShow = props[key]
                        break;
                    }
                    case 'slideToScroll': {
                        this.slideToScroll = props[key];
                        break;
                    }
                    case 'hasButton': {
                        this.buttons = props[key];
                        break;
                    }
                    case 'dots': {
                        this.dots = props[key];
                        break;
                    }
                    case 'dotBox':{
                        this.dotbox=props[key];
                        break;
                    }
                    case 'onScroll': {
                        this.onScroll = props[key];
                        break;
                    }
                    case 'breakpoint':{
                        init(this,props[key].media,props[key].props);
                        break;
                    }
                }
            }
        }
    }


    // создание слайдера
    m.create = function (selector, props) {



        let s = new Slider(props);//обьект слайдера

        let maxwidth = 0, maxheight = 0; //слайд с максимальной шириной и высотой
        let querySlides = $(selector).addClass('magic-slider-container').children().addClass('magic-slide').wrapAll(s.viewport).each(function (index, el) {

            //тут идет поиск самого большого слайда без учета маргинов
            let mw = parseFloat($(el).css('width'));
            let mh = parseFloat($(el).css('height'));
            if (mw > maxwidth)
                maxwidth = mw;
            if (mh > maxheight)
                maxheight = mh;
            s.slides.push($(el));
        });
        if (s.slideToShow > s.slides.length) {
            s.slideToShow = s.slides.length;
        }
        if (s.slideToScroll > s.slideToShow) {
            s.slideToScroll = s.slideToShow;
        }

        let itemMarginX = parseFloat(querySlides.css('margin-left'));
        let sliderpaddingX = parseFloat($(selector).css('padding-left'));
        let sliderpaddingY = parseFloat($(selector).css('padding-top'));
        //длина на которую должный смещаться по оси х слайды
        querySlides.css('margin', '0px');//обнуление всех маргинов
        s.deltaX = itemMarginX + maxwidth + sliderpaddingX;

        //задание ширины и высоты слайдера как размеры самого большого слайда в контэйнере

        $(selector).css({
            'width': s.slideToShow * maxwidth + (s.slideToShow + 1) * sliderpaddingX + 'px',
            'height': maxheight + 2 * sliderpaddingY + 'px'
        })
        
        //добавление кнопок
        if (s.buttons) {
            $(selector).append(s.prev).append(s.next);
        }

        //добавление доттеров
        if(s.dotbox!=null){
            let dotcontainer = $('<div class="magic-dots-box"></div>').css({
                'width': $(selector).css('width')
            });
            dotcontainer.append(s.dotbox);
            $(selector).after(dotcontainer);
        }
        if (s.dots) {
            let dotcontainer = $('<div class="magic-dots-box"></div>').css({
                'width': $(selector).css('width')
            });
            s.dotbox=$('<div class="magic-dots-list"></div>');
            for (let i = 0; i < s.slides.length; i++) {
                let dotitem = $('<div class="' + s.dotItemClass + '"></div>');
                s.dotList.push(dotitem);
                s.dotbox.append(dotitem);
            }
            dotcontainer.append(s.dotbox);
            $(selector).after(dotcontainer);
            s.dotList[0].addClass(s.activedotItemClass);
            if (s.onScroll == null) {
                s.onScroll = function (index) {
                    for (let i = 0; i < s.dotList.length; i++) {
                        s.dotList[i].removeClass(s.activedotItemClass);
                    }
                    s.dotList[index].addClass(s.activedotItemClass);
                }
            }
        }

        //позицинирование слайдов
        let x = 0;
        for (let i = 0; i < s.slides.length; i++) {
            s.slides[i].css('left', x + 'px')
            x += s.deltaX;
        }

        s.prev.on('click', function () {
            if (!s.infinite) {

                let countScroll = 1;
                let index = s.currentIndex - s.slideToScroll;
                if (index > 0) {
                    countScroll = s.slideToScroll
                    s.currentIndex = index;
                } else {
                    countScroll = s.slideToScroll + index;
                    s.currentIndex = 0;
                }
                console.log("prev " + s.currentIndex)
                console.log("prev count" + countScroll)
                for (let i = 0; i < s.slides.length; i++) {
                    s.slides[i].animate({
                        left: parseFloat(s.slides[i].css('left')) + countScroll * s.deltaX
                    }, 300);
                }
                if(s.onScroll!=null) s.onScroll(s.currentIndex);
            }
        })
        s.next.on('click', function () {
            if (!s.infinite) {
                let countScroll = 1;
                let index = s.currentIndex + s.slideToScroll;
                if (index + s.slideToShow < s.slides.length) {
                    countScroll = s.slideToScroll
                    s.currentIndex = index;
                } else {
                    let d = s.currentIndex + s.slideToShow;
                    countScroll = (s.slides.length - d > 0) ? s.slides.length - d : 0;
                    s.currentIndex = s.slides.length - s.slideToShow;
                }
                for (let i = 0; i < s.slides.length; i++) {
                    s.slides[i].animate({
                        left: parseFloat(s.slides[i].css('left')) - countScroll * s.deltaX
                    }, 300);
                }
                if(s.onScroll!=null) s.onScroll(s.currentIndex);
            }
        })


    }

    function init(){
        
    }
    

    window.Magic = m;

})();