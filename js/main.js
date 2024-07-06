document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.tab-button.active').classList.remove('active');
            tab.classList.add('active');
            document.querySelector('.tab.active').classList.remove('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    loadNews();

    document.getElementById('news-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createNews();
    });
    

});

document.getElementById('news-form').addEventListener('cancel', function(e) {
    e.preventDefault();
    loadNews();
});

async function loadNews() {
    const response = await fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news');
    const newsList = await response.json();
    const tbody = document.getElementById('news-tbody');
    tbody.innerHTML = '';
    newsList.forEach(news => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${news.id}</td>
            <td>${news.title}</td>
            <td>${news.category}</td>
            <td>${news.likes}</td>
            <td>${news.dateUpdated}</td>
            <td>${news.dateCreated}</td>
            <td>
                <button class="button delete" style="background-color: white; color: black;" data-id="${news.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function() {
            deleteNews(this.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('.update').forEach(button => {
        button.addEventListener('click', function() {
            // Update functionality can be added here
        });
    });
}

async function deleteNews(id) {
    const response = await fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        const row = document.querySelector(`button[data-id="${id}"]`).closest('tr');
        row.classList.add('fade-out');
        setTimeout(() => row.remove(), 500);
    }
}

async function createNews() {
    const form = document.getElementById('news-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const response = await fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        loadNews();
        document.querySelector('.tab-button[data-tab="news-list"]').click();
    }
}