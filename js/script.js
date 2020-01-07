'use strict';
// YouTube credentials
const apiKey = 'AIzaSyD8MyJnRbBjj9YZl7j8IkTltxvlyDnZI_0';
const searchURL = 'https://www.googleapis.com/youtube/v3/search';
const searchVimeoURL = 'https://api.vimeo.com/videos'
//const messageBanner = document.getElementById('desc')

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// Retreiving videos from Youtube
function getYouTubeVideos(query, part) {
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        type: 'video'
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            console.log(response.statusText)
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, true))
        .catch(err => {
            console.log(err)
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

// Retreiving videos from Vimeo
function getVimeoVideo(query) {
    const params = {
        query: query,
    }
    const queryString = formatQueryParams(params)
    const url = searchVimeoURL + '?' + queryString;
    fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "bearer aa5f4b532499f0fa5ad30877020bba2f"
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            console.log(response.statusText)
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson)
            displayResults(responseJson, false)})
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

// Displaying videos 
function displayResults(responseJson, isYouTubeApi) {
    $('results').empty();
    let comparison = isYouTubeApi ? responseJson.items : responseJson.data
    for (let i = 0; i < comparison.length; i++) {
        if (isYouTubeApi) {
            $('#results').append(`
            <div>
            <h2>${responseJson.items[i].snippet.title.length >= 60 ? responseJson.items[i].snippet.title.slice(0, 59) + "..." : responseJson.items[i].snippet.title}</h2>

            <br>
                <iframe class="iframe-y" width="420"
                height="315"
                src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}"
                style="border:0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
                </iframe>
            <br>
                <a href="https://youtu.be/${responseJson.items[i].id.videoId}" target="_blank">link to video</a>  
                <p>${responseJson.items[i].snippet.description.length > 150 ? responseJson.items[i].snippet.description.slice(0, 150) + "..." : responseJson.items[i].snippet.description}</p>
            </div>`);
        } else {
            console.log(responseJson.data[i].uri.split("/").pop())
            $('#results').append(`
            <div>
            <h2>${responseJson.data[i].name.length > 60 ? responseJson.data[i].name.slice(0, 59) + "..." : responseJson.data[i].name}</h2>

            <br>
                <iframe class="iframe-v" width="420"
                height="315"
                src="https://player.vimeo.com/video/${responseJson.data[i].uri.split("/").pop()}"
                style="border:0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
                </iframe>
            <br>
                <a href="${responseJson.data[i].link}" target="_blank">link to video</a>  
                <p>${responseJson.data[i].description.length >= 150 ? responseJson.data[i].description.slice(0, 150) + "..." : responseJson.data[i].description}</p>
            </div>`);
        }

    };
    $('#results').removeClass('hidden');
    //messageBanner.classList.add('hidden')
};

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#searchTerm').val();
        getYouTubeVideos(searchTerm);
        getVimeoVideo(searchTerm);
    });
}

$(watchForm);


