module.exports = class command {

    parse (message) {
        if (this.match(message)) {
            this.action(message)
            return true
        }
        return false
    }

    match (message) {
        return false
    }

    action (message) {
    }
}