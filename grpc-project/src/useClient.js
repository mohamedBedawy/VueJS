import { inject } from 'vue';

export function useClient() {
    const client = inject('client');
    if (!client) {
        throw new Error('Client not provided');
    }
    return client;
}