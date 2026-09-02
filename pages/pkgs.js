const API = "https://api.github.com/repos/pietroago/volkrigOS/contents/packages";

const packageList =
    document.getElementById("package-list");

const searchForm =
    document.getElementById("search-form");

const searchInput =
    document.getElementById("package-search");

let packages = [];


async function loadPackages() {

    try {

        const architecturesResponse =
            await fetch(API);

        if (!architecturesResponse.ok) {
            throw new Error("could not access packages repository");
        }

        const architectures =
            await architecturesResponse.json();

        for (const architecture of architectures) {

            if (architecture.type !== "dir") {
                continue;
            }

            const response =
                await fetch(architecture.url);

            if (!response.ok) {
                continue;
            }

            const files =
                await response.json();

            for (const file of files) {

                if (
                    file.type !== "file" ||
                    !file.name.endsWith(".tar.xz")
                ) {
                    continue;
                }

                packages.push({
                    name: file.name,
                    architecture: architecture.name,
                    download: file.download_url,
                    github: file.html_url
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

        link.href = pkg.download;
        link.textContent = pkg.name;

        li.appendChild(link);

        li.append(
            ` — ${pkg.architecture}`
        );

        packageList.appendChild(li);
    }
}


searchForm.addEventListener(
    "submit",
    function (event) {

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
