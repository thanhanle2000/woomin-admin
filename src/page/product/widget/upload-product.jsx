import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alert_snackbar } from "../../../components/alert";
import { URL_Project } from "../../../core/contant/contants";
import { convertFileToBase64, formattedDateTime } from "../../../core/data-process/data-process";
import { getObUser } from "../../../core/db/local";
import { firestore } from "../../../core/services/controller";

const UploadProduct = () => {
    // useState
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [checkValue, setCheckValue] = useState(false);
    const [warehouse, setWarehouse] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceDrop, setPriceDrop] = useState(0);

    // route
    const { state } = useLocation();
    const { data } = state || {};

    // check box
    const handleCheckBoxChange = () => {
        setIsChecked((prevValue) => !prevValue);
    };

    // check warsehoue
    const handleCheckWareHouse = () => {
        setWarehouse((prev) => !prev);
    }

    // userOb
    const userOb = getObUser();

    // navigate
    const navigate = useNavigate();

    // handleInput
    const handleChange = (event) => {
        const itemId = event.target.id;
        setCheckValue(prevState => ({
            ...prevState,
            [itemId]: event.target.checked,
        }));
    };

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

                const collectionRef = collection(firestore, "product");

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
                    alert_snackbar('Thêm mới sản phẩm thành công.', 1);
                }
            } catch (error) {
                alert_snackbar(error, 2);
            }
        };
        saveData();
    };
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (event) => {
        const files = event.target.files;
        const imageList = [];

        // Loop through selected files and check their sizes
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const maxSize = 1024 * 1024; // 1MB

            if (file.size <= maxSize) {
                const imageUrl = URL.createObjectURL(file);
                imageList.push(imageUrl);
            } else {
                alert_snackbar("Vui lòng chọn hình ảnh có kích thước nhỏ hơn 1MB.", 2);
            }
        }

        // Update the state with the list of valid image URLs
        setSelectedImages(imageList);
    };
    return (
        <div className='page plr-15'>
            <div className="row-select-cate">
                <div className="w-100">
                    <div className="title-blog pbt-10">
                        <label>Tên sản phẩm</label>
                        <input
                            className="title-blog-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Dự án mới nhất "
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
                        <div className="checkbox-row">
                            <label className="w-80">
                                <span className="custom-checkbox" />
                                Còn hàng
                            </label>
                            <input
                                type="checkbox"
                                checked={warehouse}
                                onChange={handleCheckWareHouse}
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
                                        alert_snackbar("Vui lòng chọn một ảnh nhỏ hơn hoặc bằng 1MB.", 2);
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
                    <div className="title-blog pbt-10">
                        <label>Giá</label>
                        <input
                            className="title-blog-input w-30"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <label className="pl-20">Giá giảm</label>
                        <input
                            className="title-blog-input w-30"
                            type="text"
                            value={priceDrop}
                            onChange={(e) => setPriceDrop(e.target.value)}
                        />
                    </div>
                    <div >
                        <div className="row-input-blog pbt-10">
                            <label>Hình ảnh con</label>
                            <div className="input-blog">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />

                            </div>
                        </div>
                        <div className="multi-select-row" >
                            {selectedImages.map((imageUrl, index) => (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt={`Image ${index}`}
                                    className="img-multi-select"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-item-cate">
                    <div className="title-select-cate">Chọn thêm danh mục</div>
                    <div className="container-item-cate">
                        {data.map((e) => (
                            e.status === false ? null : <div key={e.id} className="item-select-cate">
                                <input
                                    type="checkbox"
                                    id={e.id}
                                    checked={checkValue[e.id] || false}
                                    onChange={handleChange}
                                />
                                {e.title}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button className="btn-save-blog" onClick={handleUpLoad}>
                Lưu danh mục
            </button>
        </div>
    )
}

export default UploadProduct;
