import React from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductWrite = ({ title, setTitle, handleChange, editorHtml, props }) => {
    // setting word
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
        <div className="page plr-15 border-custom-tab">
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
            <div className="cus-quill">
                <ReactQuill
                    onChange={handleChange}
                    value={editorHtml}
                    modules={modules}
                    formats={formats}
                    bounds={".app"}
                />
            </div>
        </div>
    )
}

export default ProductWrite;
