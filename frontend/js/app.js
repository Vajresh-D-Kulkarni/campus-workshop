const API_BASE_URL = 'http://localhost:8000/api/v1/students';

// DOM Elements
const studentForm = document.getElementById('student-form');
const studentsTbody = document.getElementById('students-tbody');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const messageContainer = document.getElementById('message-container');
const refreshBtn = document.getElementById('refresh-btn');

// Initial Load
document.addEventListener('DOMContentLoaded', fetchAllStudents);
refreshBtn.addEventListener('click', fetchAllStudents);

// Handle Form Submit
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('student-id').value;
    
    const studentData = {
        name: document.getElementById('name').value,
        roll_no: document.getElementById('roll_no').value,
        branch: document.getElementById('branch').value,
        year: parseInt(document.getElementById('year').value),
        email: document.getElementById('email').value
    };

    try {
        let response;
        if (id) {
            // Update existing
            response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        } else {
            // Create new
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        }
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail ? JSON.stringify(err.detail) : 'Operation failed');
        }

        showMessage(id ? 'Student updated successfully!' : 'Student added successfully!', 'success');
        resetForm();
        fetchAllStudents();
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// Cancel Edit
cancelBtn.addEventListener('click', resetForm);

// --- API Functions ---
async function fetchAllStudents() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const students = await response.json();
        renderTable(students);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete student');
        
        showMessage('Student deleted successfully!', 'success');
        fetchAllStudents();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// --- Helper Functions ---
function renderTable(students) {
    studentsTbody.innerHTML = '';
    
    if (students.length === 0) {
        studentsTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students found</td></tr>';
        return;
    }
    
    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.roll_no)}</td>
            <td>${escapeHTML(student.branch)}</td>
            <td>${student.year}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>
                <button class="btn btn-edit" onclick='editStudent(${JSON.stringify(student).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        studentsTbody.appendChild(tr);
    });
}

window.editStudent = function(student) {
    document.getElementById('student-id').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('roll_no').value = student.roll_no;
    document.getElementById('branch').value = student.branch;
    document.getElementById('year').value = student.year;
    document.getElementById('email').value = student.email;
    
    formTitle.textContent = 'Edit Student';
    submitBtn.textContent = 'Update Student';
    cancelBtn.style.display = 'inline-block';
    
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    studentForm.reset();
    document.getElementById('student-id').value = '';
    formTitle.textContent = 'Add New Student';
    submitBtn.textContent = 'Add Student';
    cancelBtn.style.display = 'none';
}

function showMessage(msg, type) {
    messageContainer.innerHTML = `<div class="message ${type}">${msg}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 5000);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
