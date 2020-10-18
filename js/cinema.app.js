class Theater {
    // Rows
    static letters = [
            'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z'
        ]    
    // Construct theater
    static build(stage, row, columns) {
        for(let r=0; r < this.letters.length; r++){
            let div;
            div = this.rowSeats()
            for(let c=1; c <=columns; c++){
                let seat;
                seat = this.seat(this.letters[r], c)
                div.appendChild(seat)
            }
            stage.appendChild(div)
            
            if(row == this.letters[r]){
                break
            }
        }
    }
    /** Method rowSeats
     *  Construct DIV HTML with Javascript
     *  <div class="row-seats">
     *  </div>
     */
    static rowSeats() {
        let div;
        div = document.createElement('div')
        div.classList.add('row-seats')
        return div
    }
    /** Method seat
     *  Construct DIV HTML with Javascriptç
     *  EXAMPLE
     *  <div class="seat">
     *      <input type="checkbox" name="seats" id="A01" value="A01">
     *      <label for="A01">
     *          <span>A01</span>
     *          <img src="./assets/cinema/seat-selected.svg" alt="seat">
     *      </label>
     *  </div>
     */
    static seat(row, column) {
        let num;
        num = String(column).padStart(2, '0')
        let seat;
        seat = document.createElement('div')
        seat.classList.add('seat')
        let input;
        input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('name', 'seats')
        input.setAttribute('id', `${row}${num}`)
        input.setAttribute('value', `${row}${num}`)
        seat.appendChild(input)
        let label;
        label = document.createElement('label')
        label.setAttribute('for', `${row}${num}`)
        seat.appendChild(label)
        let span;
        span = document.createElement('span')        
        let text;
        text = document.createTextNode(`${row}${num}`)
        span.appendChild(text)
        label.appendChild(span)
        let img;
        img = document.createElement('img')
        img.setAttribute('src', './assets/cinema/seat-selected.svg')
        img.setAttribute('alt', 'seat')  
        label.appendChild(img)             
        return seat
    }
    //Validate character is a number
    static isCharacterANumber(char) {
        return (/[0-5]/).test(char) // Max. 5
    }
    // Validate character is a letter of the alphabet
    static isCharacterALetter(char) {
        return (/[a-zA-Z]/).test(char)
    }
}

class TicketOffice {
    constructor() {  
        // Get element table tbody
        this.cart = document.querySelector('#cart-tickets').getElementsByTagName('tbody')[0]
        // get form with de id ticket-office
        this.form = document.querySelector('#ticket-office')
        // Form "click" event
        this.form.addEventListener('click', event => {
            if (event.target === document.getElementById('changeSeat')) {
                // Swal is a plugin SweetAlert2
                Swal.mixin({
                    input: 'text',
                    confirmButtonText: 'Next &rarr;',
                    showCancelButton: true,
                    progressSteps: ['1', '2'] //two step process
                }).queue([
                    {
                        title: 'Please select the seat to change.',
                        input: 'select',
                        inputOptions: this.occupiedSeats(), // Call method get all seats occupied
                        inputPlaceholder: 'Select a seat...'
                    },
                    {
                        title: '¡Butacas disponibles!',
                        input: 'select',
                        inputOptions: this.availableSeats(), // Call method get all seats available
                        inputPlaceholder: 'Select a seat...'
                    },
                ]).then((result) => {
                    if(result.value.length == 2){
                        this.changeSeat(result.value[0], result.value[1])
                        Swal.fire(
                            'Successful change!',
                            'success'
                        )
                    }
                    
                })
            }  
            this.addCart() 
        })
        this.form.addEventListener('submit', event => {
            // Stop event submit
            event.preventDefault()   
            // Call method purchase
            this.purchase()         
        })
    }
    // Get all seats occupied
    occupiedSeats() {
        const seats = {} // Dict object
        // get all input checkbox of the form
        this.form.querySelectorAll('input[type=checkbox]').forEach(seat => {
            if(seat.disabled === true){ // seat is occupied
                seats[seat.id] = seat.id // push seat
            }
        })
        return seats // return object
    }
    // Get all seats available
    availableSeats() {
        const seats = {} // Dict object
        // get all input checkbox of the form
        this.form.querySelectorAll('input[type=checkbox]').forEach(seat => {
            if(seat.disabled === false){ // seat not is occupied
                seats[seat.id] = seat.id // push seat
            }
        })
        return seats // return object
    }
    changeSeat(oldRow, newRow) {
        // get all input checkbox of the form
        this.form.querySelectorAll('input[type=checkbox]').forEach(seat => {
            if(seat.id === oldRow){ // oldRow (seat number) is disabled true
                seat.disabled = false // change status, now this seat is available
            }
            if(seat.id === newRow){ //newRow (seat number) is available
                seat.disabled = true // change status, now this seat is occupied
            }
        })  
    }
    addCart() {
        // table tbody will show seats selected
        this.cart.innerHTML = "" // empty   
        // get all seats selected and use foreach loop   
        this.seats.forEach(seat  => {       
            /** INSERTING ROW IN THE TABLE
             *  EXAMPLE
             *  <tr>
             *     <td>A</td>    (A01).slice(0, 1) => A
             *     <td>01</td>   (A01).slice(1, 3) => 01
             *     <td>2.75</td> 
             *  </tr>
              */           
            const tr = this.cart.insertRow(0)         
            let row = tr.insertCell(0)
            let s = tr.insertCell(1)
            let price = tr.insertCell(2)
            row.innerHTML = (seat.value).slice(0, 1)
            s.innerHTML = (seat.value).slice(1, 3)
            // TOTAL this.seats.length (selected) * 2.75, method toFixed(2) format price with two decimal
            price.innerHTML = '2.75 €'
        })  
        let total = document.getElementById("total-cart")
        total.innerHTML = `${Number.parseFloat(this.seats.length * 2.75).toFixed(2)} €`       
    }
    // Get all seat selected with FormData Class
    get formData() {
        const formData = new FormData(this.form)
        console.log(formData.getAll('seats'))
    }
    // seats selected
    get seats() {
        let seats = new Array()
        // get all input checkbox of the form
        this.form.querySelectorAll('input[type=checkbox]').forEach(seat => {
            if (seat.checked) { // this seat is checked
                seats.push(seat) // push in array seats
            }
        })
        return seats // return seats
    }
    purchase() {
        if (!this.seats.length) { // if seats (selected) is empty
            // Methos of the class Swal (SweetAlert - Plugin), error
            Swal.fire(
                'Error!',
                'Please select a seat.',
                'error'
            )
            return
        }
        Swal.fire({
            title: `You are going to purchase ${this.seats.length} ticket(s)!`,
            text: "Are you sure proceed with the purchase?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {                
                Swal.fire(
                    'Successful purchase!',
                    `You have pruchased ${this.seats.length} ticket(s).`,
                    'success'
                )
                // Result Success, change seat status
                this.seats.forEach(seat => {
                    seat.checked = false
                    seat.disabled = true                    
                })
                this.addCart()
            }
          })
    } 
}