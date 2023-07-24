// Hàm lưu trữ token vào localStorage
export const saveObUser = (data) => {
    localStorage.setItem('obUser', data);
};

// Hàm truy xuất token từ localStorage
export const getObUser = () => {
    return localStorage.getItem('obUser');
};

// set thông tin tìa khoản
export const saveCredentials = (username, password) => {
    const credentials = { username, password };
    localStorage.setItem("rememberedCredentials", JSON.stringify(credentials));
};

// lấy thông tài khoản
export const getCredentials = () => {
    const credentialsJSON = localStorage.getItem("rememberedCredentials");
    return credentialsJSON ? JSON.parse(credentialsJSON) : null;
};


// xóa thông tin tài khoản
export const clearRememberedCredentials = () => {
    localStorage.removeItem("rememberedCredentials");
};