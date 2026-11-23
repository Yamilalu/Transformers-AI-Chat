export function isValidMessage(message) {
    return typeof message === "string" && message.trim().length > 0;
}

export function cleanMessage(message) {
    return message.trim();
}

export function isValidResponse(response) {
    return typeof response === "string" && response.trim().length > 0;
}