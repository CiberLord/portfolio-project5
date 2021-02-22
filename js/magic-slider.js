(function () {

    let m = {};

    let Slider = function (selector, props) {
        this.currentIndex = 0;//индекс текущего элменета
        this.deltaX = 0;//ширина самого длинного слайла с учетом горизонтального отступа
        this.slides = [];//массив слайдов
        this.viewport = null;
        this.mh = 0;
        this.mv = 0;
        this.sliderPadding = 0;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.slider = $(selector);
        this.breakpoints = [];//список медиа запросов
        this.maxSlidingNum=0;//максимальное число перелистований
        // параметрические свойства
        this.prev = $('<button class="magic-button magic-prev-button">prev</button>');//кнпока назад
        this.next = $('<button class="magic-button magic-next-button">next</button>')//кнопка вперед
        this.infinite = false; //бесконечное прокручивание
        this.slideToShow = 1;//количество которые нужно показать в окне
        this.slideToScroll = 1;//на сколько слайдов скролить
        this.buttons = true; //показывать или не показывать кнопки
        this.dots = false; //показывать или не покзывать точки
        this.dotbox = null; //контэйнер в котором хранятся скролл штуки
        this.dotList = []; //список точек
        this.dotItemClass = "magic-dots-item"; //стиль точки
        this.activedotItemClass = "magic-dot-activ"; //стиль активной точки
        this.onScroll = null; //функция срабатывающая при скролле слайдов
        

    }
    Slider.prototype.setProps = function (props) {
        
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
                case 'dotBox': {
                    this.dotbox = props[key];
                    break;
                }
                case 'onScroll': {
                    this.onScroll = props[key];
                    break;
                }
                case 'breakpoints': {
                    this.breakpoints=props[key];
                    break;
                }
            }
        }
    }
    Slider.prototype.destroy = function () {
        //удаление слайдера но при этом сохраняется просто верстка
        this.slider.append($('.magic-slide'));
        $('.magic-d').remove();
        this.slider.children().removeClass('magic-slide').attr('style', '');
        this.slider.removeClass('magic-slider-container').attr('style', '');
        this.slides = [];
    }


    // создание слайдера
    m.create = function (selector, props) {
        let s = new Slider(selector, props);//обьект слайдера
        s.setProps(props);
        //инициализация слайдера
        init(s);
        //обработчки событий
        setHandles(s);

        // check media querys
        for (let q of s.breakpoints) {
            checkPoint(s, q.media, q.props);
        }
    }

    function init(s) {
        let maxwidth = 0, maxheight = 0; //велечины с максимальной шириной и высотой слайда
        let querySlides = s.slider.addClass('magic-slider-container').children().addClass('magic-slide').wrapAll('<div class="magic-d magic-viewport"></div>').each(function (index, el) {
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
        s.viewport = $('.magic-viewport');  //viewport
        s.mh = parseFloat(querySlides.css('margin-right'));//горизонтальные отступы в margin слайдов
        s.mv = parseFloat(querySlides.css('margin-top'));//вертикальные отступы в margin слайдов
        s.sliderPadding = parseFloat(s.slider.css('padding-left'));//внутренний оступ слайдера
        s.viewportWidth = s.slideToShow * maxwidth + (s.slideToShow - 1) * s.mh + s.mh; //вычисленная ширина vfiewport
        s.viewportHeight = 2 * s.mv + maxheight;//вычисление высоты viewport
        //установка размеров слайдера
        s.slider.css({
            'width': (s.viewportWidth + 2 * s.sliderPadding) + 'px',
            'height': (s.viewportHeight + 2 * s.sliderPadding) + 'px'
        })
        //установка размеров viewport
        s.viewport.css({
            'left': s.sliderPadding + 'px',
            'top': s.sliderPadding + 'px',
            'width': s.viewportWidth + 'px',
            'height': s.viewportHeight + 'px'
        })
        querySlides.css('margin', '0px');
        s.deltaX = maxwidth + s.mh;
        //позицинирование слайдов
        let x = s.mh / 2;
        for (let i = 0; i < s.slides.length; i++) {
            s.slides[i].css({
                'left': x + 'px',
                'top': s.mv + 'px'
            })
            x += s.deltaX;
        }
        //подсчет максимального количества слайдингов
        let tmp=s.slides.length-s.slideToShow;
        s.maxSlidingNum=((tmp-tmp%s.slideToScroll)/s.slideToScroll)+((tmp%s.slideToScroll===0)?0:1);
        console.log(s.maxSlidingNum);
        //добавление кнопок
        if (s.buttons) {
            s.slider.append(s.prev.addClass('magic-d')).append(s.next.addClass('magic-d'));
        }
        //добавление доттеров
        if (s.dotbox != null) {
            s.slider.after(s.dotbox.addClass('magic-d'));
        }
        if (s.dots) {
            let dotcontainer = $('<div class="magic-d magic-dots-box"></div>').css({
                'width': s.slider.css('width')
            });
            s.dotbox = $('<div class="magic-dots-list"></div>');
            for (let i = 0; i < s.slides.length; i++) {
                let dotitem = $('<div class="magic-d ' + s.dotItemClass + '"></div>');
                s.dotList.push(dotitem);
                s.dotbox.append(dotitem);
            }
            dotcontainer.append(s.dotbox);
            s.slider.after(dotcontainer);
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
    }
    function setHandles(s) {
        this.currentIndex = 0;
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
                for (let i = 0; i < s.slides.length; i++) {
                    s.slides[i].animate({
                        left: parseFloat(s.slides[i].css('left')) + countScroll * s.deltaX
                    }, 300);
                }
                if (s.onScroll != null) s.onScroll(s.currentIndex,s);
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
                if (s.onScroll != null) s.onScroll(s.currentIndex,s);
            }
        })
    }
    function checkPoint(s, m, prop) {
        let media = matchMedia(m);
        function mediaHandle(e) {
            if (e.matches) {
                s.destroy();
                if(prop!=undefined) s.setProps(prop);
                init(s);
                console.log('initing');
                setHandles(s);
            }
        }
        media.addListener(mediaHandle)
        mediaHandle(media);

    }


    window.Magic = m;

})();