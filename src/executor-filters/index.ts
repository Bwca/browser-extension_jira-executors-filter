import { executorFilters } from './executor-filters/executor-filters';

export function addExecutorFilters(): void {
    executorFilters.createExecutorStyle();

    const targetNode = document.getElementById('ghx-work') as HTMLElement;

    const config = { attributes: false, childList: true, subtree: true };

    const callback: MutationCallback = (mutationsList) =>
        mutationsList.forEach((mutation) => {
            const hasTasksListUpdated =
                mutation.type === 'childList' && mutation.addedNodes.length;
            if (hasTasksListUpdated) {
                executorFilters.resetExecutorFilters();
            }
        });

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}
