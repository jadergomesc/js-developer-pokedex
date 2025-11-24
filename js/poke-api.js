const pokeApi = {}; 




function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id
   
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
   
    pokemon.types = types
    pokemon.type = type
   
   
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default 

    return pokemon
}

pokeApi.getPokemonDetail =  (pokemon) => {
    return  fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon) 
}



pokeApi.getPokemons = (offset = 0, limit = 10) => {
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`


return  fetch(url)// buscando nossa lista
    .then((response) => response.json())// isso nos dá um http response / estamos convertendo para json
    .then((jsonBody) => jsonBody.results)// pegamos a lista de pokemons
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // mapeando a lista de pokemons mapeamos em uma lisra de requisições sde detalhes dos pokemons
    //que é um novo fetch() para url do pokemon que estou querendo acessar   e convertendo a response que ele me da para uum json
    .then((detailRequests) => Promise.all(detailRequests))  //estamos com essa lista de pokemons esperando qiue todas as requisições terminem     
    .then((pokemonsDetails) =>  pokemonsDetails )//imprime uma lista de detalhes dos pokmeons
     
    
    
}

Promise.all([ 
        fetch('https://pokeapi.co/api/v2/pokemon/1'),
        fetch('https://pokeapi.co/api/v2/pokemon/2'),
        fetch('https://pokeapi.co/api/v2/pokemon/3'),
        fetch('https://pokeapi.co/api/v2/pokemon/4'),
]).then((results) => {

    console.log(results)
})