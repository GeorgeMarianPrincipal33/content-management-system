let tableContent = [
    {
        name: "Marian",
        surname: "George",
        email: "george@email.com",
        gender: "Masculin",
        birthdate: "21.04.3020"
    },
    {
        name: "name1",
        surname: "surname1",
        email: "email1@email.com",
        gender: "Masculin",
        birthdate: "21.04.3020"
    },
    {
        name: "name2",
        surname: "surname2",
        email: "email2@email.com",
        gender: "Feminin",
        birthdate: "21.04.3020"
    },
    {
        name: "name3",
        surname: "surname3",
        email: "email3@email.com",
        gender: "Feminin",
        birthdate: "21.04.3020"
    },
]

function tableCreate(){
    var body = document.body
    var tbl  = document.getElementById('entries');

    for(const entry of tableContent){
        var tr = tbl.insertRow();

        for(const entryProperty in entry){
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(entry[entryProperty]));
        }
    }
}
tableCreate();

function openModal(){
    var modal = document.getElementById("myModal");

    modal.style.display = "block";
}

function closeModal(){
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
}

function createNewEntry(){
    var name = document.getElementById('new-name').value
    var surname = document.getElementById('new-surname').value
    var email = document.getElementById('new-email').value
    var gender = document.getElementById('new-gender').value
    var birthdate = document.getElementById('new-birthdate').value
    console.log({
        name,
        surname,
        email,
        gender,
        birthdate
    })
}