async function navigate(section) {
    const content = document.getElementById('content');
    if (section === 'home') {
        content.innerHTML = `
            <h2>Welcome to Extendify!</h2>
            <p>Your one-stop platform to explore, test, and share Chrome extensions.</p>
            <button class="cta-button" onclick="navigate('explore')">Explore Now</button>
        `;
    } else if (section === 'post') {
        content.innerHTML = `
            <h2>Post Your Extension</h2>
            <form id="postForm">
                <input type="text" id="name" placeholder="Extension Name" required>
                <textarea id="description" placeholder="Extension Description" required></textarea>
                <button type="submit" class="cta-button">Post Extension</button>
            </form>
        `;
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;

            const response = await fetch('/post-extension', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            if (response.ok) {
                alert('Extension posted!');
                navigate('explore');
            }
        });
    } else if (section === 'explore') {
        const response = await fetch('/get-extensions');
        const extensions = await response.json();
        content.innerHTML = `
            <h2>Explore Extensions</h2>
            ${extensions.length === 0 ? '<p>No extensions yet. Post one!</p>' : ''}
            ${extensions.map(ext => `
                <div class="card">
                    <h3>${ext.name}</h3>
                    <p>${ext.description}</p>
                </div>
            `).join('')}
        `;
    }
}
