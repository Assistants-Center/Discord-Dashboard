import {
    OptionSetResponse,
    AccessControlResponse_Ok,
    AccessControlResponse_Disallowed,
} from '@discord-dashboard/typings/dist/Core/Options';

const SetResponses = {
    Ok: (): OptionSetResponse => {
        return {
            error: false,
        };
    },
    Error: (message?: string): OptionSetResponse => {
        return {
            error: true,
            message,
        };
    },
};

const AccessControlResponses = {
    Ok: (): AccessControlResponse_Ok => {
        return {
            allowed: true,
        };
    },
    Disallowed: (
        display_in_api: boolean,
        message?: string,
    ): AccessControlResponse_Disallowed => {
        return {
            allowed: false,
            display_in_api,
            error: {
                message,
            },
        };
    },
};

export default { SetResponses, AccessControlResponses };
