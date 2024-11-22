const premadeExtensions = [
    {
        id: 'privacyrights',
        name: 'Privacy Rights',
        description: 'Explore your web securely.',
        url: '/privacyrights'
    }
];

function getExtensionsFromCookies() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('extensions='));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
}

function saveExtensionsToCookies(extensions) {
    document.cookie = `extensions=${encodeURIComponent(JSON.stringify(extensions))}; path=/`;
}

function navigate(path) {
    if (path === 'home') {
        document.getElementById('content').innerHTML = `
            <h2>Welcome to Extendify</h2>
            <p>Discover, share, and test extensions in one place.</p>
        `;
    } else if (path === 'post') {
        document.getElementById('content').innerHTML = `
            <h2>Post Your Extension</h2>
            <form id="postForm">
                <input type="text" id="name" placeholder="Extension Name" required>
                <textarea id="description" placeholder="Extension Description" required></textarea>
                <button type="submit">Post Extension</button>
            </form>
        `;
        document.getElementById('postForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const extensions = getExtensionsFromCookies();
            const newExtension = {
                id: `ext-${Date.now()}`,
                name,
                description,
                url: '/privacyrights'
            };
            extensions.push(newExtension);
            saveExtensionsToCookies(extensions);
            alert('Extension posted!');
            navigate('/privacyrights');
        });
    } else if (path === '/privacyrights') {
        location.href = '/privacyrights';
    }
}

if (!document.cookie.includes('extensions=')) {
    saveExtensionsToCookies(premadeExtensions);
}

document.addEventListener('DOMContentLoaded', () => {
    navigate('home');
});
