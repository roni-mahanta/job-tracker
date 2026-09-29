// ==========================================
// JOB APPLICATION TRACKER
// ==========================================


// ==========================================
// 1. SELECT HTML ELEMENTS
// ==========================================

const jobForm = document.getElementById("jobForm");

const companyInput = document.getElementById("company");

const roleInput = document.getElementById("role");

const statusInput = document.getElementById("status");

const searchInput = document.getElementById("searchInput");

const jobList = document.getElementById("jobList");

const totalApplications =
    document.getElementById("totalApplications");

const appliedCount =
    document.getElementById("appliedCount");

const interviewCount =
    document.getElementById("interviewCount");

const selectedCount =
    document.getElementById("selectedCount");


// ==========================================
// 2. APPLICATION DATA
// ==========================================

let jobs = [];

let editingJobId = null;


// ==========================================
// 3. LOAD DATA FROM LOCAL STORAGE
// ==========================================

function loadJobs() {

    const savedJobs = localStorage.getItem("jobs");

    if (savedJobs) {

        jobs = JSON.parse(savedJobs);

    }

}


// ==========================================
// 4. SAVE DATA TO LOCAL STORAGE
// ==========================================

function saveJobs() {

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );

}


// ==========================================
// 5. CREATE JOB OBJECT
// ==========================================

function createJob(company, role, status) {

    return {

        id: Date.now(),

        company: company,

        role: role,

        status: status

    };

}


// ==========================================
// 6. ADD JOB
// ==========================================

function addJob(company, role, status) {

    const job = createJob(
        company,
        role,
        status
    );

    jobs.push(job);

    saveJobs();

    renderJobs();

    updateDashboard();

}


// ==========================================
// 7. RENDER JOBS
// ==========================================

function renderJobs(jobArray = jobs) {

    jobList.innerHTML = "";

    if (jobArray.length === 0) {

        jobList.innerHTML = `
            <p>No applications found.</p>
        `;

        return;

    }


    jobArray.forEach(function(job) {

        const card = document.createElement("div");

        card.className = "job-card";


        card.innerHTML = `

            <h3>${job.company}</h3>

            <p>
                <strong>Role:</strong>
                ${job.role}
            </p>

            <p>
                <strong>Status:</strong>
                ${job.status}
            </p>

            <button
                class="edit-btn"
                data-id="${job.id}">
                Edit
            </button>

            <button
                class="delete-btn"
                data-id="${job.id}">
                Delete
            </button>

        `;


        jobList.appendChild(card);

    });

}


// ==========================================
// 8. UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const total = jobs.length;


    const applied = jobs.filter(function(job) {

        return job.status === "Applied";

    }).length;


    const interview = jobs.filter(function(job) {

        return job.status === "Interview";

    }).length;


    const selected = jobs.filter(function(job) {

        return job.status === "Selected";

    }).length;


    totalApplications.textContent = total;

    appliedCount.textContent = applied;

    interviewCount.textContent = interview;

    selectedCount.textContent = selected;

}


// ==========================================
// 9. FORM SUBMISSION
// ==========================================

jobForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const company =
            companyInput.value.trim();

        const role =
            roleInput.value.trim();

        const status =
            statusInput.value;


        if (company === "" || role === "") {

            alert("Please fill all fields.");

            return;

        }


        if (editingJobId !== null) {

            updateJob(
                editingJobId,
                company,
                role,
                status
            );

        } else {

            addJob(
                company,
                role,
                status
            );

        }


        jobForm.reset();

        editingJobId = null;

    }
);


// ==========================================
// 10. EVENT DELEGATION
// ==========================================

jobList.addEventListener(
    "click",
    function(event) {


        const id =
            Number(event.target.dataset.id);


        // DELETE

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            deleteJob(id);

        }


        // EDIT

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            editJob(id);

        }

    }
);


// ==========================================
// 11. DELETE JOB
// ==========================================

function deleteJob(id) {

    jobs = jobs.filter(function(job) {

        return job.id !== id;

    });


    saveJobs();

    renderJobs();

    updateDashboard();

}


// ==========================================
// 12. FIND JOB
// ==========================================

function findJob(id) {

    return jobs.find(function(job) {

        return job.id === id;

    });

}


// ==========================================
// 13. EDIT JOB
// ==========================================

function editJob(id) {

    const job = findJob(id);


    if (!job) {

        return;

    }


    companyInput.value =
        job.company;

    roleInput.value =
        job.role;

    statusInput.value =
        job.status;


    editingJobId = id;

}


// ==========================================
// 14. UPDATE JOB
// ==========================================

function updateJob(
    id,
    company,
    role,
    status
) {

    jobs = jobs.map(function(job) {

        if (job.id === id) {

            return {

                ...job,

                company: company,

                role: role,

                status: status

            };

        }


        return job;

    });


    saveJobs();

    renderJobs();

    updateDashboard();

}


// ==========================================
// 15. SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function(event) {

        const searchText =
            event.target.value
                .toLowerCase()
                .trim();


        const filteredJobs =
            jobs.filter(function(job) {

                return (

                    job.company
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    job.role
                        .toLowerCase()
                        .includes(searchText)

                );

            });


        renderJobs(filteredJobs);

    }
);


// ==========================================
// 16. START APPLICATION
// ==========================================

function init() {

    loadJobs();

    renderJobs();

    updateDashboard();

}


init();