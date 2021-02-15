function getExecutionersListFromAvatarsInIssues() {
    const avatars = Array.from(document.querySelectorAll(".ghx-avatar-img"));

    if (!avatars || !avatars.length) {
        return;
    }

    const executorNames = new Set(avatars.map((i) => i.dataset.tooltip));

    const executors = Array.from(executorNames).map((name) => {
        const el = avatars.find((i) => i.dataset.tooltip === name);
        return {
            executor: name,
            avatar: el.src,
        };
    });
    appendExecutorButtonsToFilterContainer(executors);
}

function getAllIssueElements() {
    return Array.from(
        document.querySelectorAll(".js-issue,.ghx-parent-group.ghx-away.js-fake-parent")
    );
}

function setAllIssuesVisible() {
    const issues = getAllIssueElements();
    issues.forEach((i) => (i.style.display = ""));
}

function setIssuesVisibleByExecutor(executor) {
    const issues = getAllIssueElements();

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

function createIsCurrentlyActiveExecutorClassStyle() {
    const style = document.createElement("style");
    style.innerHTML =
        ".executor-filter.is-currently-selected { border: 5px solid limegreen !important; } .executor-filter {border: 5px solid white !important; cursor: pointer}";
    document.getElementsByTagName("head")[0].appendChild(style);
}

function appendExecutorButtonsToFilterContainer(executors) {
    const filtersContainer = document.getElementById("js-work-quickfilters");
    executors.forEach((i) => {
        const dd = document.createElement("dd");
        const img = document.createElement("img");
        img.src = i.avatar;
        img.id = i.avatar;
        img.classList.add("ghx-avatar-img");
        img.classList.add("executor-filter");
        img.title = i.executor.replace(/^Исполнитель: /, "");
        img.onclick = () => {
            const isCurrenylySelected = img.classList.contains("is-currently-selected");
            const executorFilters = getExecutionersFilterButtonsAsArray();

            executorFilters.forEach((i) => i.classList.remove("is-currently-selected"));

            if (isCurrenylySelected) {
                setAllIssuesVisible();
            } else {
                setIssuesVisibleByExecutor(i);
                img.classList.add("is-currently-selected");
            }
        };
        dd.appendChild(img);
        filtersContainer.appendChild(dd);
    });
}

function getExecutionersFilterButtonsAsArray() {
    return Array.from(document.querySelectorAll("img.executor-filter"));
}

function removeExecutionersFilterButtonsFromFiltersContainer() {
    const filtersContainer = document.getElementById("js-work-quickfilters");
    Array.from(filtersContainer.querySelectorAll("dd"))
        .filter((i) => !!i.querySelector("img.executor-filter"))
        .forEach((i) => i.remove());
}

function updateExecutorFilterButtonsList() {
    const currentlySelectedExecutor = document.querySelector(
        ".ghx-avatar-img.executor-filter.is-currently-selected"
    );
    removeExecutionersFilterButtonsFromFiltersContainer();
    getExecutionersListFromAvatarsInIssues();
    if (currentlySelectedExecutor) {
        const updatedCurrentExecutorIcon = document.getElementById(
            currentlySelectedExecutor.id
        );
        updatedCurrentExecutorIcon && updatedCurrentExecutorIcon.click();
    }
}

(function main() {
    createIsCurrentlyActiveExecutorClassStyle();

    const targetNode = document.getElementById("ghx-work");

    const config = { attributes: false, childList: true, subtree: true };

    const callback = (mutationsList) =>
        mutationsList.forEach((mutation) => {
            const hasTasksListUpdated =
                mutation.type === "childList" && mutation.addedNodes.length;
            if (hasTasksListUpdated) {
                updateExecutorFilterButtonsList();
            }
        });

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
})();
