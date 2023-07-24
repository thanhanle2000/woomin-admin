import MuiAlert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import imgLogoLogin from '../../assets/logo-login-1.jpg';
import { clearRememberedCredentials, getCredentials, saveCredentials, saveObUser } from "../../core/db/local";
import { firestore } from "../../core/services/controller";

// Custom Alert component for Snackbar
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const LoginPage = () => {
    // data
    const dataAccount = getCredentials();



    // useState
    const [email, setEmail] = useState(dataAccount?.username ?? "");
    const [password, setPassword] = useState(dataAccount?.password ?? "");
    const [stringStatus, setStringStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // useEffect
    useEffect(() => {
        setContentVisible(true);
    }, []);


    // handle change mail
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // handle change password
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // xử lí sự kiện login
    const loginAndFetchUserData = async (email, password) => {
        try {
          const usersCollection = collection(firestore, "users");
          const q = query(
            usersCollection,
            where("email", "==", email),
            where("password", "==", password)
          );
          const querySnapshot = await getDocs(q);
          if (email === "") {
            setStatus(false);
            setStringStatus("Email không hợp lệ");
            setOpen(true);
            return;
          }
          if (password.trim() === "") {
            setStatus(false);
            setStringStatus("Mật khẩu không được để trống");
            setOpen(true);
            return;
          }
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log(userData);
            saveObUser(userData.name);
            setContentVisible(false);
            setLoading(false);
          } else {
            setStatus(false);
            setStringStatus("Email hoặc mật khẩu không chính xác");
            setOpen(true); // Open the Snackbar
            setLoading(false);
          }
        } catch (error) {
          setStatus(false);
          setStringStatus("Lỗi đăng nhập hoặc lấy dữ liệu" + error);
          setOpen(true); // Open the Snackbar
          setLoading(false);
        }
      };

    // handle login
    const handleLogin = () => {
        setLoading(true);
        loginAndFetchUserData(email, password);
        if (rememberMe === true) {
          saveCredentials(email, password);
        } else {
          clearRememberedCredentials();
        }
      };

    // handle close message snackbar
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    // hàm xử lí ẩn/ hiện password
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    // xử lí chuyển cuộc gọi
    const handlePhoneNumberClick = () => {
        window.open(`tel:0962846467`);
    };

    // xử lí việc nhớ mật khẩu
    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    // xử lí sự kiện enter
    const handlePasswordKeyPress = (e) => {
        if (e.key === "Enter") {
          handleLogin();
        }
      };

    return (
        <div className="row-page-login">
            <div className="col-login">
                <div className="wel-solgan">
                    Chào mừng bạn đến với hệ thống <br /> WooMin
                </div>
                <input
                    className="input-login mb-20"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Tài khoản của bạn"
                />
                  <input
                    className="input-login mb-20"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Mật khẩu của bạn"
                    onKeyPress={handlePasswordKeyPress}
                />
                <button className="btn-login mb-10 btn-click" onClick={handleLogin}>
                    {loading ? "Loading..." : "Đăng nhập"}
                </button>
                <div className="check-pass btn-click">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                color="primary"
                            />
                        }
                        label="Nhớ mật khẩu"
                    />
                </div>
                <div className="title-contact-login">
                    Bạn chưa có tài khoản? Vui lòng liên hệ <span className="btn-click" onClick={handlePhoneNumberClick}>Admin</span>
                </div>
            </div>
            <img className="img-logo-login mr-10" src={imgLogoLogin} />
            <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            sx={{
            bottom: 0,
            width: "100%",
            zIndex: 9999,
            position: "fixed",
            }}
      >
        <div>
          <Alert
            severity={status === true ? "success" : "error"}
            onClose={handleClose}
            sx={{ width: "100%", margin: "auto" }}
          >
            {stringStatus}
          </Alert>
        </div>
      </Snackbar>
        </div >
    );
};

export default LoginPage;
