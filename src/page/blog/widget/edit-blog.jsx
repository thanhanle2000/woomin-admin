import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import { convertFileToBase64, formattedDateTime } from "../../../core/data-process/data-process";
import { getObUser } from "../../../core/db/local";
import { firestore } from "../../../core/services/controller";

const EditBlogPage = () => {
    // useState
    const [editorHtml, setEditorHtml] = useState("");
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckBoxChange = () => {
        setIsChecked((prevValue) => !prevValue);
    };

    // navigate
    const { state } = useLocation();
    const { id } = state || {};
    const navigate = useNavigate();

    // use
    const userUpdate = getObUser();

    // useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const documentRef = doc(firestore, "blogs", id);
                const documentSnapshot = await getDoc(documentRef);
                if (documentSnapshot.exists()) {
                    const documentData = documentSnapshot.data();
                    setTitle(documentData.title);
                    setEditorHtml(documentData.content);
                    setIsChecked(documentData.status);
                    if (documentData.logo) {
                        setLogoPreview(documentData.logo);
                    }
                } else {
                    console.log("Document does not exist");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
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
            const documentRef = doc(firestore, "blogs", id);
            await updateDoc(documentRef, {
                title: title,
                content: editorHtml,
                logo: logoBase64 !== null ? logoBase64 : logoPreview,
                userUpdate: userUpdate,
                timeUpdate: formattedDateTime,
                status: isChecked
            });
            navigate("/blog");
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };


    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            [{ align: [] }], // Thêm nút căn giữa trái, căn giữa phải, căn giữa
            ["clean"],
        ],
        clipboard: {
            matchVisual: false,
        },
    };


    const formats = [
        "header",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

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
            <div className="cus-quill">
                <ReactQuill
                    value={editorHtml}
                    onChange={setEditorHtml}
                    modules={modules}
                    formats={formats}
                    placeholder="Nhập nội dung"
                />
            </div>
            <button className="btn-save-blog" onClick={handleUpdate}>
                Cập nhật
            </button>
        </div>
    );
};

export default EditBlogPage;
