import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { URL_Project } from "../../../core/contant/contants";
import { firestore } from "../../../core/services/controller";
import { storage } from "../../../core/services/firebase";
import { getObUser } from "../../../core/db/local";
import { useNavigate } from "react-router-dom";

const UploadBlog = (props) => {
    // useState
    const [editorHtml, setEditorHtml] = useState("");
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState(null);

    // thay đổi html
    const handleChange = (html) => {
        setEditorHtml(html);
    };

    // navigate
    const navigate = useNavigate();

    // user
    const userOb = getObUser();

    // get time now
    const dateTimeNow = new Date();

    const formattedDate = `${dateTimeNow.getDate().toString().padStart(2, '0')}-${(dateTimeNow.getMonth() + 1).toString().padStart(2, '0')}-${dateTimeNow.getFullYear()}`;
    const formattedTime = `${dateTimeNow.getHours().toString().padStart(2, '0')} : ${dateTimeNow.getMinutes().toString().padStart(2, '0')}`;

    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    // lưu trữ db
    const handleSave = () => {
        // Store HTML content in Firestore
        const saveData = async () => {
            try {
                let logoBase64 = null;
                if (logo) {
                    const logoData = await convertFileToBase64(logo);
                    logoBase64 = logoData;
                }

                const collectionRef = collection(firestore, "blogs");
                const newId = `${URL_Project}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}`;

                const data = {
                    id: newId,
                    title: title,
                    content: editorHtml,
                    creationTime: formattedDateTime,
                    userCreate: userOb,
                    status: true,
                    logo: logoBase64,
                };

                await setDoc(doc(collectionRef, newId), data);

                // If there is an image, upload it to Firebase Storage
                if (image) {
                    const imageRef = ref(storage, `images/${newId}`);
                    const uploadTask = uploadBytesResumable(imageRef, image);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = Math.round(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            );
                            setUploadProgress(progress);
                        },
                        (error) => {
                            console.log("Error uploading image:", error);
                        },
                        () => {
                            console.log("Image uploaded successfully!");
                        }
                    );
                }

                // Clear the data after saving
                setEditorHtml("");
                setImage(null);
                setUploadProgress(0);
                setTitle("");
                setLogo(null);
                navigate("/blog");
            } catch (error) {
                console.error("Error saving data:", error);
            }
        };

        saveData();
    };

    // đổi định dạng ảnh sang base 64
    const convertFileToBase64 = (file) => {
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

            {uploadProgress > 0 && <p>Đang tải lên: {uploadProgress}%</p>}
            <ReactQuill
                onChange={handleChange}
                value={editorHtml}
                modules={UploadBlog.modules}
                formats={UploadBlog.formats}
                bounds={".app"}
                placeholder={props.placeholder}
            />
            {image && (
                <div>
                    <p>Hình ảnh đã chọn:</p>
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        style={{ maxWidth: "200px" }}
                    />
                </div>
            )}
            <button className="btn-save-blog" onClick={handleSave}>
                Lưu bài viết
            </button>
        </div>
    );
};

UploadBlog.modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
    ],
    clipboard: {
        matchVisual: false,
    },
};

UploadBlog.formats = [
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

export default UploadBlog;
