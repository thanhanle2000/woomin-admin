import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Snackbar } from "@mui/material";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Loading from "../../components/loading";
import { URL_Project } from "../../core/contant/contants";
import { firestore } from "../../core/services/controller";
import PopupActives from "./widget/popup-actives";
import BreadCumHeader from "../../components/breadcum-header";
import ImageTable from "./widget/table-image";
import { getObUser } from "../../core/db/local";

export function ImagePage() {
    // useState
    const [imageUpload, setImageUpload] = useState(null);
    const [lstImage, setLstImage] = useState([]);
    const [isSize, setIsSize] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const [status, setStatus] = useState(false);
    const [stringStatus, setStringStatus] = useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentActive, setCurrentActive] = useState(false);
    const [activeImageId, setActiveImageId] = useState(""); // Lưu trữ id của ảnh được chọn để cập nhật trạng thái

    // obUser
    const obUser = getObUser();

    // get time now
    const dateTimeNow = new Date();

    const formattedDate = `${dateTimeNow.getDate().toString().padStart(2, '0')}-${(dateTimeNow.getMonth() + 1).toString().padStart(2, '0')}-${dateTimeNow.getFullYear()}`;
    const formattedTime = `${dateTimeNow.getHours().toString().padStart(2, '0')} : ${dateTimeNow.getMinutes().toString().padStart(2, '0')}`;

    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    // hàm xử lí lấy ảnh từ local
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setOpen(true);
            setStatus(false);
            setStringStatus("Lỗi: Không tìm thấy file");
            return;
        }
        const maxSize = 1 * 1024 * 1024; // Kích thước tối đa là 1MB
        if (file.size > maxSize) {
            setIsSize(false);
            return;
        }
        setImageUpload(file);
        setIsSize(true);

        // Chuyển ảnh sang base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64Data = reader.result;
            setPreviewUrl(base64Data);
            setImageBase64(base64Data);
        };
    };

    // hàm xử lí upload file to server
    const uploadFile = async () => {
        if (imageUpload === null) return;

        if (isSize) {
            setLoading(true); // Show loading state

            const newId = `${URL_Project}-${Math.random()
                .toString(36)
                .substring(2, 8)}`;
            const imageName = `${URL_Project}-${Math.random()
                .toString(36)
                .substring(2, 8)}`;

            try {
                const imageData = {
                    id: newId,
                    image: imageBase64,
                    active: true,
                    imageName: imageName,
                    userCreate: obUser,
                    timeCreate: formattedDateTime
                };

                const collectionRef = collection(firestore, "banner-mobile");
                await setDoc(doc(collectionRef, newId), imageData);

                setLstImage((prev) => [...prev, imageData]);
                setOpen(true);
                setStatus(true);
                setStringStatus("Ảnh đã được thêm thành công");
            } catch (error) {
                console.log("Lỗi upload ảnh:", error);
                setOpen(true);
                setStatus(false);
                setStringStatus("Lỗi: Không thể upload ảnh");
            } finally {
                setLoading(false); // Hide loading state
            }
        }
    };

    // hàm xử lí việc xóa 1 & nhiều ảnh
    const deleteImage = () => {
        setLoading(true); // Show loading state

        const deletePromises = selectedImages.map((imageId) => deleteDoc(doc(firestore, "banner-mobile", imageId))
        );

        Promise.all(deletePromises)
            .then(() => {
                setLstImage((prev) => prev.filter((item) => !selectedImages.includes(item.id))
                );
                setOpen(true);
                setStatus(true);
                setStringStatus("Ảnh đã được xóa thành công");
            })
            .catch((error) => {
                console.log("Lỗi xóa ảnh:", error);
                setOpen(true);
                setStatus(false);
                setStringStatus("Lỗi: Không thể xóa ảnh");
            })
            .finally(() => {
                setSelectedImages([]); // Reset danh sách ảnh được chọn
                setLoading(false); // Hide loading state
            });
    };

    // hàm xử lí check box
    const handleCheckboxChange = (event) => {
        const imageId = event.target.value;
        setSelectedImages((prev) => {
            if (prev.includes(imageId)) {
                return prev.filter((item) => item !== imageId);
            } else {
                return [...prev, imageId];
            }
        });
    };

    // useEffect
    useEffect(() => {
        setLoading(true); // Show loading state

        const fetchImages = async () => {
            try {
                const collectionRef = collection(firestore, "banner-mobile");
                const querySnapshot = await getDocs(collectionRef);
                const images = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLstImage(images);
            } catch (error) {
                console.log("Error fetching images:", error);
            } finally {
                setLoading(false); // Hide loading state
            }
        };

        fetchImages();
    }, []);

    // handle close message snackbar
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    // xử lí việc actives ảnh
    const handleActiveChange = (event) => {
        setCurrentActive(event.target.checked);
    };

    const openModal = async (imageId) => {
        setActiveImageId(imageId); // Lưu trữ id của ảnh được chọn

        try {
            const collectionRef = collection(firestore, "banner-mobile");
            const imageDocRef = doc(collectionRef, imageId);
            const imageDocSnapshot = await getDoc(imageDocRef);
            if (imageDocSnapshot.exists()) {
                const imageData = imageDocSnapshot.data();
                const active = imageData?.active || false;
                setCurrentActive(active);
            }
        } catch (error) {
            console.log("Lỗi khi lấy giá trị active từ Firestore:", error);
        }

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const updateImageActiveStatus = async () => {
        setLoading(true); // Show loading state

        try {
            const collectionRef = collection(firestore, "banner-mobile");
            const imageDocRef = doc(collectionRef, activeImageId);

            await updateDoc(imageDocRef, { active: currentActive });

            setLstImage((prev) => prev.map((image) => image.id === activeImageId
                ? { ...image, active: currentActive }
                : image
            )
            );

            setOpen(true);
            setStatus(true);
            setStringStatus("Cập nhật trạng thái thành công");
        } catch (error) {
            console.log("Lỗi cập nhật trạng thái:", error);
            setOpen(true);
            setStatus(false);
            setStringStatus("Lỗi: Không thể cập nhật trạng thái");
        } finally {
            setLoading(false); // Hide loading state
            setIsModalOpen(false); // Close the modal
        }
    };

    return (
        <div className="page plr-15">
            <BreadCumHeader title={'QL Hình Ảnh'} />
            <div className="col-ac-img">
                <div className="row-value-img">
                    <div className="input-upload">
                        <input type="file" onChange={handleFileUpload} />
                        {!isSize && (
                            <div className="error-image">Vui lòng chọn ảnh nhỏ hơn 1MB!</div>
                        )}
                    </div>
                    {previewUrl && (
                        <img
                            className="img-upload-view"
                            src={previewUrl}
                            alt="Preview" />
                    )}
                </div>
                <div className="row-btn-img">
                    <div className="btn-upload-image mr-10" onClick={uploadFile}>
                        <div className="icon-camera">
                            <AddAPhotoIcon />
                        </div>
                        <span>Add Image</span>
                    </div>
                    {selectedImages.length > 0 && (
                        <CSSTransition
                            in={selectedImages.length > 0}
                            timeout={500}
                            classNames="btn-delete-image"
                            unmountOnExit
                        >
                            <div className="btn-delete-image mr--10" onClick={deleteImage}>
                                <div className="icon-camera">
                                    <DeleteIcon />
                                </div>
                                <span>Delete Image</span>
                            </div>
                        </CSSTransition>
                    )}
                </div>
            </div>
            <div className="col-list-banner">
                <div className="name-table-image">Image Banner</div>
                {loading ? (
                    <Loading />
                ) : lstImage.length === 0 ? (
                    <div className="title-no-photo">Không có ảnh được tải lên!</div>
                ) : (
                    <ImageTable
                        lstImage={lstImage}
                        selectedImages={selectedImages}
                        handleCheckboxChange={handleCheckboxChange}
                        openModal={openModal}
                    />
                )}
            </div>
            {isModalOpen && (
                <PopupActives
                    currentActive={currentActive}
                    handleActiveChange={handleActiveChange}
                    closeModal={closeModal}
                    updateImageActiveStatus={updateImageActiveStatus} />
            )}
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    severity={status === true ? "success" : "error"}
                    sx={{ width: "100%" }}
                >
                    {stringStatus}
                </Alert>
            </Snackbar>
        </div>
    );
}
