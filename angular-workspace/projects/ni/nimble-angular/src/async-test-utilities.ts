export async function waitTask(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}

export async function waitMicrotask(): Promise<void> {
    return new Promise(queueMicrotask);
}