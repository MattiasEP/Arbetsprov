class App {
    constructor() {
        this.apiURL = 'https://swapi.co/api/people/?search='

        this.searchResults = []

        this.searchInput = document.querySelector('#search-input')
        this.listContainer = document.querySelector('#list-container')
        this.resultList = document.querySelector('#result-list')

        this.loader = `<div class="loader" >
                            <svg width="48" height="48" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z" fill="#76f19a"></path>
                            </svg>
                        </div>`
        
        this.listContainer.style.display = 'none'
    }

    init() {
        this.bindEvents()
    }

    bindEvents() {
        
        let timer
        this.searchInput.addEventListener('keydown', (e) => {
               
            
            clearTimeout(timer)
            timer = setTimeout(() => {
                this.listContainer.style.display = 'block'
                this.resultList.innerHTML = this.loader
                fetch(this.apiURL + this.searchInput.value )
                    .then( response => response.json() )
                    .then( json => { 
                        this.searchResults = json.results 
                        this.displayResults()
                    })
                
            }, 500);

        })
    }

    displayResults() {
        let html = ``
        this.searchResults.forEach(result => {
            html += `<li>${result.name}</li>`
        });
        this.resultList.innerHTML = html
    }

}

const app = new App()

app.init()

