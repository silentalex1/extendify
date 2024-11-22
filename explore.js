function loadExtensions() {
    const exploreContent = document.getElementById('explore-content');
    const extensions = getExtensionsFromCookies();

    exploreContent.innerHTML = `
        <h2>Explore Extensions</h2>
        ${extensions
            .map(
                ext => `
            <div class="card">
                <h3>${ext.name}</h3>
                <p>${ext.description}</p>
                <button onclick="viewExtension('${ext.id}')">View</button>
                <button onclick="deleteExtension('${ext.id}')">Delete</button>
            </div>
        `
            )
            .join('')}
    `;
}

function viewExtension(id) {
    const extensions = getExtensionsFromCookies();
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
        location.href = extension.url;
    }
}

function deleteExtension(id) {
    let extensions = getExtensionsFromCookies();
    extensions = extensions.filter(ext => ext.id !== id);
    saveExtensionsToCookies(extensions);
    loadExtensions();
}

document.addEventListener('DOMContentLoaded', loadExtensions);
