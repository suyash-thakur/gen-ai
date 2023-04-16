const messages = [];

const get = (trigger, role) => {
    return messages.filter(message => (message.trigger === trigger && message.role === role));
}

const add = (message, trigger) => {
    message.trigger = trigger; ha

    messages.push(message);
}
