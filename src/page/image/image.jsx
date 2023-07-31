import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { alert_snackbar } from "../../components/alert";
import BreadCumHeader from "../../components/breadcum-header";
import Loading from "../../components/loading";
import PopupActives from "../../components/popup-actives";
import { URL_Project } from "../../core/contant/contants";
import { formattedDateTime } from "../../core/data-process/data-process";
import { getObUser } from "../../core/db/local";
import { firestore } from "../../core/services/controller";
import ImageTable from "./widget/table-image";

export function ImagePage() {
  // useState
  const [imageUpload, setImageUpload] = useState(null);
  const [lstImage, setLstImage] = useState([]);
  const [isSize, setIsSize] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState(false);
  const [activeImageId, setActiveImageId] = useState(""); // Lưu trữ id của ảnh được chọn để cập nhật trạng thái

  // obUser
  const obUser = getObUser();

  // hàm xử lí lấy ảnh từ local
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert_snackbar("Lỗi: Không tìm thấy file", 2);
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
      const imageName = `${URL_Project}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      const newId = `${URL_Project}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      try {
        const imageData = {
          id: newId,
          image: imageBase64,
          active: true,
          imageName: imageName,
          userCreate: obUser,
          timeCreate: formattedDateTime,
          timeUpdate: null,
          userUpdate: null
        };

        const collectionRef = collection(firestore, "banner-mobile");
        await setDoc(doc(collectionRef, newId), imageData);

        setLstImage((prev) => [...prev, imageData]);
        alert_snackbar('Ảnh đã được thêm thành công.', 1);
      } catch (error) {
        alert_snackbar(error, 2);
      } finally {
        setLoading(false); // Hide loading state
      }
    }
  };

  // hàm xử lí việc xóa 1 & nhiều ảnh
  const deleteImage = () => {
    setLoading(true); // Show loading state

    const deletePromises = selectedImages.map((imageId) =>
      deleteDoc(doc(firestore, "banner-mobile", imageId))
    );

    Promise.all(deletePromises)
      .then(() => {
        setLstImage((prev) =>
          prev.filter((item) => !selectedImages.includes(item.id))
        );
        alert_snackbar("Ảnh đã được xóa thành công.", 1);
      })
      .catch((error) => {
        alert_snackbar(error, 2);
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
        alert_snackbar(error, 2);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchImages();
  }, []);

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
      alert_snackbar("Lỗi khi lấy giá trị active từ Firestore:", error, 2);
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

      await updateDoc(imageDocRef, { active: currentActive, timeUpdate: formattedDateTime, userUpdate: obUser });

      setLstImage((prev) =>
        prev.map((image) =>
          image.id === activeImageId
            ? { ...image, active: currentActive }
            : image
        )
      );
      alert_snackbar('Cập nhật trạng thái thành công.', 1);
    } catch (error) {
      alert_snackbar(error, 2);
    } finally {
      setLoading(false); // Hide loading state
      setIsModalOpen(false); // Close the modal
    }
  };

  return (
    <div className="page plr-15">
      <BreadCumHeader title={"QL Hình Ảnh"} />
      <div className="col-ac-img">
        <div className="row-value-img">
          <div className="input-upload">
            <input type="file" onChange={handleFileUpload} />
            {!isSize && (
              <div className="error-image">Vui lòng chọn ảnh nhỏ hơn 1MB!</div>
            )}
          </div>
          {previewUrl && (
            <img className="img-upload-view" src={previewUrl} alt="Preview" />
          )}
        </div>
        <div className="row-btn-img">
          <div className="btn-upload-image mr-10" onClick={uploadFile}>
            <div className="icon-camera">
              <AddAPhotoIcon />
            </div>
            <span>Thêm Ảnh</span>
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
                <span>Xóa Ảnh</span>
              </div>
            </CSSTransition>
          )}
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : <ImageTable
        lstImage={lstImage}
        selectedImages={selectedImages}
        handleCheckboxChange={handleCheckboxChange}
        openModal={openModal}
      />}
      {isModalOpen && (
        <PopupActives
          currentActive={currentActive}
          handleActiveChange={handleActiveChange}
          closeModal={closeModal}
          updateImageActiveStatus={updateImageActiveStatus}
        />
      )}
    </div>
  );
}
