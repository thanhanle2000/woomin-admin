// đổi định dạng ảnh sang base 64
export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                resolve(null);
            }
        };
        reader.onerror = () => {
            resolve(null);
        };
        reader.readAsDataURL(file);
    });
};

// xử lí thời gian tạo và update
const forCreatTime = () => {
    const dateTimeNow = new Date(new Date().toISOString());
    const formattedDate = `${dateTimeNow
        .getDate()
        .toString()
        .padStart(2, "0")}-${(dateTimeNow.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${dateTimeNow.getFullYear()}`;
    return formattedDate;
};
export const formattedDateTime = forCreatTime();
