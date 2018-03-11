class App {
    constructor() {
        this.apiURL = 'https://swapi.co/api/people/?search='

        // Gets elements from the DOM
        this.searchInput = document.querySelector('#search-input')
        this.searchForm = document.querySelector('#search-form')
        this.savedList = document.querySelector('#saved-list')
        this.dropdown = document.querySelector('#dropdown')
        this.searchIcon = document.querySelector('#search-icon')

        // SVG path for a loader/spinner
        this.loader = `<svg width="25" height="25" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z"></path>
                        </svg>`
    
        // Sets some initial variables for the class
        this.searchResults = []
        this.savedItems = []
        this.selectedIndex = -1
        this.isSearching = false
    }

    // Initialize the class
    init() {
        this.bindEvents()
    }

    // Restores the index of wich item that is selected
    restoreSelectedIndex() { this.selectedIndex = -1 }

    // Adds event listeners to the form
    bindEvents() {
        let timer

        this.searchInput.addEventListener('keydown', (e) => {

            // [ArrowDown] and [ArrowUp] switches between the search results/saved items
            if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                this.switchSelectedResult(e.key)
            } 
            
            // [Escape] cancels the search
            else if(e.key === 'Escape') {
                this.searchInput.value = ''
                this.searchResults = []
                this.displaySavedItems()
                this.hideDropdown()
                this.isSearching = false
            }

            // [Delete] deletes an item from the saved list if it is selected
            else if(e.key === 'Delete') {
                if(!this.isSearching) {
                    this.deleteItem(this.selectedIndex)
                }
            } 

            // The timer prevents the API from getting spammed
            else {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    if(this.searchInput.value !== '') {
                        this.searchIcon.innerHTML = this.loader
                        this.searchResults = []
                        fetch( this.apiURL + this.searchInput.value )
                            .then( response => response.json() )
                            .then( json => {
                                this.searchResults = json.results.map( result => result.name )
                                this.searchResults.sort()  
                                this.displayResults()
                                this.isSearching = true
                                if(this.savedItems.length > 0) { this.displaySavedItems() }
                            })
                    }
                }, 300)
            }
        })

        // Listens on 'keyup' so that you get the correct value from the input
        this.searchInput.addEventListener('keyup', (e) => {
            // [Backspace] hides the dropdown that displays results if the input is empty
            if(e.key === 'Backspace' && this.searchInput.value.length === 0) {
                this.isSearching = false
                this.hideDropdown()
            }
        })

        // Saves the selected search result
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault()
            if(this.selectedIndex !== -1 && this.searchResults.length > 0) {
                this.saveItem(this.selectedIndex)
            }
            this.searchInput.value = ''
            this.isSearching = false
            this.hideDropdown()
        })
    }

    // Changes height of the dropdown that shows search results - li's height === 50px each
    showDropdown(noOfItems) {
        this.dropdown.style.height = `${noOfItems * 50}px`
        this.restoreSelectedIndex()
    }

    // Changes style on the dropdown that shows search results
    hideDropdown() {
        this.dropdown.style.height = '0px'
        this.restoreSelectedIndex()
    }

    // Builds the html for search results
    displayResults() {
        this.searchIcon.innerHTML = `<img src="./UI/assets/search.svg" />`
        this.restoreSelectedIndex()
        let html = ``
        if(this.searchResults.length > 0) {
            this.searchResults.forEach((result, index) => {
                html += `<li onclick="app.saveItem(${index})">${result}</li>`
            })
        } else {
            // If the fetch doesn't return any results
            html += `<li>Sorry, no results found...</li>`
        }

        this.dropdown.innerHTML = html

        if (this.searchResults.length > 0) {
            this.showDropdown(this.searchResults.length)
        } else {
            this.showDropdown(1)
        }
    }

    // Switch between wich item that should render as selected on both search results and saved items
    switchSelectedResult(key) {
        let listItems

        // If isSearching, switch between search results
        if(this.isSearching) {
            listItems = this.dropdown.childNodes
        // Else switch between saved items
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
                i === this.selectedIndex 
                    ? listItem.classList.add('selected') 
                    : listItem.classList.remove('selected')
            })
        }
    }

    // Saves an item
    saveItem(index) {

        //Gets the timestamp for when the item got saved
        const date = new Date()
        const year = date.getFullYear()
        const month = ( '0' + (date.getMonth() + 1) ).substr(-2)
        const day = ( '0' + date.getDate() ).substr(-2)
        const hour = ( '0' + date.getHours() ).substr(-2)
        const min = ( '0' + date.getMinutes() ).substr(-2)
        
        const timestamp = `${year}-${month}-${day} ${hour}:${min}`
        
        //Adds the item to the savedItems array
        this.savedItems.push({
            name: this.searchResults[index],
            timestamp: timestamp 
        })

        this.searchResults = []
        this.hideDropdown()
        this.displaySavedItems()
    }

    // Builds the html for the saved items list
    displaySavedItems() {
        this.savedList.style.display = 'inline-block'
        this.restoreSelectedIndex()
        
        if(this.savedItems.length > 0) {
            let html = ``
            this.savedItems.forEach((item, index) => {
                html += `<li>
                            <span>${item.name}</span>
                            <time>${item.timestamp}</time>
                            <button onclick="app.deleteItem(${index})" tabindex="-1"><span></span></button>
                        </li>`
                })
            this.savedList.innerHTML = html
        } else {
            this.savedList.style.display = 'none'
        }
    }

    // Deletes an item from the saved items list
    deleteItem(index) {
        this.savedItems.splice(index, 1)
        this.displaySavedItems()
        this.restoreSelectedIndex()
    }

}

const app = new App()

// Runs the app
app.init()