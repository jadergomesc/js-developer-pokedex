// Utilitário para selecionar elementos
const $ = (id) => document.getElementById(id);

// Elementos principais
const img = $("pokemon-img-detalhes");
const tipoPokemon = $("sectionPrim");

// Pegar query da URL (?name=Bulbasaur)
const params = new URLSearchParams(window.location.search);
const pokemonName = params.get("name");


if (!pokemonName) {
  alert("Nenhum Pokémon selecionado!");
} else {
  getPokemon(pokemonName);
}

async function getPokemon(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) throw new Error("Pokémon não encontrado");

    const data = await response.json();
    console.log("Dados:", data);

    // Nome e informações básicas
    $("nomePokemon").innerHTML = capitalize(data.name);
    $("especie").innerHTML = `<strong>Espécie:</strong> ${capitalize(data.species.name)}`;
    $("altura").innerHTML = `<strong>Altura:</strong> ${(data.height / 10).toFixed(1)} m`;
    $("peso").innerHTML = `<strong>Peso:</strong> ${(data.weight / 10).toFixed(1)} Kg`;

    // Stats
    // valores de HP, Attack e Defense
    let hp = 100; // valor inicial    
    let atk = data.stats[1].base_stat;
    let def = data.stats[2].base_stat;
    $("hp").innerHTML = `<strong>HP:</strong> ${hp}`;
    $("attack").innerHTML = `<strong>Attack:</strong> ${atk}`;
    $("defense").innerHTML = `<strong>Defense:</strong> ${def}`;

    //Bara de status de Hp, Attack e Defense



    // função que atualiza as barras
    function atualizarBarras() {
      document.getElementById("hpbar").style.width = hp + "%";
      document.getElementById("atkbar").style.width = atk + "%";
      document.getElementById("defbar").style.width = def + "%";
    }

    atualizarBarras(); // mostra o valor inicial

    // exemplo: depois de 2 segundos, o Pikachu toma dano e perde HP
    setTimeout(() => {
      hp = data.stats[0].base_stat; // novo valor
      $("hp").innerHTML = `<strong>HP:</strong> ${hp}`;
      atualizarBarras();
    }, 2000);





    // Evoluções
    const especieResponse = await fetch(data.species.url);
    const especieData = await especieResponse.json();
    const evolutionUrl = especieData.evolution_chain.url;

    const evolucaoResponse = await fetch(evolutionUrl);
    const evolucaoData = await evolucaoResponse.json();

    $("evolutions").innerHTML = "<strong>Evoluções:</strong><br>";

    function mostrarEvolucoes(chain) {
      $("evolutions").innerHTML += `<p>${capitalize(chain.species.name)}</p>`;
      chain.evolves_to.forEach(evolucao => mostrarEvolucoes(evolucao));
    }
    mostrarEvolucoes(evolucaoData.chain);



    // Imagem
    // Seleciona a imagem com fallback seguro
    const photo =
      data?.sprites?.other?.["official-artwork"]?.front_default ||  // primeira opção
      data?.sprites?.other?.dream_world?.front_default ||           // segunda opção
      data?.sprites?.front_default ||                                // terceira opção
      "img/placeholder.png";                                         // fallback final

    // Define o nome com fallback
    const name = data?.name || "Pokémon desconhecido";

    // Atualiza o elemento de imagem
    img.src = photo;
    img.alt = name;


  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    $("nomePokemon").innerHTML = "Pokémon não encontrado!";
  }
}

// Função para capitalizar
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

// Controle de abas
function openTab(evt, tabName) {
  document.querySelectorAll(".tabcontent").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".tablink").forEach(l => l.classList.remove("active"));

  $(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

