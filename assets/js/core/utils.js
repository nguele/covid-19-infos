/* Les fonctions */

function cons(stuff) {
    console.log(stuff)
}

function listenPubs(path, callback) {
    db.collection(path).orderBy('pubDate', 'desc')
        .onSnapshot(function (collection) {
            callback(collection);
        })
}

function listen(path, callback) {
    db.collection(path)
        .onSnapshot(function (collection) {
            callback(collection);
        })
}

function once(path, callback) {
    db.collection(path).get().then((querySnapshot) => {
        callback(querySnapshot)
    });
}

function write(path, value, success, error) {
    db.collection(path).add(value)
        .then(function (docRef) {
            success(docRef);
        })
        .catch(function (e) {
            error(e);
        });
}

function showBody(selector) {
    $(`#${selector} .body`).css("display", "block");
}

function cacher(selector) {
    $(selector).addClass("hide");
}

function afficher(selector) {
    $(selector).removeClass("hide");
}

function loader(rubrique, show = true) {
    let l = `#${rubrique} .loading `;
    if (show) {
        afficher(l + 'img');
        afficher(l + 'p');
    } else {
        cacher(l + 'img');
        cacher(l + 'p');
    }
}

/**
 * Ajoute une publication dans une section
 * @param {string} data
 * @param {string} section
 * @return void
 */
function addPub(data, section = 'home') {
    let d = moment(data.pubDate).format("dddd, Do MMMM YYYY [à] HH:mm");
    let item = `<div class="publication">
            <h1 class="title" data-url="${data.sourceLien}">${data.titre}</h1>
            <div class="image" data-url="${data.sourceLien}">
                <img src="${data.image}" alt="Image de ${data.titre}">
            </div>
            <div class="content">
                <div class="pub-date">
                    <i class="fa fa-clock-o"></i>
                    <time datetime="2020-03-16"> publié le ${d}</time>
                </div>
                <p data-url="${data.sourceLien}">${data.description || "Contenu"}</p>
                <div class="pub-footer">
                    <button class="button"><i class="fa fa-share-alt"></i><span>Partager</span></button>
                    <button class="button btn-modal"><i class="fa fa-eye" aria-hidden="true"></i></button>
                    <p>Source : <a href="${data.sourceLien}">${data.sourceNom}</a></p>
                </div>
                <div class="pub-sharing hide">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${data.sourceLien}"><i class="fa fa-2x fa-facebook"></i></a>
                    <a href="https://wa.me/?text=${data.sourceLien}"><i class="fa fa-2x fa-whatsapp"></i></a>
                    <a onclick="copyToClipboard('${data.sourceLien}')"><i class="fa fa-2x fa-copy"></i></a>
                </div>
            </div>
        </div>`;
    $(`#${section} .body`).append(item);
}

function addClickEvent(el) {
    $(el).click(function () {
        el.toggleClass('button button-cancel');
        let pubSharing = el.parent().parent().find('.pub-sharing');
        if (pubSharing.hasClass('hide')) {
            el.find('i').prop('class', 'fa fa-remove');
            el.find('span').text('Annuler');
        }
        else {
            el.find('i').prop('class', 'fa fa-share-alt');
            el.find('span').text('Partager');
        }
        pubSharing.toggleClass('hide', '');
    });
}


/**
 * Cette fonction active une fenetre modal de l'element
 * @param {JQuery.fn.Init} el 
 */
function activeModal(el) {
    el.click(() =>{
        $('body').css('overflowY','hidden')
        $('header > a:first-of-type').addClass('hide')
        $('#btn-close-modal').removeClass('hide')
        el.parent().parent().parent().toggleClass('modal')
        el.parent().find('button:first-child').addClass('hide')
        el.addClass('hide')
        el.parent().parent().find(".pub-sharing").removeClass('hide')
        // console.log('Clicked')
    })
}

/**
 * Cette fonction ferme la fenetre modal actuelle
 * @param {Event} event 
 */
function closeModal(event) {
    let el = $(event.currentTarget)
    let modalElt = $('.modal')
    modalElt.removeClass('modal')
    $('body').css('overflowY','auto')
    $('header > a:first-of-type').removeClass('hide')
    $('.pub-footer button').removeClass('hide')
    $('.pub-sharing').addClass('hide')
    el.addClass('hide')
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};