// Trong file chứa hàm alert_snackbar
import { toast } from 'react-toastify';

export const alert_snackbar = (string, type) => {
    if (type === 1) {
        toast.success(string, {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    } else if (type === 2) {
        toast.error(string, {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
};
