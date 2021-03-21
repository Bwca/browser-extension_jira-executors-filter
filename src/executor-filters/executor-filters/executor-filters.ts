import { Executor } from '../get-executor-list/executor.model';
import { getExecutionersList } from '../get-executor-list/get-executors-list.function';

class ExecutorFilters {
    public createExecutorStyle(): void {
        const style = document.createElement('style');
        style.innerHTML =
            '.executor-filter.is-currently-selected { border: 5px solid limegreen !important; } .executor-filter {border: 5px solid white !important; cursor: pointer}';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    public resetExecutorFilters(): void {
        const currentlySelectedExecutor = document.querySelector(
            '.ghx-avatar-img.executor-filter.is-currently-selected'
        );

        this.clearExecutorFilters();
        const executors = getExecutionersList(this.getExecutionersAvatarElements());

        this.appendExecutorFiltersToPage(executors);

        if (currentlySelectedExecutor) {
            const updatedCurrentExecutorIcon = document.getElementById(
                currentlySelectedExecutor.id
            );
            updatedCurrentExecutorIcon && updatedCurrentExecutorIcon.click();
        }
    }

    private getExecutionersAvatarElements(): HTMLElement[] {
        return Array.from(document.querySelectorAll('.ghx-avatar-img'));
    }

    private showAllIssues(): void {
        this.allIssues.forEach((i) => (i.style.display = ''));
    }

    private showIssuesOnlyForExecutor(executor: Executor): void {
        this.allIssues.forEach((i) => {
            const isSelectedExecutorsIssue = i.querySelector(
                `[data-tooltip="${executor.executor}"]`
            );

            i.style.display = isSelectedExecutorsIssue ? '' : 'none';
        });
    }

    private appendExecutorFiltersToPage(executors: Executor[]): void {
        const filtersContainer = this.filterContainer;
        executors.forEach((i) => {
            const dd = this.createExecutorIcon(i);
            filtersContainer.appendChild(dd);
        });
        this.setExpandFiltersButtonVisible();
    }

    private setExpandFiltersButtonVisible(): void {
        const quickfiltersTrigger = this.quickFiltersTrigger;
        quickfiltersTrigger.style.display = '';
        quickfiltersTrigger.style.position = 'relative';
    }

    private clearExecutorFilters(): void {
        const filtersContainer = this.filterContainer;
        Array.from(filtersContainer.querySelectorAll('dd'))
            .filter((i) => !!i.querySelector('img.executor-filter'))
            .forEach((i) => i.remove());
    }

    private createExecutorIcon(executor: Executor): HTMLElement {
        const dd = document.createElement('dd');
        const img = document.createElement('img');
        img.src = executor.avatar;
        img.id = executor.avatar;
        img.classList.add('ghx-avatar-img');
        img.classList.add('executor-filter');
        img.title = executor.executor.replace(/^Исполнитель: /, '');
        img.onclick = () => {
            const isCurrenylySelected = img.classList.contains('is-currently-selected');

            this.executionerFilterButtons.forEach((i) =>
                i.classList.remove('is-currently-selected')
            );

            if (isCurrenylySelected) {
                executorFilters.showAllIssues();
            } else {
                executorFilters.showIssuesOnlyForExecutor(executor);
                img.classList.add('is-currently-selected');
            }
        };
        dd.appendChild(img);
        return dd;
    }

    private get quickFiltersTrigger(): HTMLElement {
        return document.querySelector('dd.ghx-quickfilter-trigger') as HTMLElement;
    }

    private get filterContainer(): HTMLElement {
        return document.getElementById('js-work-quickfilters') as HTMLElement;
    }

    private get executionerFilterButtons(): HTMLElement[] {
        return Array.from(document.querySelectorAll('img.executor-filter'));
    }

    private get allIssues(): HTMLElement[] {
        return Array.from(
            document.querySelectorAll(
                '.js-issue,.ghx-parent-group.ghx-away.js-fake-parent'
            )
        );
    }
}

export const executorFilters = new ExecutorFilters();
