import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from "@mui/material";

const CustomSnackBar = ({ open, stringStatus, status }) => {
    // State để theo dõi trạng thái mở/closed của snack bar
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        // Khi trạng thái mở (open) thay đổi, cập nhật state isOpen
        setIsOpen(open);
    }, [open]);

    // Hàm đóng snack bar
    const handleClose = () => {
        setIsOpen(false);
    };

    // Nếu state isOpen là true, hiển thị snack bar
    if (isOpen) {
        return (
            <Snackbar open={true} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity={status === true ? "success" : "error"} sx={{ width: "100%" }}>
                    {stringStatus}
                </Alert>
            </Snackbar>
        );
    } else {
        // Nếu state isOpen là false, không hiển thị snack bar
        return null;
    }
};

export default CustomSnackBar;
