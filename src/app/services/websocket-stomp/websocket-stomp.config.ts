import {RxStompConfig} from "@stomp/rx-stomp";
import {devLog} from "../../shared/utils";

export const websocketStompConfig: RxStompConfig = {
    brokerURL: '',

    // Milliseconds. 0 - disabled
    heartbeatIncoming: 0,
    heartbeatOutgoing: 2000,
    reconnectDelay: 500,

    debug: (msg: string): void => {
        devLog(new Date(), msg);
    }
}
