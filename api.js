let buscaSerie = document.querySelector("#buscaSerie");
let btnBuscar = document.querySelector("#btnBuscar");
let semResposta = document.querySelector(".semResposta");
let informacoesSerie = document.querySelector("#informacoesSerie");
let divElenco = document.querySelector(".elenco");
let divTemporadas = document.querySelector(".temporadas");

btnBuscar.addEventListener("click", mostrarSerie);

buscaSerie.addEventListener("keypress", function(e){
    if(e.which == 13){
        mostrarSerie();
    }
});

function mostrarSerie(){
    let buscaAPI = buscaSerie.value.replace(" ", "+");
    
    let url = `http://api.tvmaze.com/singlesearch/shows?q=${buscaAPI}&embed[]=cast&embed[]=seasons&embed[]=episodes&embed[]=images`;
    
    fetch(url)
    .then( (resposta) => resposta.json() )
    .then( (dados) => {
        console.log( dados );
        informacoesSerie.style.visibility = "visible";
        divElenco.style.visibility = "visible";
        divTemporadas.style.visibility = "visible";
        semResposta.style.visibility = "hidden"; 

        //Foto Poster
        let html = `<img src="${dados._embedded.images[0].resolutions.original.url}" width="350px">`;
        document.querySelector("#fotoPoster").innerHTML = html;

        //Nome da Série
        document.querySelector("#nomeSerie").innerHTML = dados.name;

        //Gêneros da Série
        html = "";
        for(i = 0; i < dados.genres.length; i++){
            html += dados.genres[i] + ", ";
        }
        html = html.replace(/,\s*$/, "");
        document.querySelector("#generosSerie").innerHTML = html;

        //Sinopse da Série
        document.querySelector("#sinopseSerie").innerHTML = dados.summary;

        // Elenco
        document.querySelector(".elenco .elenco-container").innerHTML = "";
        for (let i = 0; i < dados._embedded.cast.length; i++) {
            let actor = dados._embedded.cast[i];

            let html = `
            <div class="ator">
                <img src="${actor.person.image.medium}" />
                <span class="nome">${actor.person.name}</span>
                <span class="personagem">${actor.character.name}</span>
            </div>
            `;

        document.querySelector(".elenco .elenco-container").insertAdjacentHTML('beforeend', html);
        }

        // Temporadas
        document.querySelector(".temporadas .temporadas-container").innerHTML = "";
        for (i = 0; i < dados._embedded.seasons.length; i++) {
            let season = dados._embedded.seasons[i];
            
            if(season.image != null){
                if(season.summary != null){
                    let html = `
                    <div class="temporada">
                        <div class="poster">
                            <img src="${season.image.medium}" />
                        </div>
                        <div class="info">
                            <h3>Temporada ${season.number}</h3>
                            <div class="subtitulo">
                                ${season.premiereDate} | ${season.episodeOrder} episódios
                            </div>
                            <p class="sinopse">${season.summary}</p>
                            <a href="#" class="botao" id="btn-${season.number}">Ver episódios</a>
                            <div class="episodios" id="episodios-${season.number}"></div>
                        </div>
                    </div>
                    `;

                    document.querySelector(".temporadas .temporadas-container").insertAdjacentHTML('beforeend', html);

                    const btnEpisodios = document.querySelector(`#btn-${season.number}`);

                    let idSeason = season.id;
                    btnEpisodios.addEventListener("click", (ev) => mostraEpisodios(ev, season.number, idSeason) );
                }else{
                    let html = `
                    <div class="temporada">
                        <div class="poster">
                            <img src="${season.image.medium}" />
                        </div>
                        <div class="info">
                            <h3>Temporada ${season.number}</h3>
                            <div class="subtitulo">
                                ${season.premiereDate} | ${season.episodeOrder} episódios
                            </div>
                            <a href="#" class="botao" id="btn-${season.number}">Ver episódios</a>
                            <div class="episodios" id="episodios-${season.number}"></div>
                        </div>
                    </div>
                    `;

                    document.querySelector(".temporadas .temporadas-container").insertAdjacentHTML('beforeend', html);


                    const btnEpisodios = document.querySelector(`#btn-${season.number}`);

                    let idSeason = season.id;
                    btnEpisodios.addEventListener("click", (ev) => mostraEpisodios(ev, season.number, idSeason) );
                }
            }else{
                if(season.summary != null){
                    let html = `
                    <div class="temporada">
                        <div class="poster">
                            <p>Sem Imagem</p>
                        </div>
                        <div class="info">
                            <h3>Temporada ${season.number}</h3>
                            <div class="subtitulo">
                                ${season.premiereDate} | ${season.episodeOrder} episódios
                            </div>
                            <p class="sinopse">${season.summary}</p>
                            <a href="#" class="botao" id="btn-${season.number}">Ver episódios</a>
                            <div class="episodios" id="episodios-${season.number}"></div>
                        </div>
                    </div>
                    `;

                    document.querySelector(".temporadas .temporadas-container").insertAdjacentHTML('beforeend', html);

                    const btnEpisodios = document.querySelector(`#btn-${season.number}`);

                    let idSeason = season.id;
                    btnEpisodios.addEventListener("click", (ev) => mostraEpisodios(ev, season.number, idSeason) );
                }else{
                    let html = `
                    <div class="temporada">
                        <div class="poster">
                            <p>Sem Imagem</p>
                        </div>
                        <div class="info">
                            <h3>Temporada ${season.number}</h3>
                            <div class="subtitulo">
                                ${season.premiereDate} | ${season.episodeOrder} episódios
                            </div>
                            <a href="#" class="botao" id="btn-${season.number}">Ver episódios</a>
                            <div class="episodios" id="episodios-${season.number}"></div>
                        </div>
                    </div>
                    `;

                    document.querySelector(".temporadas .temporadas-container").insertAdjacentHTML('beforeend', html);

                    const btnEpisodios = document.querySelector(`#btn-${season.number}`);

                    let idSeason = season.id;
                    btnEpisodios.addEventListener("click", (ev) => mostraEpisodios(ev, season.number, idSeason) );
                }
            }
        }
    })
    .catch( (erro) => {
        console.log(erro);
        informacoesSerie.style.visibility = "hidden";
        divElenco.style.visibility = "hidden";
        divTemporadas.style.visibility = "hidden";
        semResposta.style.visibility = "visible"; 
    });
}

