// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js"
import { ref, push, set, getDatabase } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA81E4McyCmkUZ-2TvW2_dJQIqSCOVv5Wc",
  authDomain: "content-managment-system.firebaseapp.com",
  projectId: "content-managment-system",
  storageBucket: "content-managment-system.appspot.com",
  messagingSenderId: "573005273475",
  appId: "1:573005273475:web:ad618d314c24ee784dfeb6",
  measurementId: "G-MWLJ0M568K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

let tableContent = [
    {
        profileImg: undefined,
        name: "Marian",
        surname: "George",
        email: "george@email.com",
        gender: "Male",
        birthdate: "21 April 3020"
    },
    {
        profileImg: undefined,
        name: "Ancuta",
        surname: "Carmen",
        email: "email1@gmail.com",
        gender: "Female",
        birthdate: "21 August 1998"
    },
]
var ids = 0

async function getEmployees() {
    const employeesCol = collection(db, 'employees');
    const employeesSnapshot = await getDocs(employeesCol);
    const employeesList = employeesSnapshot.docs.map(doc => {
        var obj = doc.data()
        obj['id'] = doc.id
        
        return obj
    });

    return employeesList;
}

async function tableCreate() {
    var tbl  = document.getElementById('entries').getElementsByTagName('tbody')[0]

    let employees = await getEmployees()
    console.log(employees)

    for(const entry of employees) {
        const element = createElement(entry)
        addElementInTable(tbl, element)
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
        profileImg: (entry.profileImage === 'undefined') ? undefined : entry.profileImage,
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
    if(url == undefined) {
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

    const addNewEntry = async (img) => {
        var element = {
            profileImage: img,
            name: name,
            surname: surname,
            email: email,
            gender: gender,
            birthdate: birthdate
        }

        const employeesCol = collection(db, 'employees');
        await addDoc(employeesCol, element)

        var tbl  = document.getElementById('entries').getElementsByTagName('tbody')[0]
        addElementInTable(tbl, element)
        
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

function addElementInTable(tbl, entry) {
    var tr = tbl.insertRow();
    tr.id = ids++
    for(const entryProperty in entry){
        var td = tr.insertCell();
        var element;

        if(entryProperty == 'profileImg') {
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

function searchByName() {
    var inputValue = document.getElementById('searchBar').value
    
    if(inputValue == '')
        return

    var tbody  = document.getElementById('entries').getElementsByTagName('tbody')[0]
    var new_tbody = document.createElement('tbody')

    var searchedEntries = tableContent.filter((value, index, arr) => {
        return value.name.toLowerCase().includes(inputValue.toLowerCase()) || 
                value.surname.toLowerCase().includes(inputValue.toLowerCase())
    })

    for(const entry of searchedEntries) {
        addElementInTable(new_tbody, entry)
    }

    tbody.parentNode.replaceChild(new_tbody, tbody)
}