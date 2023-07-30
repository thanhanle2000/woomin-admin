import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { URL_Project } from "../../../core/contant/contants";
import { convertFileToBase64, formattedDateTime } from "../../../core/data-process/data-process";
import { getObUser } from "../../../core/db/local";
import { firestore } from "../../../core/services/controller";
import { collection, doc, setDoc } from "firebase/firestore";

const UploadCate = () => {
    // useState
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    // check box
    const handleCheckBoxChange = () => {
        setIsChecked((prevValue) => !prevValue);
    };

    // userOb
    const userOb = getObUser();

    // navigate
    const navigate = useNavigate();

    // lưu trữ cate
    const handleUpLoad = () => {
        // Store HTML content in Firestore
        const saveData = async () => {
            try {
                let logoBase64 = null;
                if (logo) {
                    const logoData = await convertFileToBase64(logo);
                    logoBase64 = logoData;
                }

                const collectionRef = collection(firestore, "category");

                const newId = `${URL_Project}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}`;

                const data = {
                    id: newId, // id 
                    title: title, // title 
                    creationTime: formattedDateTime, // thời gian create
                    userCreate: userOb, // thông tin user create
                    status: isChecked, // trạng thái
                    logo: logoBase64, // logo 
                    userUpdate: null, // user update,
                    timeUpdate: null // thời gian update
                };
                if (logoBase64 !== null && title !== "") {
                    await setDoc(doc(collectionRef, newId), data);
                    navigate("/cate");
                    toast.success('Thêm bài viết thành công.', {
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
            } catch (error) {
                toast.error(error, {
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
        saveData();
    };
    return (
        <div className='page plr-15'>
            <div className="title-blog pbt-10">
                <label>Tên danh mục</label>
                <input
                    className="title-blog-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Dự án bán"
                />
                <div className="checkbox-row">
                    <label className="w-80">
                        <span className="custom-checkbox" />
                        Trạng thái
                    </label>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckBoxChange}
                    />
                </div>
            </div>
            <div className="row-input-blog pbt-10">
                <label>Logo</label>
                <div className="input-blog">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const selectedFile = e.target.files ? e.target.files[0] : null;
                            if (selectedFile && selectedFile.size <= 1024 * 1024) {
                                setLogo(selectedFile);
                            } else {
                                setLogo(null);
                                alert("Vui lòng chọn một ảnh nhỏ hơn hoặc bằng 1MB.");
                            }
                        }}
                    />
                </div>
                <div className="logo-input-wrapper">
                    {logo && (
                        <div className="logo-preview">
                            <img
                                className="w-d-image-logo"
                                src={URL.createObjectURL(logo)}
                                alt="Logo"
                            />
                        </div>
                    )}
                </div>
            </div>
            <button className="btn-save-blog" onClick={handleUpLoad}>
                Lưu danh mục
            </button>
        </div>
    )
}

export default UploadCate