// Episódios
function mostraEpisodios(ev, numero, id) {
    ev.preventDefault();
        
    const n = numero; 

    document.querySelector(`#episodios-${n}`).innerHTML = ""; 

    url = `http://api.tvmaze.com/seasons/${id}/episodes`;

    fetch(url)
        .then( (resposta) => resposta.json() )
        .then( (dados) => {
            console.log( dados );
               
            for (let j = 0; j < dados.length; j++) {
                const episodio = dados[j];
                 
                if(episodio.image != null){
                    const html = `
                        <div class="episodio">
                            <div class="foto">
                                <img src="${episodio.image.medium}" />
                            </div>
                            <div class="info">
                                <h4>${episodio.number} | ${episodio.name}</h4>
                                <p>${episodio.summary}</p>
                            </div>
                        </div>
                    `;

                    document.querySelector(`#episodios-${n}`).insertAdjacentHTML('beforeend', html);
                }else{
                    const html = `
                        <div class="episodio">
                            <div class="foto">
                                <p>Sem Imagem</p>
                            </div>
                            <div class="info">
                                <h4>${episodio.number} | ${episodio.name}</h4>
                                <p>${episodio.summary}</p>
                            </div>
                        </div>
                    `;

                    document.querySelector(`#episodios-${n}`).insertAdjacentHTML('beforeend', html);
                }
            }
        })
        .catch( (erro) => console.log(erro) );    
}