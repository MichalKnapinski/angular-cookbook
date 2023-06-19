import {RetryBackoffConfig} from "backoff-rxjs";
import {devLog, isHttpError} from "../../shared/utils";

const MAX_RETIRES: number = 20;

// increase x of Math.pow for steeper exponential backoff curve
export const reconnectBackoffConfig: RetryBackoffConfig = {
    initialInterval: 500,
    maxRetries: MAX_RETIRES,
    resetOnSuccess: true,
    backoffDelay: (iteration: number, initialInterval: number) => {
        const delayMillis: number = Math.pow(1.2, iteration) * initialInterval;
        devLog('Websocket connection retry '
        + `try ${iteration + 1}/${MAX_RETIRES} `
        + `current delay: ${Math.ceil(delayMillis)}ms`);
        return delayMillis;
    },
    shouldRetry: error => {
        if (isHttpError(error)) {
            return error.status !== 404;
        }
        return true
    }
}
