function isEmail(email: any) {
    if (typeof email !== 'string') {
        return false;
    }
    return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
}

function isPhone(number: any) {
    if (typeof number !== 'string') {
        return false;
    }
    return /^(?:09|07)\d{8}|(?:\+2519|\+2517)\d{8}$/.test(number);
}

function isName(name: any) {
    if (typeof name !== 'string') {
        return false;
    }
    return /^[a-zA-Z-' ]{3,}$/.test(name);
}

function isUsername(username: any) {
    if (typeof username !== 'string') {
        return false;
    }
    return /^[a-zA-Z][a-zA-Z0-9]{4,14}$/.test(username);
}

function isPassword(password: any) {
    if (typeof password !== 'string') {
        return false;
    }
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

export { isEmail, isPhone, isName, isUsername, isPassword };