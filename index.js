let tableContent = [
    {
        name: "Marian",
        surname: "George",
        email: "george@email.com",
        gender: "Masculin",
        birthdate: "21 April 3020"
    },
    {
        name: "name1",
        surname: "surname1",
        email: "email1@email.com",
        gender: "Masculin",
        birthdate: "21 August 3020"
    },
    {
        name: "name2",
        surname: "surname2",
        email: "email2@email.com",
        gender: "Feminin",
        birthdate: "21 May 3020"
    },
    {
        name: "name3",
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
    var tbl  = document.getElementById('entries');

    for(const entry of tableContent){
        var tr = tbl.insertRow();
        tr.id = ids++
        for(const entryProperty in entry){
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(entry[entryProperty]));
        }

        var td = tr.insertCell();
        td.appendChild(createButton(tr.id));
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

function onDelete(id){
    document.getElementById(id).remove()
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
    if(!name || !surname ){
        loggingMessage = "No name or surname war provided\n"
    }

    var email = validateEmail(document.getElementById('new-email').value, {loggingMessage})
    var gender = document.getElementById('new-gender').value
    var birthdate = formatDate(document.getElementById('new-birthdate').value, {loggingMessage})
    
    const file = document.getElementById('new-image').files[0]

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

    var tbl  = document.getElementById('entries');
    var tr = tbl.insertRow();
    tr.id = ids++

    tableContent.push({
        name: name,
        surname: surname,
        email: email,
        gender: gender,
        birthdate: birthdate
    })

    for(const input of [name, surname, email, gender, birthdate]){
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(input));
    }

    var td = tr.insertCell();
    td.appendChild(createButton(tr.id));

    closeModal()
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