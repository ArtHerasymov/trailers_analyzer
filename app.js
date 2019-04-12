const fs = require('fs');
const request = require('request');
const movieTrailer = require("movie-trailer");
var csv = require("csvtojson");

const test_url = 'https://www.youtube.com/watch?v=DyDfgMOUjCI';
const api_key = 'AIzaSyCrbYkplw3ehGnvXqOX5935bJi6frl6lz0';
const limit = 50;

//const api_string = `https://www.googleapis.com/youtube/v3/commentThreads?key=${api_key}&textFormat=plainText&part=snippet&videoId=${trailer_id}&maxResults=${pagination}`;
const movie_metadata = './movie_metadata.csv';

let titlePromise = new Promise((resolve, reject) => {
  csv()
    .fromFile(movie_metadata)
    .then((jsonArrayObj) => {
      let movies = [];
      for(let movie of jsonArrayObj){
        movies.push(movie.movie_title);
      }
      resolve(movies);
    })
})


let getComments = (movieId) => {
  return new Promise((resolve, reject) => {
    const api_string = `https://www.googleapis.com/youtube/v3/commentThreads?key=${api_key}&textFormat=plainText&part=snippet&videoId=${movieId}&maxResults=${limit}`;
    request(api_string, (err, response, body) => {
      if(body != undefined) resolve(body);
      else reject(err);
    })
  })
}


async function main(){
  titlePromise.then(async (movies) => {
    let moviesKeyValue = [];
    let counter = 0;
    for(let i = 0; i < 20; i++){
      let id = await movieTrailer(movies[i]);
      if(id != undefined){
        moviesKeyValue.push({title: movies[i], id: id.split('watch?v=')[1] });
      }
    }

    let finalDatasetObject = [];

    // Make request to get comments below each trailer
    for(let movieKeyValue of moviesKeyValue){
      let movieObject = {title: movieKeyValue.title, comments: []};
      let body = await getComments(movieKeyValue.id);
      let items = JSON.parse(body).items;
      if(items != undefined){
        for(let commentObject of items){
          console.log(commentObject.snippet.topLevelComment.snippet.textDisplay);
          movieObject.comments.push(commentObject.snippet.topLevelComment.snippet.textDisplay);
        }
        console.log(movieObject);
        finalDatasetObject.push(movieObject);
      }
    }
    fs.writeFile('final_dataset.json', JSON.stringify(finalDatasetObject), (err)=> console.log(err));
  });
}

main();