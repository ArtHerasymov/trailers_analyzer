const fs = require('fs');
const request = require('request');
const movieTrailer = require("movie-trailer");
const csv = require("csvtojson");

const api_key = 'AIzaSyCrbYkplw3ehGnvXqOX5935bJi6frl6lz0'; // youtube API key
const movie_api_key = '799cc7f94c35b52bd4f26f4754e7d160';
const limit = 10;                                          // max number of comments to parse
const movie_metadata = './movie_metadata.csv';             // File to read movie titles from
const datasetSize = 50;

// Reads movie title from file
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
});

// Get comments for a particular movie by youtube id
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
  // Getting titles from file
  titlePromise.then(async (movies) => {
    let moviesKeyValue = [];

    for(let i = 0; i < datasetSize; i++) {
      let id;
      try{
        id = await movieTrailer(movies[i]);
      } catch(e){
        console.log('Could not find trailer for ' + movies[i]);
      }
      if(id != undefined){
        // Seperating video id
        moviesKeyValue.push({title: movies[i], id: id.split('watch?v=')[1] });
      }
    }


    let finalDatasetObject = []; // Array holds objects like { title: String, comments: Array }

    let countermov = 0;
    // Make request to get comments below each trailer
    for(let movieKeyValue of moviesKeyValue){
      let movieObject = {title: movieKeyValue.title, comments: []};
      let body = await getComments(movieKeyValue.id);

      let items = JSON.parse(body).items;
      if(items != undefined){
        for(let commentObject of items){
           movieObject.comments.push(commentObject.snippet.topLevelComment.snippet.textDisplay);
        }
        finalDatasetObject.push(movieObject);
      }
      countermov++;
      console.log('Got comments for movie ' + countermov);
    }

    //Gettinng revenue for each movie from finalDatasetObject
    let ds = [];
    for(let movie of finalDatasetObject) {
      const revenue = await getMovieRevenue(movie.title);
      ds.push({
        movie,
        revenue
      });
    }
    console.log('3');
    fs.writeFile('final_dataset.json', JSON.stringify(ds), (err)=> console.log(err));
  });
};


const getMovieId = async (movie) => {
  return new Promise( (resolve, reject) => {
    const api_string =`https://api.themoviedb.org/3/search/movie?api_key=${movie_api_key}&language=en-US&query=${movie}&page=1`;
    request(api_string, (err, response, body) => {
      if(body !== undefined) {
        const results = JSON.parse(body).results;
        if(results) {
          resolve(results[0].id);
        }
      } else {
        reject(err);
      }
    });
  })
}

const getMovieRevenue = async(movie) => {
  return new Promise(async (resolve, reject)=> {
    const id = await getMovieId(movie);
    const api_string = `https://api.themoviedb.org/3/movie/${id}?api_key=799cc7f94c35b52bd4f26f4754e7d160&language=en-US`;
    await request(api_string, (err, response, body) => {
      if(body !== undefined) {
        resolve(JSON.parse(body).revenue);
      } else {
        reject('null');
      }
    })
  })
}


main()