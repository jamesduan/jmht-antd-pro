export function setToken(token) {
    localStorage.setItem("token", token)
}

export function getToken() {
    return localStorage.getItem("token")
}

export function setUser(name) {
    localStorage.setItem("user", name)
}

export function getUser() {
    return localStorage.getItem("user")
}