const API =
    "https://api.github.com/repos/VolkrigOS/packages/contents";

const ARCHITECTURE = "x86_64";

const packageList =
    document.getElementById("package-list");

const searchForm =
    document.getElementById("search-form");

const searchInput =
    document.getElementById("package-search");

const packageType =
    document.getElementById("package-type");

let packages = [];

async function getPackages(url, type) {
    const response = await fetch(url);

    if (!response.ok) {
        return;
    }

    const entries = await response.json();

    for (const entry of entries) {
        if (entry.type === "dir") {
            await getPackages(entry.url, type || entry.name);
            continue;
        }

        if (
            entry.type !== "file" ||
            !entry.name.endsWith(".vpkg")
        ) {
            continue;
        }

        packages.push({
            name: entry.name,
            type,
            download: entry.download_url,
            github: entry.html_url
        });
    }
}

async function loadTypes() {
    const response =
        await fetch(`${API}/${ARCHITECTURE}`);

    if (!response.ok) {
        throw new Error("could not load package types");
    }

    const entries =
        await response.json();

    packageType.innerHTML =
        '<option value="">All packages</option>';

    for (const entry of entries) {
        if (entry.type !== "dir") {
            continue;
        }

        const option =
            document.createElement("option");

        option.value = entry.name;
        option.textContent = entry.name;

        packageType.appendChild(option);
    }
}

async function loadPackages() {
    try {
        packages = [];

        const type =
            packageType.value.trim();

        if (type) {
            await getPackages(
                `${API}/${ARCHITECTURE}/${type}`,
                type
            );
        } else {
            await getPackages(
                `${API}/${ARCHITECTURE}`,
                null
            );
        }

        showPackages(packages);

    } catch (error) {
        console.error(error);

        packageList.innerHTML =
            "<li>unable to load packages.</li>";
    }
}

function showPackages(list) {
    packageList.innerHTML = "";

    if (list.length === 0) {
        packageList.innerHTML =
            "<li>no packages found.</li>";

        return;
    }

    for (const pkg of list) {
        const li =
            document.createElement("li");

        const link =
            document.createElement("a");

        link.href = pkg.download;
        link.textContent = pkg.name;

        li.appendChild(link);

        li.append(
            ` — ${pkg.type}`
        );

        packageList.appendChild(li);
    }
}

searchForm.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        const results =
            packages.filter(pkg =>
                pkg.name
                    .toLowerCase()
                    .includes(query)
            );

        showPackages(results);
    }
);

packageType.addEventListener(
    "change",
    loadPackages
);

async function init() {
    await loadTypes();
    await loadPackages();
}

init();