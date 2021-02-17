/*
    Эта библеотека преднзначена для создания галлерии изображений
*/

(function () {
    let gw = {};

    let Gallery = function (params) {
        this.nodes = []; //список клонов всех перебирыемых элементов jquer

        if (params&&'exitButton' in params) {
            this.exit = params.exitButton;
        } else {
            this.exit = $('<button class="gw-exit-button">exit</button>');
        }
    }

    //создание галлереи
    gw.create = function (selector, params) {
        let g = new Gallery(params); //создание обьекта галлереи

        $(selector).children().each(function (index, el) {
            //создание копий элементов для галлереи
            let je = $(el).clone().addClass('g-item');
            g.nodes.push(je);
            //должно сработать при клике на изображение
            $(this).on('click', function () {


                let layout = $('<div class="g-layout"></div>');
                g.nodes[index].prepend(g.exit);
                layout.append(g.nodes[index]);
                $('body').append(layout).css('overflow', 'hidden');
                layout.animate({
                    opacity: 1
                },200);
                g.exit.on('click', function () {
                    layout.animate({
                        opacity: 0
                    },200,function(){
                        layout.remove();
                    })
                    $('body').css('overflow', 'auto');
                })
            })
        });

        //обработка входа выхода из галлереи
        function enter() {

            return layout;
        }

    }




    window.gw = gw;

})();