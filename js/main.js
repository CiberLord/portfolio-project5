
//получение всех типов животных для каталога
let catalog = $('.catalog__slider');
catalog.empty();
request('all',onloadCatalog);

//работа фильтр кнопок
$('.catalog__filter').find('li').on('click', function (event) {
    if (!$(this).hasClass('active-filter')) {
        $('.catalog__filter').find('li').removeClass("active-filter");
        $(this).addClass('active-filter');
        catalog.empty();
        request($(this).attr('filter'),onloadCatalog);
        //отправка запроса на сервер с сообщением фильтра
        //получения ответа с сервера и выполнить колбэк который должен обновить список слайдов
    }
})

Magic.destroy('.catalog__slider','(max-width: 370px)');

//функция связанная с сервером(иммитация)
function request(filter, onload) {
    let list = []
    switch (filter) {
        case 'all': {
            list[0] = {
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue: 'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[1] = {
                date: 4,
                awards: 2,
                img: 'public/img/catalog-img2.png',
                name: 'Британская кошка',
                textValue: 'Прекрасная подружка на всю жизнь, ласковая и чистоплотная',
                filter: 'кошки',
                breedValue: 'породистая',
                price: 3200
            };
            list[2] = {
                date: 9,
                awards: 2,
                img: 'public/img/catalog-img3.png',
                name: 'Попугай Ара',
                textValue: 'Яркий друг поднимает вам настроение, общительный и дружелюбный',
                filter: 'птицы',
                breedValue: 'редкий',
                price: 7000
            };
            list[3] = {
                date: 1,
                awards: 10,
                img: 'public/img/rat.png',
                name: 'Толстый Хомячок',
                textValue: 'Маленький друг поднимает вам настроение, дружелюбный и милый',
                filter: 'хомячки',
                breedValue: 'породистый',
                price: 1200
            };
            break;
        }
        case 'dogs': {
            list[0] = {
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue: 'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[1] = {
                date: 3,
                awards: 1,
                img: 'public/img/catalog-img1.png',
                name: 'Лабрадор',
                textValue: 'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[2] = {
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue: 'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[3] = {
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue: 'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            }
            break;
        }
        case 'cats': {
            list[0] = {
                date: 4,
                awards: 2,
                img: 'public/img/catalog-img2.png',
                name: 'Британская кошка',
                textValue: 'Прекрасная подружка на всю жизнь, ласковая и чистоплотная',
                filter: 'кошки',
                breedValue: 'породистая',
                price: 3200
            };
            list[1] = {
                date: 4,
                awards: 2,
                img: 'public/img/catalog-img2.png',
                name: 'Британская кошка',
                textValue: 'Прекрасная подружка на всю жизнь, ласковая и чистоплотная',
                filter: 'кошки',
                breedValue: 'породистая',
                price: 3200
            };
            list[2] = {
                date: 4,
                awards: 2,
                img: 'public/img/catalog-img2.png',
                name: 'Британская кошка',
                textValue: 'Прекрасная подружка на всю жизнь, ласковая и чистоплотная',
                filter: 'кошки',
                breedValue: 'породистая',
                price: 3200
            };
            list[3] = {
                date: 4,
                awards: 2,
                img: 'public/img/catalog-img2.png',
                name: 'Британская кошка',
                textValue: 'Прекрасная подружка на всю жизнь, ласковая и чистоплотная',
                filter: 'кошки',
                breedValue: 'породистая',
                price: 3200
            };
            break;
        }
        case 'rats': {
            list[0] = {
                date: 1,
                awards: 10,
                img: 'public/img/rat.png',
                name: 'Толстый Хомячок',
                textValue: 'Маленький друг поднимает вам настроение, дружелюбный и милый',
                filter: 'хомячки',
                breedValue: 'породистый',
                price: 1200
            };
            list[1] = {
                date: 1,
                awards: 10,
                img: 'public/img/rat.png',
                name: 'Толстый Хомячок',
                textValue: 'Маленький друг поднимает вам настроение, дружелюбный и милый',
                filter: 'хомячки',
                breedValue: 'породистый',
                price: 1200
            };
            list[2] = {
                date: 1,
                awards: 10,
                img: 'public/img/rat.png',
                name: 'Толстый Хомячок',
                textValue: 'Маленький друг поднимает вам настроение, дружелюбный и милый',
                filter: 'хомячки',
                breedValue: 'породистый',
                price: 1200
            };
            list[3] = {
                date: 1,
                awards: 10,
                img: 'public/img/rat.png',
                name: 'Толстый Хомячок',
                textValue: 'Маленький друг поднимает вам настроение, дружелюбный и милый',
                filter: 'хомячки',
                breedValue: 'породистый',
                price: 1200
            };
            break;
        }
        case 'birds': {
            list[0] = {
                date: 9,
                awards: 2,
                img: 'public/img/catalog-img3.png',
                name: 'Попугай Ара',
                textValue: 'Яркий друг поднимает вам настроение, общительный и дружелюбный',
                filter: 'птицы',
                breedValue: 'редкий',
                price: 7000
            };
            list[1] = {
                date: 9,
                awards: 2,
                img: 'public/img/catalog-img3.png',
                name: 'Попугай Ара',
                textValue: 'Яркий друг поднимает вам настроение, общительный и дружелюбный',
                filter: 'птицы',
                breedValue: 'редкий',
                price: 7000
            };
            list[2] = {
                date: 9,
                awards: 2,
                img: 'public/img/catalog-img3.png',
                name: 'Попугай Ара',
                textValue: 'Яркий друг поднимает вам настроение, общительный и дружелюбный',
                filter: 'птицы',
                breedValue: 'редкий',
                price: 7000
            };
            list[3] = {
                date: 9,
                awards: 2,
                img: 'public/img/catalog-img3.png',
                name: 'Попугай Ара',
                textValue: 'Яркий друг поднимает вам настроение, общительный и дружелюбный',
                filter: 'птицы',
                breedValue: 'редкий',
                price: 7000
            };
            break;
        }
        case 'fish': {
            list = null;
            break;
        }
    }//это все должно работать с сервером
    //после получения ответа выполнить добавления в каталог
    onload(list);
}

function onloadCatalog(list) {
    if (list != null) {
        for (let e of list)
            catalog.append(newCatalogItem(e));
        Magic.create('.catalog__slider',{
            slideToShow: 3,
            slideToScroll: 1,
            nextButton: $('<button class="slide-btn next"></button>'),
            prevButton: $('<button class="slide-btn prev"></button>'),
            breakpoints:[
                {
                    media: '(max-width: 1299px)'
                },
                {
                    media: '(max-width: 1099px)'
                },
                {
                    media: '(max-width: 993px)',
                    props:{
                        slideToShow: 2
                    }
                },
                {
                    media: '(max-width: 659px)',
                    props:{
                        slideToShow: 1
                    }
                },
                {
                    media: '(max-width: 519px)'
                }
            ]
        })
    }
    else {
        catalog.append($('<div>пусто:(</div>'));
    }
}

// создает новыый элемент каталога по обьекту запроса
function newCatalogItem(req) {
    return $(
        '<div class="catalog__item">' +
        '<div class="catalog__date">' +
        '<span class="c-date-number">' + req.date + '</span><span>месяцев</span><span class="c-date-number">' + req.awards + '</span><span>награды</span>' +
        '</div>' +
        '<img src="' + req.img + '" alt="">' +
        '<h3>' + req.name + '</h3>' +
        '<p>' + req.textValue + '</p>' +
        '<div class="filters">' +
        '<span class="type-round"></span>' +
        '<span class="type">' + req.filter + '</span>' +
        '<span class="breed-round"></span>' +
        '<span class="breed">' + req.breedValue + '</span>' +
        '</div>' +
        '<div class="item__price">' + req.price + ' р.</div>' +
        '</div>'
    );
}