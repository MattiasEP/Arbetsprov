class App {
    constructor() {
        this.apiURL = 'https://swapi.co/api/people/?search='

        // Get elements from the DOM
        this.searchInput = document.querySelector('#search-input')
        this.searchForm = document.querySelector('#search-form')
        this.savedList = document.querySelector('#saved-list')
        this.dropdown = document.querySelector('#dropdown')
        this.loaderSpan = document.querySelector('#loader')

        // SVG path for a loader/spinner
        this.loader = `<svg width="25" height="25" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z"></path>
                        </svg>`
    
        // Set some initial variables for the class
        this.searchResults = []
        this.savedItems = []
        this.selectedIndex = -1
        this.isSearching = false
    }

    init() {
        this.bindEvents()
    }

    restoreSelectedIndex() { this.selectedIndex = -1 }

    bindEvents() {
        let timer
        this.searchInput.addEventListener('keydown', (e) => {
            
            if(e.key === 'Backspace') {
                //Göra bättre?
                setTimeout(() => {
                    if(this.searchInput.value.length === 0) {
                        this.hideDropdown()
                        this.isSearching = false
                    }
                }, 50)
            }

            if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                this.switchSelectedResult(e.key)
            } 
            
            if(e.key === 'Escape') {
                this.searchInput.value = ''
                this.searchResults = []
                this.displaySavedItems()
                this.hideDropdown()
                this.isSearching = false
            }

            if(e.key === 'Delete') {
                if(!this.isSearching) {
                    this.deleteItem(this.selectedIndex)
                }
            } 

            clearTimeout(timer)
            timer = setTimeout(() => {
                if(this.searchInput.value !== '') {
                    this.loaderSpan.innerHTML = this.loader
                    this.searchResults = []
                    fetch( this.apiURL + this.searchInput.value )
                        .then( response => response.json() )
                        .then( json => {
                            this.searchResults = json.results.map( result => result.name )
                            this.searchResults.sort() // Hur gör man rätt?
                            this.displayResults()
                            this.isSearching = true
                            if(this.savedItems.length > 0) { this.displaySavedItems() }
                        })
                }
            }, 300)
        })

        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.searchInput.value = ''
            if(this.selectedIndex !== -1 && this.searchResults.length > 0) {
                this.saveItem(this.selectedIndex)
                this.isSearching = false
            }
        })
    }

    showDropdown(noOfItems) {
        this.dropdown.style.height = `${noOfItems * 50}px`
        this.restoreSelectedIndex()
    }

    hideDropdown() {
        this.dropdown.style.height = '0px'
        this.restoreSelectedIndex()
    }

    displayResults() {
        this.loaderSpan.innerHTML = `<img src="./UI/assets/search.svg" />`
        this.restoreSelectedIndex()
        let html = ``
        if(this.searchResults.length > 0) {
            this.searchResults.forEach((result, index) => {
                html += `<li onclick="app.saveItem(${index})">${result}</li>`
            })
        } else {
            html += `<li>Sorry, no results found...</li>`
        }
        this.dropdown.innerHTML = html
        if (this.searchResults.length > 0) {
            this.showDropdown(this.searchResults.length)
        } else {
            this.showDropdown(1)
        }
    }

    switchSelectedResult(key) {
        let listItems

        if(this.isSearching) {
            listItems = this.dropdown.childNodes
        } else {
            listItems = this.savedList.childNodes
        }

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

    saveItem(index) {
        const date = new Date()
        const year = date.getFullYear()
        const month = ( '0' + (date.getMonth() + 1) ).substr(-2)
        const day = ( '0' + date.getDate() ).substr(-2)
        const hour = ( '0' + date.getHours() ).substr(-2)
        const min = ( '0' + date.getMinutes() ).substr(-2)
        
        const timestamp = `${year}-${month}-${day} ${hour}:${min}`
        
        this.savedItems.push({
            name: this.searchResults[index],
            timestamp: timestamp 
        })

        this.searchResults = []
        this.hideDropdown()
        this.displaySavedItems()
    }


    displaySavedItems() {
        this.savedList.style.display = 'inline-block'
        this.restoreSelectedIndex()
        
        if(this.savedItems.length > 0) {
            let html = ``
            this.savedItems.forEach((item, index) => {
                html += `<li>${item.name}
                            <span class="timestamp">${item.timestamp}</span>
                            <button onclick="app.deleteItem(${index})" tabindex="-1"><span>✕</span></button>
                        </li>`
                })
            this.savedList.innerHTML = html
        } else {
            this.savedList.style.display = 'none'
        }
    }

    deleteItem(index) {
        this.savedItems.splice(index, 1)
        this.displaySavedItems()
        this.restoreSelectedIndex()
    }

}

const app = new App()

app.init()

// Sortera rätt
// Vad ska hända när man trycker ENTER på ett valt item i savedList?
// Ändra selectedIndex på hover
// tar bort sista när this.selectedIndex === -1
