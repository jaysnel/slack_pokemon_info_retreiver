const axios = require('axios');
const SlackBot = require('slackbots');

const bot = new SlackBot({
    token: 'Sorry, Have To Get Your Own Token!',
    name: 'Pokemon Info Retriever'
})


let x = '';
let pokemonArray = [];
let helpWanted = 'Type in "@pokemon_retriever POKEMON_NAME" in order to display Pokemon Information!'



// Start The Pokemon Bot
bot.on('start', () => {
    const params = {
        icon_emoji: ':copyright:'
    }
    bot.postMessageToChannel('general', "Gotta catch 'em all!" + '\n' + 'For help type "@pokemon_retriever help"', params);
    getListOfAllPokemon();

})

// Error Handler
bot.on('error', (err) => console.log(err));


// Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message') {
        return;
    }
    handleMessage(data.text);
});

// Handeling Each Message that is passed, checking for pokemon name or 'help'
function handleMessage(message) {
    if(message !== undefined) {
    let exactMatch = message.split(' ')[1].toLowerCase();

        if(exactMatch === 'help') {
            const params = {
                icon_emoji: ':question:'
            }
            bot.postMessageToChannel('general', helpWanted, params);
        } else {
            exactMatch.toLowerCase();
            for(let i = 0; i <= pokemonArray.length - 1; i++) {
                if(exactMatch === pokemonArray[i]) {
                    x = pokemonArray[i].toLowerCase();
                    getPokemonData();
                }
            }
        }
    
} else {
    return;
}
}

// Getting All Pokemon Info Needed
function getPokemonData() {
    axios.get('https://pokeapi.co/api/v2/pokemon/' + x)
    .then((res) => {
    
    // All Pokemon Info
    const thePokemon = res.data.sprites.front_default;
    const thePokemonIndex = res.data.game_indices[0].game_index;
    const pokemonMoves = res.data.moves;
    const pokemonWeight = res.data.weight; // Original Weight Is In hectograms(hg)
    const pokemonWeightInPounds = pokemonWeight * (1/4.5359237);
    const pokemonTypeInfo = res.data.types;
    const pokemonType = [];
    for(let i = 0; i <= pokemonTypeInfo.length - 1; i++) {
        pokemonType.push(pokemonTypeInfo[i].type.name);
    }

    const pokemonInfo = x.toUpperCase() + ': ' + thePokemon + 
    '\n' +  
    'Index: #' + thePokemonIndex +
    '\n' + 
    'Moves Possible To Learn: ' + randomListOfMoves() +
    '\n' + 
    'Type: ' + pokemonType +
    '\n' + 
    'Weight: ' + Math.round(pokemonWeightInPounds) + ' lbs';

    const params = {
       icon_emoji: ':sunglasses:'
   }



   // Gathering 3 Random Moves From Full List Of Moves Capable Of Learning
   function randomListOfMoves() {
    let x = [];
    let y = [];
    for(let i = 0; i <= pokemonMoves.length - 1; i++) {
        x.push(pokemonMoves[i].move.name.toUpperCase());
    }
    for(let j = 0; j <= 2; j++) {
        y.push(x[Math.floor((Math.random() * x.length) + 1)]);
    }
    return y;
}
   bot.postMessageToChannel('general', pokemonInfo, params);
})
.catch((err) => {
    console.log(err);
})
}

// Get List Of All Pokemon Names
function getListOfAllPokemon() {
    axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=946')
    .then((res) => {

    const thePokemon = res.data.results;

    for(let i = 0; i <= thePokemon.length - 1; i++) {
        pokemonArray.push(thePokemon[i].name);
    }
})
.catch((err) => {
    console.log(err);
})
}
