// async verify(id, code) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const res = await this.axios.post(`/v1/user/verify/${id}`, {
//                 code
//             });
//             resolve(res.data);
//         } catch (error) {
//             reject(error);
//         }
//     })
// }

export const validateVCode = (code: string) => (code.length === 6);
export const isName = (name: string) => /^[a-zA-Z-' ]{3,}$/.test(name);
export const isUsername = (username: string) => /^[a-zA-Z][a-zA-Z0-9]{4,14}$/.test(username);
export const isPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
export const isEmail = (email: string) => /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);



