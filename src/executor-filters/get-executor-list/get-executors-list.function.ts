import { Executor } from './executor.model';

export function getExecutionersList(avatars: HTMLElement[]): Executor[] {

    if (!avatars.length) {
        return [];
    }

    const executorNames = new Set<string>(
        avatars.map((i) => i.dataset.tooltip as string)
    );

    const executors: Executor[] = Array.from(executorNames).map((name) => {
        const el = avatars.find((i) => i.dataset.tooltip === name) as HTMLImageElement;
        return {
            executor: name,
            avatar: el.src,
        };
    });

    return executors;
}
