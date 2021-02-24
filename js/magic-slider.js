(function () {

    let m = {};
    let sliders = new Map();

    let Slider = function (selector) {
        this.currentIndex = 0;//индекс текущего элменета
        this.deltaX = 0;//ширина самого длинного слайла с учетом горизонтального отступа
        this.slides = [];//массив слайдов
        this.viewport = null;
        this.tracker = null;
        this.mh = 0;
        this.mv = 0;
        this.sliderPadding = 0;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.slider = $(selector);
        this.breakpoints = [];//список медиа запросов
        this.maxSlidingNum = 0;//максимальное число перелистований
        // параметрические свойства
        this.prev = $('<button class="magic-button magic-prev-button">prev</button>');//кнпока назад
        this.next = $('<button class="magic-button magic-next-button">next</button>')//кнопка вперед
        this.infinite = false; //бесконечное прокручивание
        this.speed=300;
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
                case 'speed':{
                    this.speed=props[key];
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
                    this.breakpoints = props[key];
                    break;
                }
            }
        }
    }
    Slider.prototype.destroy = function () {
        //удаление слайдера но при этом сохраняется просто верстка
        this.slider.append(this.slider.find('.magic-slide'));
        this.slider.find('.magic-d').remove();
        this.slider.children().removeClass('magic-slide').attr('style', '');
        this.slider.removeClass('magic-slider-container').attr('style', '');
        this.slides = [];
        this.currentIndex = 0;
        return this;
    }


    // создание слайдера
    m.create = function (selector, props) {
        let s = sliders.get(selector);
        s = (s == undefined) ? new Slider(selector, props) : s.destroy();//обьект слайдера
        s.setProps(props);
        //инициализация слайдера
        init(s);
        //обработчки событий
        setHandles(s);

        // check media querys
        for (let q of s.breakpoints) {
            checkPoint(s, q.media, q.props);
        }
        sliders.set(selector, s); //save slider in the map
    }
    m.destroy = function (selector, media) {
        let slider = sliders.get(selector);
        if (slider) {
            if (media) {
                let m = matchMedia(media);
                if (m.matches) {
                    slider.destroy();
                }
                m.addListener(function (e) {
                    if (e.matches) {
                        slider.destroy();
                    }
                })
            }
        }
    }

    function init(s) {
        let maxwidth = 0, maxheight = 0; //велечины с максимальной шириной и высотой слайда
        let querySlides = s.slider.addClass('magic-slider-container').children().addClass('magic-slide').wrapAll('<div class="magic-d magic-viewport"></div>').wrapAll('<div class="magic-d magic-tracker"></div>').each(function (index, el) {
            //тут идет поиск самого большого слайда без учета маргинов
            let mw = parseFloat($(el).outerWidth());
            let mh = parseFloat($(el).outerHeight());
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
        s.viewport = s.slider.find('.magic-viewport');  //viewport
        s.tracker = s.slider.find('.magic-tracker');
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
        s.tracker.css({
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
        let tmp = s.slides.length - s.slideToShow;
        s.maxSlidingNum = ((tmp - tmp % s.slideToScroll) / s.slideToScroll) + ((tmp % s.slideToScroll === 0) ? 0 : 1);
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
        let x = 0;
        let lastX = 0;
        let isTouch = false;
        let points = [];
        let currentTime=0;

        let counter = 0;
        let tmp = s.slides.length - s.slideToShow;
        let posx = 0;
        points.push(posx);
        for (let i = 1; i <= s.maxSlidingNum; i++) {
            let k = 1;
            counter += s.slideToScroll;
            if (counter <= tmp) {
                k = s.slideToScroll;
            } else {
                k = counter - tmp;
            }
            posx -= k * s.deltaX;
            points.push(posx);
        }

        s.viewport.on('pointerdown', function (e) {
            x = lastX = e.clientX;
            isTouch = true;
        })
        s.viewport.on('pointermove', function (e) {
            if (isTouch) {
                let dx=e.clientX-lastX;
                s.tracker.css({
                    'left':parseFloat(s.tracker.css('left'))+dx+'px'
                })
                lastX=e.clientX;
                if(currentTime===0) currentTime=performance.now();
            }
        })
        s.viewport.on('pointerup', function (e) {
            isTouch = false;
            let dx = e.clientX - x;
            let time=performance.now()-currentTime;
            currentTime=0;
            if (dx >= 50) prev(time);
            else if(dx<=-50) next(time);
            else {
                s.tracker.animate({
                    left: points[s.currentIndex]
                })
            }
        })




        s.prev.on('click', function () {
            prev(s.speed);
        })
        s.next.on('click', function () {
            next(s.speed);
        })
        function prev(time) {
            if (s.currentIndex > 0) {
                s.currentIndex--;
                if (s.onScroll != null) s.onScroll(s.currentIndex, s);
            }
            move(time);
        }
        function next(time) {
            if (s.currentIndex + 1 < points.length) {
                s.currentIndex++;
                if (s.onScroll != null) s.onScroll(s.currentIndex, s);
            }
            move(time);
        }
        function move(time){
            s.tracker.animate({
                left: points[s.currentIndex]
            },time)
        }
    }
    function checkPoint(s, m, prop) {
        let media = matchMedia(m);
        function mediaHandle(e) {
            if (e.matches) {
                s.destroy();
                if (prop != undefined) s.setProps(prop);
                init(s);
                setHandles(s);
            }
        }
        media.addListener(mediaHandle)
        mediaHandle(media);

    }


    window.Magic = m;

})();