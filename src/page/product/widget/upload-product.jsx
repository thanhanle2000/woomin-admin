import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alert_snackbar } from "../../../components/alert";
import { URL_Project } from "../../../core/contant/contants";
import { convertFileToBase64, formattedDateTime } from "../../../core/data-process/data-process";
import { getObUser } from "../../../core/db/local";
import { firestore } from "../../../core/services/controller";
import ProductForm from "./product-form";
import ProductWrite from "./product-write";

const UploadProduct = () => {
    // useState
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [checkValue, setCheckValue] = useState(false);
    const [warehouse, setWarehouse] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceDrop, setPriceDrop] = useState(0);
    const [tab, setTab] = useState(1);
    const [editorHtml, setEditorHtml] = useState("");
    const [titleWrite, setTitleWrite] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    // thay đổi html
    const handleChangeWrite = (html) => {
        setEditorHtml(html);
    };

    // route
    const { state } = useLocation();
    const { data } = state || {};

    // userOb
    const userOb = getObUser();

    // navigate
    const navigate = useNavigate();

    // handleInput
    const handleChange = (event) => {
        const itemId = event.target.id;
        const isChecked = event.target.checked;
        setCheckValue((prevCheckValue) => ({
            ...prevCheckValue,
            [itemId]: isChecked,
        }));
    };

    // Use useEffect to update selectedIds when checkValue changes
    useEffect(() => {
        const newSelectedIds = Object.keys(checkValue)
            .filter((id) => checkValue[id])
            .map(Number);
        setSelectedIds(newSelectedIds);
    }, [checkValue]);


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

                console.log(
                    "title:" + title,
                    "logo:" + logo,
                    "ảnh con:" + selectedImages,
                    "trạng thái:" + isChecked,
                    "danh mục:" + selectedIds,
                    "check kho:" + warehouse,
                    "giá:" + price,
                    "giá giảm:" + priceDrop,
                    "tiêu đề bài:" + titleWrite,
                    "html:" + editorHtml);

                const data = {
                    id: newId, // id 
                    title: title, // title 
                    creationTime: formattedDateTime, // thời gian create
                    userCreate: userOb, // thông tin user create
                    status: isChecked, // trạng thái
                    logo: logoBase64, // logo 
                    userUpdate: null, // user update,
                    timeUpdate: null, // thời gian update
                    selectedImages: selectedImages, // lst ảnh con
                    selectedIds: selectedIds, // danh mục
                    warehouse: warehouse, // kiểm tra tồn kho
                    price: price, // giá gốc
                    priceDrop: priceDrop, // giá giảm
                    titleWrite: titleWrite, // tiêu đề nội dung
                    editorHtml: editorHtml, // nội dung sản phẩm
                };
                if (logoBase64 !== null && title !== "") {
                    console.log("success");
                    await setDoc(doc(collectionRef, newId), data);
                    navigate("/product");
                    alert_snackbar('Thêm mới sản phẩm thành công.', 1);
                } else {
                    if (logoBase64 === null && title === "") {
                        alert_snackbar("Vui lòng chọn logo và tiêu đề.", 2);
                    }
                    else if (logoBase64 === null) {
                        alert_snackbar("Vui lòng chọn logo.", 2);
                    } else if (title === "") {
                        alert_snackbar("Tiêu đề không được trống.", 2);
                    }
                }
            } catch (error) {
                alert_snackbar(error, 2);
            }
        };
        saveData();
    };

    const generateRandomId = () => {
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const idLength = 3; // Adjust the length of the random ID as needed
        let randomId = 'UPLAND';
        for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * randomChars.length);
            randomId += '-' + randomChars.charAt(randomIndex);
        }
        return randomId;
    };


    const handleImageChange = async (event) => {
        const files = event.target.files;
        const imageList = [];

        // Loop through selected files and check their sizes
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const maxSize = 1024 * 1024; // 1MB

            if (file.size <= maxSize) {
                const randomId = generateRandomId();

                // Convert file to base64
                try {
                    const base64Data = await convertFileToBase64(file);
                    imageList.push({ id: randomId, img: base64Data });
                } catch (error) {
                    alert_snackbar("Có lỗi xảy ra khi chuyển đổi ảnh sang base64.", 2);
                }
            } else {
                alert_snackbar("Vui lòng chọn hình ảnh có kích thước nhỏ hơn 1MB.", 2);
            }
        }

        // Update the state with the list of valid image objects (with random IDs and image URLs)
        setSelectedImages(imageList);
    };


    // tab
    const handleTabbar = (id) => {
        setTab(id);
    }

    // data tab
    const lstTab = [
        { id: 1, title: "Thông tin" },
        { id: 2, title: "Nội dung" },
    ]
    return (
        <div className='page plr-15'>
            <div className="row-tab-product">
                {
                    lstTab.map((e) =>
                        <div className={tab === e.id ? "item-tab-active" : "item-tab"} onClick={() => handleTabbar(e.id)} key={e.id}>{e.title}</div>
                    )
                }
            </div>
            {
                tab === 1 ?
                    <ProductForm
                        title={title}
                        setTitle={setTitle}
                        isChecked={isChecked}
                        setIsChecked={setIsChecked}
                        warehouse={warehouse}
                        setWarehouse={setWarehouse}
                        logo={logo}
                        setLogo={setLogo}
                        price={price}
                        setPrice={setPrice}
                        priceDrop={priceDrop}
                        setPriceDrop={setPriceDrop}
                        selectedImages={selectedImages}
                        handleImageChange={handleImageChange}
                        data={data}
                        checkValue={checkValue}
                        handleChange={handleChange}
                    /> : <ProductWrite title={titleWrite} setTitle={setTitleWrite} handleChange={handleChangeWrite} editorHtml={editorHtml} />
            }
            <button className="btn-save-blog"
                onClick={handleUpLoad}>
                Lưu sản phẩm
            </button>
        </div>
    )
}

export default UploadProduct;
