class App {
    constructor() {
        this.apiURL = 'https://swapi.co/api/people/?search='

        this.searchResults = []

        this.searchInput = document.querySelector('#search-input')
        this.listContainer = document.querySelector('#list-container')

        this.loader = `<div class="loader" >
                            <svg width="48" height="48" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z" fill="#76f19a"></path>
                            </svg>
                        </div>`
    }

    init() {
        this.bindEvents()
    }

    bindEvents() {
        
        let timer
        this.searchInput.addEventListener('keydown', (e) => {
            
            if(e.key === 'Backspace') {
                this.listContainer.style.display = 'none'
                this.searchResults = []
                this.displayResults()
            }

            if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                this.switchSelectedResult(e.key)
                return
            } 
            
            clearTimeout(timer)
            timer = setTimeout(() => {
                if(this.searchInput.value !== '') {
                    this.listContainer.style.display = 'block'
                    this.listContainer.innerHTML = this.loader
                    fetch(this.apiURL + this.searchInput.value )
                        .then( response => response.json() )
                        .then( json => { 
                            this.searchResults = json.results 
                            this.displayResults()
                        })
                }
            }, 300);

        })
    }

    displayResults() {
        let html = `<ul>`
        
        if(this.searchResults.length > 0) {
            this.searchResults.forEach(result => {
                html += `<li>${result.name}</li>`
            })
        } else {
            html += `<li>Sorry, no results found...</li>`
        }

        html += `</ul>`

        this.listContainer.innerHTML = html
    }

    switchSelectedResult(key) {
        console.log( key )
    }

}

const app = new App()

app.init()

