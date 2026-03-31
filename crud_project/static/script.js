const API = "/employees";
let editId = null;

// Load
function loadEmployees() {
    fetch(API)
    .then(res => res.json())
    .then(data => {
        let rows = "";
        data.forEach(emp => {
            rows += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>
                    <button onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.role}')">Edit</button>
                    <button onclick="deleteEmployee(${emp.id})">Delete</button>
                </td>
            </tr>`;
        });
        document.getElementById("tableBody").innerHTML = rows;
    });
}

// Edit
function editEmployee(id, name, role) {
    document.getElementById("name").value = name;
    document.getElementById("role").value = role;
    editId = id;
}

// Add / Update
function addEmployee() {
    let name = document.getElementById("name").value;
    let role = document.getElementById("role").value;

    if (!name || !role) {
        showPopup("Fill all fields");
        return;
    }

    if (editId) {
        fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, role})
        })
        .then(() => {
            showPopup("Updated!");
            editId = null;
            loadEmployees();
        });
    } else {
        fetch(API, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, role})
        })
        .then(() => {
            showPopup("Added!");
            loadEmployees();
        });
    }

    document.getElementById("name").value = "";
    document.getElementById("role").value = "";
}

// Delete
function deleteEmployee(id) {
    fetch(`${API}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        showPopup("Deleted!");
        loadEmployees();
    });
}

// Search
function searchEmployee() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        let name = row.children[1].innerText.toLowerCase();
        let role = row.children[2].innerText.toLowerCase();

        row.style.display = (name.includes(input) || role.includes(input)) ? "" : "none";
    });
}

// Popup
function showPopup(msg) {
    let popup = document.getElementById("popup");
    popup.innerText = msg;
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", 2000);
}

loadEmployees();