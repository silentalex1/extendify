async function navigate(section) {
    const content = document.getElementById('content');
    if (section === 'home') {
        content.innerHTML = `<h2>Welcome to Extendify!</h2>
                             <p>Your one-stop shop for Chrome extensions.</p>`;
    } else if (section === 'post') {
        content.innerHTML = `<h2>Post Your Extension</h2>
                             <form id="postForm">
                                <input type="text" id="name" placeholder="Extension Name" required>
                                <textarea id="description" placeholder="Description" required></textarea>
                                <button type="submit">Post</button>
                             </form>`;
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const response = await fetch('/post-extension', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            if (response.ok) alert('Extension posted!');
        });
    } else if (section === 'explore') {
        const response = await fetch('/get-extensions');
        const extensions = await response.json();
        content.innerHTML = `<h2>Explore Extensions</h2>` +
            extensions.map(ext => `<div class="card">
                <h3>${ext.name}</h3>
                <p>${ext.description}</p>
            </div>`).join('');
    }
}
