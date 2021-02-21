(() => {
    const media = window.matchMedia('(max-width: 520px)');

    let flag = false;
    let items = [];
    let menuList = $('.menu-list').css({
        'width': '250px'
    });
    let menuButton = $('.menu-button');
    init();
    menuButton.on('click', function (event) {
        let time = 0;
        if (flag) {
            for (let i = 0; i < items.length; i++) {
                setTimeout(() => {
                    items[i].animate({
                        left: '100%'
                    }, { queue: false })
                }, time)
                time += 50;
            }
        } else {
            for (let i = 0; i < items.length; i++) {
                setTimeout(() => {
                    items[i].animate({
                        left: '0px'
                    }, { queue: false })
                }, time)
                time += 50;
            }
        }
        flag = !flag;
    });

    if (media.matches) {
        $('.contact-item').detach().addClass('menu-item').css({ 'left': '100%', 'margin-right': '0px' }).appendTo(menuList);
        init();
    }
    media.addListener(function (e) {
        if (e.matches) {
            $('.contact-item').detach().addClass('menu-item').css({ 'left': '100%', 'margin-right': '0px' }).appendTo(menuList);
            init();
        }
    })



    function init() {
        menuList.find('.menu-item').each(function (index, el) {
            $(el).css({
                'left': '100%'
            })
            items.push($(el));
        })
    }
    
}) ();


