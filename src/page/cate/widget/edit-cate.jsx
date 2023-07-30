import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertFileToBase64, formattedDateTime } from "../../../core/data-process/data-process";
import { getObUser } from "../../../core/db/local";
import { firestore } from "../../../core/services/controller";
import { toast } from 'react-toastify';

const EditCatePage = () => {
    // useState
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    // navigate
    const { state } = useLocation();
    const { id } = state || {};
    const navigate = useNavigate();

    // user
    const userUpdate = getObUser();

    // useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const documentRef = doc(firestore, "category", id);
                const documentSnapshot = await getDoc(documentRef);
                if (documentSnapshot.exists()) {
                    const documentData = documentSnapshot.data();
                    setTitle(documentData.title);
                    setIsChecked(documentData.status);
                    if (documentData.logo) {
                        setLogoPreview(documentData.logo);
                    }
                } else {
                    toast.error("Không đọc được dữ liệu.", {
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

        fetchData();
    }, [id]);

    const handleLogoChange = (img) => {
        if (img) {
            setLogo(img);
            setLogoPreview(URL.createObjectURL(img));
        }
    };

    const handleUpdate = async () => {
        try {
            let logoBase64 = null;
            if (logo) {
                const logoData = await convertFileToBase64(logo);
                logoBase64 = logoData;
            }
            const documentRef = doc(firestore, "category", id);
            await updateDoc(documentRef, {
                title: title,
                logo: logoBase64 !== null ? logoBase64 : logoPreview,
                userUpdate: userUpdate,
                timeUpdate: formattedDateTime,
                status: isChecked
            });
            navigate("/cate");
            toast.success('Update danh mục thành công.', {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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

    // handle check box
    const handleCheckBoxChange = () => {
        setIsChecked((prevValue) => !prevValue);
    };

    return (
        <div className="page plr-15">
            <div className="title-blog pbt-10">
                <label>Tiêu đề bài viết</label>
                <input
                    className="title-blog-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Tin tức mới"
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
                                handleLogoChange(selectedFile);
                            } else {
                                setLogo(null);
                                alert("Vui lòng chọn một ảnh nhỏ hơn hoặc bằng 1MB.");
                            }
                        }}
                    />
                </div>
                <div className="logo-input-wrapper">
                    {logoPreview && (
                        <div className="logo-preview">
                            <img
                                className="w-d-image-logo"
                                src={logoPreview}
                                alt="Logo"
                            />
                        </div>
                    )}
                </div>
            </div>
            <button className="btn-save-blog" onClick={handleUpdate}>
                Cập nhật
            </button>
        </div>
    )
}

export default EditCatePage
