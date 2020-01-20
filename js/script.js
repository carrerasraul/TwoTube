'use strict';
// YouTube credentials
const apiKey = 'AIzaSyD8MyJnRbBjj9YZl7j8IkTltxvlyDnZI_0';
const searchURL = 'https://www.googleapis.com/youtube/v3/search';
const searchVimeoURL = 'https://api.vimeo.com/videos'
const messageBanner = document.getElementById('desc')
let youtubeList;        // for making list of youTube videos
let vimeoList;          // for making list for vimeo videos
let videoListInterface; // for making a list of combined iframes from all video data
let searchTerm;         // for taking in user input
const $resultsElement = $('#results');       // caching results element
const $searchTermElement = $('#searchTerm'); // caching input element
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}
// Retreiving videos from Youtube
function getYouTubeVideos() {
    const params = {
        key: apiKey,
        q: searchTerm,
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
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            if (responseJson.items.length) {
                   youtubeList = responseJson.items
                  getVimeoVideos()  
            }
           else {
              $('#js-error-message').text(`NO RESULTS`);
           }
        });

}
// Retreiving videos from Vimeo
function getVimeoVideos() {
    const params = {
        query: searchTerm,
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
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            vimeoList = responseJson.data
            render()
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}
// generate UI for videos this function will be called for each video in each list
function generateUI(isYouTube, isVimeo, video) {
        if (isYouTube) {
            return`
            <div>
            <h2>${video.snippet.title.length >= 60 ? video.snippet.title.slice(0, 59) + "..." : video.snippet.title}</h2>
            <br>
                <iframe class="iframe-y" width="420"
                height="315"
                src="https://www.youtube.com/embed/${video.id.videoId}"
                style="border:0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
                </iframe>
            <br>
                <a href="https://youtu.be/${video.id.videoId}" target="_blank">link to video</a>  
                <p>${video.snippet.description.length > 150 ? video.snippet.description.slice(0, 150) + "..." : video.snippet.description}</p>
            </div>
            `;
        } else if (isVimeo) {
            return`
            <div>
            <h2>${video.name.length > 60 ? video.name.slice(0, 59) + "..." : video.name}</h2>
            <br>
                <iframe class="iframe-v" width="420"
                height="315"
                src="https://player.vimeo.com/video/${video.uri.split("/").pop()}?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=161446"
                style="border:0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
                </iframe>
            <br>
                <a href="${video.link}" target="_blank">link to video</a>  
                <p>${video.description && video.description.length >= 150 ? video.description.slice(0, 150) + "..." : video.description}</p>
            </div>
            `;
        }
};
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        searchTerm = $searchTermElement.val();
        getYouTubeVideos();             // We first call youTubeAPI
        $searchTermElement.val("");     // Reset search term element back to empty
        $resultsElement.html("<h3>Loading...</h3>").css("text-align", "center"); // display loading message to user
    });
}
function render() {
    videoListInterface = [] // initialize video list interface to empty array
    youtubeList.forEach(video => {
        videoListInterface.push(generateUI(true, null, video)); // create UI for youTube videos
    });
    vimeoList.forEach(video => {
        videoListInterface.push(generateUI(null, true, video)); // create UI for vimeo videos
    });
    $resultsElement.html(videoListInterface.join("")) // add combined IU to DOM
}
$(watchForm)
