const apiUrl = 'http://localhost:3000/api';

// Function to load students data
const loadStudentsData = async () => {
	// Fetch the data
	let res = await fetch(`${apiUrl}/students`);
	let data = await res.json();

	// Collect the data
	let students = data.data.students;
	return students;
};

// Function to take a student object and change to a table row
const loadStudents = (student) => {
	let studentRow = `
  <tr>
          <th scope="row">${student.count}</th>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.gender}</td>
          <td>${student.course}</td>
          <td>${student.age}</td>
          <td>
              <div class="d-flex-inline">
                    <button class="btn btn-secondary" 
                    data-id="${student._id}" 
                    data-name="${student.name}"
                    data-email = "${student.email}"
                    data-gender = "${student.gender}"
                    data-course = "${student.course}"
                    data-age = "${student.age}" 
                    data-toggle="modal" 
                    data-target="#editModal"
                    >
                        Edit
                    </button>
                    <button class="btn btn-danger delete-btn" id="${student._id}">Delete</button>
                </div>
            </td>
    </tr>
    `;
	return studentRow;
};

// Function to pass the html data to the view once the page is loaded
window.addEventListener('load', async () => {
	let data = await loadStudentsData();
	let count = 1;

	let studentsHtmlArray = data.map((student) => {
		student.count = count;
		count++;
		return loadStudents(student);
	});

	let studentsHtml = studentsHtmlArray.join(' ');

	document.getElementById('students').innerHTML = studentsHtml;

	enableToDelete();
});

// Add delete event listener to all delete buttons
const enableToDelete = () => {
	let deleteBTNs = document.getElementsByClassName('delete-btn');

	for (let i = 0; i < deleteBTNs.length; i++) {
		let deleteBTN = deleteBTNs[i];
		deleteBTN.addEventListener('click', (e) => {
			if (confirm('Do you want to delete this record?')) {
				let id = e.target.id;
				deleteStudent(id);
			}
		});
	}
};

// Function to delete a student
const deleteStudent = (id) => {
	fetch(`${apiUrl}/students/${id}`, {
		method: 'delete'
	})
		.then((res) => res.json)
		.then(() => {
			location.reload();
		});
};

// Add event listener to submit button
let form = document.getElementById('add-form');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	let name = form.querySelector('input#name').value;
	let email = form.querySelector('input#email').value;
	let gender = form.querySelector('select#gender').value;
	let course = form.querySelector('input#course').value;
	let age = form.querySelector('input#age').value;

	let data = {
		name,
		email,
		gender,
		course,
		age
	};

	let response = await addStudent(data);

	if (response.status == 'fail') {
		alert('Invalid request');
	} else {
		location.reload();
	}
});

// Function to add a student
const addStudent = async (data) => {
	let res = await fetch(`${apiUrl}/students`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	let message = await res.json();
	return message;
};

// Function to load data into Edit modal
$('#editModal').on('show.bs.modal', function(event) {
	let button = $(event.relatedTarget);
	let id = button.data('id');
	let name = button.data('name');
	let email = button.data('email');
	let gender = button.data('gender');
	let course = button.data('course');
	let age = button.data('age');

    let modal = $(this);
	modal.find('.modal-body input#id').val(id);
	modal.find('.modal-body input#name').val(name);
	modal.find('.modal-body input#email').val(email);
	modal.find('.modal-body input#gender').val(gender);
	modal.find('.modal-body input#course').val(course);
    modal.find('.modal-body input#age').val(age);
});

// Add event listener to submit button
let editForm = document.getElementById('edit-form');

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
	let id = editForm.querySelector('input#id').value;
	let name = editForm.querySelector('input#name').value;
	let email = editForm.querySelector('input#email').value;
	let gender = editForm.querySelector('select#gender').value;
	let course = editForm.querySelector('input#course').value;
	let age = editForm.querySelector('input#age').value;

	let data = {
		name,
		email,
		gender,
		course,
		age
    };

	let response = await editStudent(id, data);

	if (response.status == 'fail') {
		alert('Invalid request');
	} else {
		location.reload();
	}
});


// Function to add a student
const editStudent = async (id, data) => {
	let res = await fetch(`${apiUrl}/students/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	let message = await res.json();
	return message;
};
