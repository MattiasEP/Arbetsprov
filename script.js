class App {
    constructor() {
        this.apiURL = 'https://swapi.co/api/people/?search='

        this.searchResults = []
        this.savedItems = []
        this.selectedIndex = -1

        this.searchInput = document.querySelector('#search-input')
        this.searchForm = document.querySelector('#search-form')
        this.listContainer = document.querySelector('#list-container')

        this.loader = `<div class="loader" >
                            <svg width="50" height="50" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z"></path>
                            </svg>
                        </div>`
    
        this.deleteItem = this.deleteItem.bind(this)
    }

    init() {
        this.bindEvents()
    }

    bindEvents() {
        
        let timer
        this.searchInput.addEventListener('keydown', (e) => {
            if(e.key === 'Backspace') {
                this.listContainer.style.display = 'none'
                // this.searchResults = []
                this.displayResults()
            }

            if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                this.switchSelectedResult(e.key)
                return
            } 
            
            if(e.key === 'Escape') {
                this.searchInput.value = ''
                this.searchResults = []
                this.listContainer.style.display = 'none'
                this.displaySavedItems()
            }

            if(e.key === 'Delete') {
                if(this.listContainer.childNodes[0].id === 'saved-items') {
                    console.log( 'DELETE' )
                    this.deleteItem()
                } else {
                    console.log( 'inget togs bort' )
                }
                
            } 

            clearTimeout(timer)
            timer = setTimeout(() => {
                if(this.searchInput.value !== '') {
                    this.searchResults = []
                    this.listContainer.style.display = 'block'
                    this.listContainer.innerHTML = this.loader
                    fetch(this.apiURL + this.searchInput.value )
                        .then( response => response.json() )
                        .then( json => {
                            json.results.forEach(result => {
                                this.searchResults.push(result.name)
                            })
                            this.searchResults.sort() // Hur gör man rätt?
                            this.displayResults()
                        })
                }
            }, 300);
        

        })

        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.searchInput.value = ''
            this.listContainer.style.display = 'none'
            if(this.selectedIndex !== -1 && this.searchResults.length > 0) {
                this.saveItem()
            }
        })

    }

    displayResults() {
        this.selectedIndex = -1
        
        let html = `<ul>`

        if(this.searchResults.length > 0) {
       
            this.searchResults.forEach(result => {
                html += `<li>${result}</li>`
            })
        } else {
            html += `<li>Sorry, no results found...</li>`
        }
        
        html += `</ul>`

        this.listContainer.innerHTML = html
    }

    switchSelectedResult(key) {

        let listItems = this.listContainer.childNodes[0].childNodes

        if (key === 'ArrowDown' && this.selectedIndex < listItems.length - 1) {
            this.selectedIndex++
        }
        else if (key === 'ArrowUp' && this.selectedIndex >= 1) {
            this.selectedIndex--
        } 
        else if (this.selectedIndex === -1) {
            this.selectedIndex++
        }
        
        if( listItems.length > 0 ) {
            listItems.forEach( (listItem, i) => {
                // console.dir(listItem)
                i === this.selectedIndex 
                    ? listItem.classList.add('selected') 
                    : listItem.classList.remove('selected')
            })
        }
    }

    saveItem() {

        const date = new Date()
        const year = date.getFullYear()
        const month = ( '0' + (date.getMonth() + 1) ).substr(-2)
        const day = ( '0' + date.getDay() ).substr(-2)
        const hour = ( '0' + date.getHours() ).substr(-2)
        const min = ( '0' + date.getMinutes() ).substr(-2)
        
        const timestamp = `${year}-${month}-${day} ${hour}:${min}`
        
        this.savedItems.push({
            name: this.searchResults[this.selectedIndex],
            timestamp: timestamp 
        })
        this.searchResults = []
        this.displaySavedItems()
    }


    displaySavedItems() {
        this.selectedIndex = -1
        if(this.savedItems.length > 0) {
            let html = `<ul id="saved-items">`
    
    
            if(this.savedItems.length > 0) {
                this.savedItems.forEach((item, index) => {
                    html += `<li>${item.name}
                                <span class="timestamp">${item.timestamp}</span>
                                <button onclick="app.deleteItem(${index})" tabindex="-1"><span>✕</span></button>
                            </li>`
                })
            }
    
            html += `</ul>`
    
            this.listContainer.innerHTML = html
            this.listContainer.style.display = 'block'
        } else {
            this.listContainer.style.display = 'none'    
        }
    }

    deleteItem(index) {
        this.savedItems.splice(index, 1)
        this.displaySavedItems()
    }

}

const app = new App()

app.init()

