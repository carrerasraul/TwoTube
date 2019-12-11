'use strict';
// YouTube credentials
const apiKey = 'AIzaSyAOdIOEeJRVSv7QvsFVkYJ8v07ECw91-kE';
const searchURL = 'https://www.googleapis.com/youtube/v3/search';
const searchVimeoURL = 'https://api.vimeo.com/videos'

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getYouTubeVideos(query, part) {
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        type: 'video'
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, true))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function getVimeoVideo(query) {
    const params = {
        query: query,
    }
    const queryString = formatQueryParams(params)
    const url = searchVimeoURL + '?' + queryString;
    console.log(url)
    fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "bearer aa5f4b532499f0fa5ad30877020bba2f"
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, false))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResults(responseJson, isYouTubeApi) {
    console.log(responseJson);

    $('results').empty();

    let comparison = isYouTubeApi ? responseJson.items : responseJson.data
        //$('#results').empty();
    for (let i = 0; i < comparison.length; i++) {
        if (isYouTubeApi) {
            $('#results').append(
                `<iframe class="iframe-y" width = "560"
            height="315"
            src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
            </iframe>
            
            <p>${responseJson.items[i].snippet.description}</p>`);
        } else {

            $('#results').append(
                `<div class="iframe-v">${responseJson.data[i].embed.html}"  
            <p>${responseJson.data[i].description}</p>
            </div>`);
        }


    };
    $('#results').removeClass('hidden');
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