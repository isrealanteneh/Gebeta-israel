export function getUserInfo() {
    const userInfoSerialized = sessionStorage.getItem('user');
    return userInfoSerialized ? JSON.parse(userInfoSerialized) : null;
}