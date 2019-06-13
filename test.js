const request = require('request');
const movie_api_key = '799cc7f94c35b52bd4f26f4754e7d160';
const movie = 'Avatar';

const api_string =`https://api.themoviedb.org/3/search/movie?api_key=${movie_api_key}&language=en-US&query=${movie}&page=1`;

async function main() {
    await request(api_string);
}

request(api_string, (err, response, body) => {
    return new Promise((resolve, reject) => {
        if(body != undefined) {
            console.log(JSON.parse(body));
            resolve(body);
        }
        else reject(err);
    })
})