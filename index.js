let tableContent = [
    {
        profileImg: undefined,
        name: "Marian",
        surname: "George",
        email: "george@email.com",
        gender: "Masculin",
        birthdate: "21 April 3020"
    },
    {
        profileImg: undefined,
        name: "name1",
        surname: "surname1",
        email: "email1@email.com",
        gender: "Masculin",
        birthdate: "21 August 3020"
    },
    {
        profileImg: undefined,
        name: "aname2",
        surname: "surname2",
        email: "email2@email.com",
        gender: "Feminin",
        birthdate: "21 May 3020"
    },
    {
        profileImg: undefined,
        name: "dname3",
        surname: "surname3",
        email: "email3@email.com",
        gender: "Feminin",
        birthdate: "21 July 3020"
    },
]

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
ids = 0

function tableCreate(){
    var tbl  = document.getElementById('entries').getElementsByTagName('tbody')[0]

    for(const entry of tableContent){
        addElementInTable(tbl, entry)
    }
}
tableCreate();

function createButton(id){
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btn btn-newentry";
    btn.value = 'Remove';
    btn.onclick = (function(id) {return function() {onDelete(id);}})(id);
    
    return btn
}

function createImage(url){
    if(url == undefined){
        url = 'resources/no_profile_image.png'
    }
    
    var img = document.createElement('img')
    img.src = url
    img.className = 'profile-img'

    return img
}

function onDelete(id){
    var row = document.getElementById(id)
    const entry = {
        name: row.childNodes[1].textContent,
        surname: row.childNodes[2].textContent,
        email: row.childNodes[3].textContent,
        gender: row.childNodes[4].textContent,
        birthdate: row.childNodes[5].textContent
    }

    tableContent = tableContent.filter((value, index, arr) => {
        return JSON.stringify(value) != JSON.stringify(entry)
    })

    row.remove()
}

function openModal(){
    var modal = document.getElementById("myModal");

    modal.style.display = "block";
}

function closeModal(){
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
}

function createNewEntry(){
    let loggingMessage = new String('');

    var name = document.getElementById('new-name').value
    var surname = document.getElementById('new-surname').value
    
    var email = validateEmail(document.getElementById('new-email').value, {loggingMessage})
    var gender = document.getElementById('new-gender').value
    var birthdate = formatDate(document.getElementById('new-birthdate').value, {loggingMessage})
    
    if(!name || !surname ){
        loggingMessage = "No name or surname war provided\n"
    }
    
    if(!email){
        loggingMessage = loggingMessage.concat('The email format is wrong\n' )
    }
    
    if(!birthdate){
        loggingMessage = loggingMessage.concat('You must be at least 16 years old or the you have not selected anything!\n' )
    }
    
    if(loggingMessage.length != 0){
        alert(loggingMessage)
        return
    }

    const addNewEntry = (img) => {
        var element = {
            profileImg: img,
            name: name,
            surname: surname,
            email: email,
            gender: gender,
            birthdate: birthdate
        }
        tableContent.push(element)
        var tbl  = document.getElementById('entries').getElementsByTagName('tbody')[0]
        addElementInTable(tbl, element)
    
        closeModal()
    }

    const file = document.getElementById('new-image').files[0]

    var imageReader = new FileReader()
    imageReader.addEventListener('load', () => {
        var profilePic = imageReader.result

        addNewEntry(profilePic)
    })
    
    if(file == undefined){
        addNewEntry(undefined)
    }
    else {
        imageReader.readAsDataURL(file)
    }
    
}

function validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(re.test(String(email).toLowerCase())){
        return email
    }
    
    return undefined
}

function formatDate(user_date, str){
    if(!user_date){
        return undefined
    }

    var birthdate = new Date(user_date)
    if(calculateAge(birthdate) < 16)
        return undefined

    var formatter = user_date.split('-')
    var year = formatter[0]
    var monthIndex = Number(formatter[1])
    var month = months[monthIndex]
    var day = formatter[2]

    return `${day} ${month} ${year}`
}

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function addElementInTable(tbl, entry) {
    var tr = tbl.insertRow();
    tr.id = ids++
    for(const entryProperty in entry){
        var td = tr.insertCell();
        var element;

        if(entryProperty == 'profileImg'){
           element = createImage(entry[entryProperty]);
        } else {
            element = document.createTextNode(entry[entryProperty])
        }

        td.appendChild(element);

    }

    var td = tr.insertCell();
    td.appendChild(createButton(tr.id));
}

function sortEntriesByName(){
    var tbody  = document.getElementById('entries').getElementsByTagName('tbody')[0]
    var new_tbody = document.createElement('tbody')

    tableContent.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

    for(const entry of tableContent){
        addElementInTable(new_tbody, entry)
    }

    tbody.parentNode.replaceChild(new_tbody, tbody)
}