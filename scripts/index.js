import { getEmployees, addElementToFirebase, removeFromFirebase, searchFirebaseByName } from "./firebase.js"

async function tableCreate() {
    var tbl  = document.getElementById('entries').getElementsByTagName('tbody')[0]

    let employees = await getEmployees()

    for(const entry of employees) {
        const element = createElement(entry)
        addElementInTable(tbl, entry.id, element)
    }
}
tableCreate();

(function () {
  
    document.getElementById('openModal').addEventListener('click', openModal, true);
    document.getElementById('closeModal').addEventListener('click', closeModal, true);
    document.getElementById('createNewEntry').addEventListener('click', createNewEntry, true);
    document.getElementById('sortEntriesByName').addEventListener('click', sortEntriesByName, true);
    document.getElementById('searchByName').addEventListener('click', searchByName, true);
  })();

function createElement(entry) {

    const element = {
        profileImage: entry.profileImage,
        name: entry.name,
        surname: entry.surname,
        email: entry.email,
        gender: entry.gender,
        birthdate: validateDate(entry.birthdate)
    }

    return element
}

function createButton(id) {
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btn btn-newentry";
    btn.value = 'Remove';
    btn.onclick = (function(id) {return function() {onDelete(id);}})(id);
    
    return btn
}

function createImage(url) {
    if(url === 'undefined') {
        url = 'resources/no_profile_image.png'
    }
    
    var img = document.createElement('img')
    img.src = url
    img.className = 'profile-img'

    return img
}

function onDelete(id) {

    if(confirm('Are you sure you want to remove this entry?')) {
        var row = document.getElementById(id)
        removeFromFirebase(id)
        row.remove()
    }
    
}

function openModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
}

function clearFields() {
    document.getElementById('new-name').value = ''
    document.getElementById('new-surname').value = ''
    document.getElementById('new-email').value = ''
    document.getElementById('new-birthdate').value = ''
}

function createNewEntry() {
    let loggingMessage = new String('');

    var name = document.getElementById('new-name').value
    var surname = document.getElementById('new-surname').value
    
    var email = validateEmail(document.getElementById('new-email').value)
    var gender = document.getElementById('new-gender').value
    var birthdate = validateDate(document.getElementById('new-birthdate').value)
    
    if(!name || !surname ) {
        loggingMessage = "No name or surname was provided\n"
    }
    
    if(!email) {
        loggingMessage = loggingMessage.concat('The email format is wrong\n' )
    }
    
    if(!birthdate) {
        loggingMessage = loggingMessage.concat('You must be at least 16 years old or the you have not selected anything!\n' )
    }
    
    if(loggingMessage.length != 0) {
        alert(loggingMessage)
        return
    }

    const addNewEntry = (img) => {
        var element = {
            profileImage: (img === undefined) ? 'undefined' : img,
            name: name,
            surname: surname,
            email: email,
            gender: gender,
            birthdate: birthdate
        }

        const id = addElementToFirebase(element)

        var tbl  = document.getElementById('entries').getElementsByTagName('tbody')[0]
        addElementInTable(tbl, id, element)
        
        clearFields()
        closeModal()
    }

    const file = document.getElementById('new-image').files[0]

    var imageReader = new FileReader()
    imageReader.addEventListener('load', () => {
        var profilePic = imageReader.result

        addNewEntry(profilePic)
    })
    
    if(file == undefined) {
        addNewEntry(undefined)
    }
    else {
        imageReader.readAsDataURL(file)
    }
    
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(re.test(String(email).toLowerCase())) {
        return email
    }
    
    return undefined
}

function validateDate(user_date) {
    if (!user_date) {
        return undefined
    }

    var birthdate = new Date(user_date)
    if (calculateAge(birthdate) < 16)
        return undefined

    return formatDate(birthdate)
}

function formatDate(date){ 
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'Octomber',
        'November',
        'December',
    ]

    var year = date.getFullYear()
    var monthIndex = Number(date.getMonth())
    var month = months[monthIndex]
    var day = date.getDate()

    return `${day} ${month} ${year}`
}

function calculateAge(birthday) { 
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function addElementInTable(tbl, id, entry) {
    var tr = tbl.insertRow();
    tr.id = id
    for(const entryProperty in entry){
        var td = tr.insertCell();
        var element;

        if(entryProperty == 'profileImage') {
           element = createImage(entry[entryProperty]);
        } else {
            element = document.createTextNode(entry[entryProperty])
        }

        td.appendChild(element);

    }

    var td = tr.insertCell();
    td.appendChild(createButton(tr.id));
}

function sortEntriesByName() {
    var tbody  = document.getElementById('entries').getElementsByTagName('tbody')[0]
    var new_tbody = document.createElement('tbody')

    tableContent.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

    for(const entry of tableContent) {
        addElementInTable(new_tbody, entry)
    }

    tbody.parentNode.replaceChild(new_tbody, tbody)
}

async function searchByName() {
    var inputValue = document.getElementById('searchBar').value
    
    if(inputValue == '')
        return

    var tbody  = document.getElementById('entries').getElementsByTagName('tbody')[0]
    var new_tbody = document.createElement('tbody')

    var searchedEntries = await searchFirebaseByName(inputValue)

    for(const entry of searchedEntries) {
        const element = createElement(entry)
        addElementInTable(new_tbody, entry.id, element)
    }

    tbody.parentNode.replaceChild(new_tbody, tbody)
}