const url = "https://api.github.com/repos/pietroago/volkrigOS/contents/packages";

const packageList =
    document.getElementById("package-list");

const searchInput =
    document.getElementById("package-search");

const searchForm =
    document.getElementById("search-form");

let packages = [];


async function loadPackages() {

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("GitHub API error");
        }

        const architectures = await response.json();

        for (const architecture of architectures) {

            if (architecture.type !== "dir") {
                continue;
            }

            const response =
                await fetch(architecture.url);

            if (!response.ok) {
                continue;
            }

            const packageDirectories =
                await response.json();

            for (const pkg of packageDirectories) {

                if (pkg.type !== "dir") {
                    continue;
                }

                packages.push({
                    name: pkg.name,
                    architecture: architecture.name,
                    url: pkg.url
                });

            }
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

        link.href =
            `https://github.com/pietroago/volkrigOS/tree/main/packages/${pkg.architecture}/${pkg.name}`;

        link.textContent =
            pkg.name;

        li.appendChild(link);

        li.append(
            ` — ${pkg.architecture}`
        );

        packageList.appendChild(li);
    }
}


searchForm.addEventListener(
    "submit",
    function(event) {

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


loadPackages();