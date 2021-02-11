function main() {
    const avatars = Array.from(document.querySelectorAll(".ghx-avatar-img"));

    const executorNames = new Set(avatars.map((i) => i.dataset.tooltip));

    const executors = Array.from(executorNames).map((name) => {
        const el = avatars.find((i) => i.dataset.tooltip === name);
        return {
            executor: name,
            avatar: el.src,
        };
    });
    createIsCurrentlyActiveClass();
    addExecutorIcons(executors);
}

function getAllIssues() {
    return Array.from(
        document.querySelectorAll(".js-issue,.ghx-parent-group.ghx-away.js-fake-parent")
    );
}

function showAllIssues() {
    const issues = getAllIssues();
    issues.forEach((i) => (i.style.display = ""));
}

function filterByExecutor(executor) {
    const issues = getAllIssues();

    issues.forEach((i) => {
        const isSelectedExecutorsIssue = i.querySelector(
            `[data-tooltip="${executor.executor}"]`
        );

        if (isSelectedExecutorsIssue) {
            i.style.display = "";
        } else {
            i.style.display = "none";
        }
    });
}

function createIsCurrentlyActiveClass() {
    const style = document.createElement("style");
    style.innerHTML =
        ".executor-filter.is-currently-selected { border: 5px solid limegreen !important; } .executor-filter {border: 5px solid white !important; cursor: pointer}";
    document.getElementsByTagName("head")[0].appendChild(style);
}

function addExecutorIcons(executors) {
    const filtersContainer = document.getElementById("js-work-quickfilters");
    executors.forEach((i) => {
        const dd = document.createElement("dd");
        const img = document.createElement("img");
        img.src = i.avatar;
        img.classList.add("ghx-avatar-img");
        img.classList.add("executor-filter");
        img.title = i.executor.replace(/^Исполнитель: /, "");
        img.onclick = () => {
            const isCurrenylySelected = img.classList.contains("is-currently-selected");
            const executorFilters = getExecutorsFilterButtons();

            executorFilters.forEach((i) => i.classList.remove("is-currently-selected"));

            if (isCurrenylySelected) {
                showAllIssues();
            } else {
                filterByExecutor(i);
                img.classList.add("is-currently-selected");
            }
        };
        dd.appendChild(img);
        filtersContainer.appendChild(dd);
    });
}

function getExecutorsFilterButtons() {
    return Array.from(document.querySelectorAll("img.executor-filter"));
}

main();
