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
        this.slider = $(selector).on("selectstart", function () {
            return false;
        });
        this.breakpoints = [];//список медиа запросов
        this.maxSlidingNum = 0;//максимальное число перелистований
        // параметрические свойства
        this.prev = $('<button class="magic-button magic-prev-button">prev</button>');//кнпока назад
        this.next = $('<button class="magic-button magic-next-button">next</button>')//кнопка вперед
        this.infinite = false; //бесконечное прокручивание
        this.speed = 300;
        this.slideToShow = 1;//количество которые нужно показать в окне
        this.slideToScroll = 1;//на сколько слайдов скролить
        this.buttons = true; //показывать или не показывать кнопки
        this.dots = true; //показывать или не покзывать точки
        this.scroll_bar = false;
        this.dotbox = null; //контэйнер в котором хранятся скролл штуки
        this.dotList = []; //список точек
        this.dotsClass = "magic-dot"; //стиль точки
        this.activedotsClass = "magic-dot-activ"; //стиль активной точки
        this.scrollTrackclass = "";//стильдля скролл трэк
        this.scrollItemClass = "";//стиль для скроллбара
        this.isTouch = true;//разрешить слайдинг движением пальцев
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
                    this.scroll_bar = false;
                    break;
                }
                case 'scroll_bar': {
                    this.scroll_bar = props[key];
                    this.dots = false;
                }
                case 'speed': {
                    this.speed = props[key];
                }
                case 'breakpoints': {
                    this.breakpoints = props[key];
                    break;
                }
                case "trackItemclass": {
                    this.scrollItemClass = props[key];
                    break;
                }
                case "scrollTrackclass": {
                    this.scrollTrackclass = props[key];
                    break;
                }
                case "isTouch": {
                    this.isTouch = props[key];
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

    // инициализация слайдов, слайдера, растановка размеров и отсупов
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


    }

    // установка всех обработчиков
    function setHandles(s) {
        this.currentIndex = 0;
        let x = 0;
        let lastX = 0;
        let isTouch = false;
        let points = [];
        let currentTime = 0;

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

        // установка доттеров
        if (s.dots) {
            let dotList = [];
            let dotbox = $('<div class="magic-d magic-dots-list"></div>').on("selectstart", function () {
                return false;
            });
            s.slider.append(dotbox.css({
                'width': '80%',
                'left': '10%'
            }));

            for (let i = 0; i < s.maxSlidingNum + 1; i++) {
                let d = $('<div class="' + s.dotsClass + '"></div>').on("selectstart", function () {
                    return false;
                });
                dotList.push(d);
                dotbox.append(d);
            }
            let dotMargin = 10;
            let dotWidht = parseFloat(dotList[0].css('width')) + dotMargin;
            x = dotMargin;
            let listWidth = dotWidht * s.maxSlidingNum + dotWidht + dotMargin;
            // разметка списка для точек
            if (listWidth < parseFloat(dotbox.css('width'))) {
                dotbox.css({
                    'width': listWidth + 'px',
                    'left': (parseFloat(s.slider.css('width')) - listWidth) / 2 + 'px'
                })
                for (let i = 0; i < dotList.length; i++) {
                    dotList[i].css({
                        'left': x + 'px'
                    }).click(function (event) {
                        slideTo(i, 200);
                        dotList.forEach(item => {
                            item.removeClass(s.activedotsClass);
                        });
                        $(this).addClass(s.activedotsClass);
                    })
                    x += dotWidht;
                }
                s.onScroll = function () {
                    dotList.forEach(item => {
                        item.removeClass('magic-dot-active');
                    });
                    dotList[s.currentIndex].addClass('magic-dot-active');
                }
            } else {
                dotbox.remove();
                s.dots = false;
                s.scroll_bar = true;

            }

        }
        // установка скролл бара
        if (s.scroll_bar) {
            let sPoints = [0];
            let scroller = $('<div class="magic-d magic-scroll-track ' + s.scrollTrackclass + '"></div>');
            let item = $('<div class="magic-scroll-item ' + s.scrollItemClass + '"></div>').on("selectstart", function () {
                return false;
            });
            s.slider.append(scroller);
            scroller.append(item);


            //создать массив точек нахождения скроллбара
            let trackWidth = parseFloat(scroller.css('width'));
            let deltax = (trackWidth-parseFloat(item.css('width')) )/ s.maxSlidingNum;
            let x = 0;
            scroller.css(
                "left",(parseFloat(s.slider.css("width"))-trackWidth)/2+"px"
            )
            for (let i = 1; i <= s.maxSlidingNum; i++) {
                x += deltax;
                sPoints.push(x + 'px');
            }
            s.onScroll = function () {
                console.log('scroll');
                item.animate({
                    left: sPoints[s.currentIndex]
                }, 200)
            }
        }

        if (s.isTouch) {
            s.viewport.on('pointerdown', function (e) {
                e.preventDefault();
                x = lastX = e.clientX;
                isTouch = true;
            })
            s.viewport.on('pointermove', function (e) {
                e.preventDefault();
                if (isTouch) {
                    let dx = e.clientX - lastX;
                    s.tracker.css({
                        'left': parseFloat(s.tracker.css('left')) + dx + 'px'
                    })
                    lastX = e.clientX;
                    if (currentTime === 0) currentTime = performance.now();
                }
            })
            s.viewport.on('pointerup', function (e) {
                isTouch = false;
                let dx = e.clientX - x;
                let time = performance.now() - currentTime;
                currentTime = 0;
                time = (time > 300) ? 300 : time;
                if (dx >= 50) prev(time);
                else if (dx <= -50) next(time);
                else {
                    s.tracker.animate({
                        left: points[s.currentIndex]
                    })
                }
            })
        }
        s.prev.on('click', function () {
            prev(s.speed);
        }).on("selectstart", function () {
            return false;
        })
        s.next.on('click', function () {
            next(s.speed);
        }).on("selectstart", function () {
            return false;
        })
        function prev(time) {
            if (s.currentIndex > 0) {
                s.currentIndex--;
            }
            move(time);
        }
        function next(time) {
            if (s.currentIndex + 1 < points.length) {
                s.currentIndex++;
            }
            move(time);
        }
        // движение слайдов
        function move(time) {
            if (s.onScroll != null) s.onScroll();
            s.tracker.animate({
                left: points[s.currentIndex]
            }, time)
        }
        // перелистать до нужного слайда
        function slideTo(index, time) {
            if (index === points.length) index--;
            s.currentIndex = index;
            move(time);
        }
    }

    // работа с медиа запросами
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