import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { URL_Project } from "../../../core/contant/contants";
import { formattedDateTime, convertFileToBase64 } from "../../../core/data-process/data-process";
import { getObUser } from "../../../core/db/local";
import { firestore } from "../../../core/services/controller";

const UploadBlog = (props) => {
  // useState
  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = () => {
    setIsChecked((prevValue) => !prevValue);
  };
  // thay đổi html
  const handleChange = (html) => {
    setEditorHtml(html);
  };

  // navigate
  const navigate = useNavigate();

  // user
  const userOb = getObUser();

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
          id: newId, // id của bài viết
          title: title, // title của bài viết
          content: editorHtml, // nội dung bài viết
          creationTime: formattedDateTime, // thời gian create bài viết
          userCreate: userOb, // thông tin user create
          status: isChecked, // trạng thái
          logo: logoBase64, // logo bài viết
          userUpdate: null, // user update,
          timeUpdate: null // thời gian update
        };
        if (logoBase64 !== null && title !== "" && editorHtml !== null) {
          await setDoc(doc(collectionRef, newId), data);
          navigate("/blog");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    saveData();
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

      <div className="cus-quill">
        <ReactQuill
          onChange={handleChange}
          value={editorHtml}
          modules={modules}
          formats={formats}
          bounds={".app"}
          placeholder={props.placeholder}
        />
      </div>
      <button className="btn-save-blog" onClick={handleSave}>
        Lưu bài viết
      </button>
    </div>
  );
};

export default UploadBlog;
