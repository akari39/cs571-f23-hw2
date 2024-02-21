function fetchStudentData() {
	fetch("https://cs571.org/api/f23/hw2/students", {
		headers: {
			"X-CS571-ID": CS571.getBadgerId()
		}
	})
	.then(res => {
		if (res.status === 200 || res.status === 304) {
			return res.json()
		} else {
			throw new Error();
		}
	})
	.then(data => {
		console.log(data)
		const searchedData = search(data);
		showStudentNumbers(searchedData.length)
		showStudentContent(searchedData);
	})
	.catch(err => {
		console.error(`Could not get the student data. Error: \n${err}`)
	})
}

function showStudentNumbers(num) {
	document.getElementById("num-results").innerText = num;
}

function showStudentContent(students) {
	document.getElementById("students").innerHTML = buildStudentsHtml(students);
}

/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
	return studs.map(stud => buildStudentHtml(stud)).join("\n");
}

/**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
function buildStudentHtml(stud) {
	let html = `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">`;
	html += `<h2>${stud.name.first} ${stud.name.last}</h2>`;
	html += `<p><b>${stud.major}</b><p>`
	html += `<p>${stud.name.first} is taking ${stud.numCredits} and is ${stud.fromWisconsin ? '' : 'not'} from Wisconsin.</p>`
	html += `<p>They have ${stud.interests.length} including...</p>`
	html += `<ul>`;
	for (const interest of stud.interests) {
		html += `<li>${interest}</li>`;
	}
	html += `</ul>`;
	html += `</div>`
	return html;
}

function handleSearch(e) {
	e.preventDefault();
	fetchStudentData();
}

function search(data) {
	let searchName = document.getElementById("search-name").value.toLowerCase().replace(' ', '');
	let searchMajor = document.getElementById("search-major").value.toLowerCase().replace(' ', '');
	let searchInterest = document.getElementById("search-interest").value.toLowerCase().replace(' ', '');
	if (searchName.length === 0 && searchMajor.length === 0 && searchInterest.length === 0) {
		return data;
	}
	let searchedData = [];
	for (const student of data) {
		const studentFirstName = student.name.first.toLowerCase().replace(' ', '');
		const studentLastName = student.name.last.toLowerCase().replace(' ', '');
		const studentName = studentFirstName + studentLastName;
		if (searchName.length > 0) {
			if (!studentFirstName.includes(searchName) && !studentLastName.includes(searchName) && !studentName.includes(searchName)) {
				continue;
			}
		}
		const studentMajor = student.major.toLowerCase().replace(' ', '');
		if (searchMajor.length > 0) {
			if (!studentMajor.includes(searchMajor)) {
				continue;
			}
		}
		const studentInterests = student.interests;
		if (searchInterest.length > 0) {
			let isMatch = false;
			for (const studentInterest of studentInterests) {
				const studentInterestLowerCase = studentInterest.toLowerCase().replace(' ', '');
				if (studentInterestLowerCase.includes(searchInterest)) {
					isMatch = true;
					break;
				}
			}
			if (!isMatch) {
				continue;
			}
		}
		searchedData.push(student);
	}
	return searchedData;
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
fetchStudentData();