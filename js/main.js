
//получение всех типов животных для каталога
let catalog=$('.catalog__slider');
request('all',function(list){
    for(let e of list){
        catalog.append(newCatalogItem(e));
    }
});




//галлерея из 6ти изображений
gw.create('.gallery__grid',{
    exitButton: $('<div class="gallery-exit"><span class="fs"></span><span class="ss"></span></div>')
});



//работа фильтр кнопок
$('.catalog__filter').find('li').on('click',function(event){
    if(!$(this).hasClass('active-filter')){
        $('.catalog__filter').find('li').removeClass("active-filter");
        $(this).addClass('active-filter');

        //отправка запроса на сервер с сообщением фильтра
        //получения ответа с сервера и выполнить колбэк который должен обновить список слайдов
    }
})

//функция связанная с сервером(иммитация)
function request(filter,onload){
    let list=[]
    switch(filter){
        case 'all':{
            list[0]={
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue:'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[1]={
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue:'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[2]={
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue:'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            list[3]={
                date: 8,
                awards: 4,
                img: 'public/img/catalog-img1.png',
                name: 'Доберман',
                textValue:'Отличный новый друг для всей семьи, охраняет и обожает',
                filter: 'собаки',
                breedValue: 'породистая',
                price: 6899
            };
            break;
        }
        case 'dogs':{

            break;
        }
        case 'cats':{

            break;
        }
        case 'rats':{

            break;
        }
        case 'birds':{

            break;
        }
        case 'fish':{

            break;
        }
    }
    //после получения ответа выполнить добавления в каталог
    onload(list);
}

// создает новыый элемент каталога по обьекту запроса
function newCatalogItem(req){
    return $(
    '<div class="catalog__item">'+
        '<div class="catalog__date">'+
            '<span class="c-date-number">'+req.date+'</span><span>месяцев</span><span class="c-date-number">'+req.awards+'</span><span>награды</span>'+
        '</div>'+
        '<img src="'+req.img+'" alt="">'+
        '<h3>'+req.name+'</h3>'+
        '<p>'+req.textValue+'</p>'+
        '<div class="filters">'+
            '<span class="type-round"></span>'+
            '<span class="type">'+req.filter+'</span>'+
            '<span class="breed-round"></span>'+
            '<span class="breed">'+req.breedValue+'</span>'+
        '</div>'+
        '<div class="item__price">'+req.price+' р.</div>'+
    '</div>'
    );
}