import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CSSTransition } from "react-transition-group";
import BreadCumHeader from '../../components/breadcum-header';
import Loading from "../../components/loading";
import { firestore } from "../../core/services/controller";
import TableDataCate from './widget/table-data-cate';

const CatePage = () => {
    // useState
    const [data, setData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // navigate
    const navigate = useNavigate();

    // handleNextPage
    const handleNextPage = () => {
        navigate("/upload-cate");
    }

    // useEffect
    useEffect(() => {
        fetchData();
    }, []);

    // lấy dữ liệu
    const fetchData = async () => {
        setLoading(true); // Show loading state
        try {
            const collectionRef = collection(firestore, "category");
            const querySnapshot = await getDocs(collectionRef);
            const dataJs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(dataJs);
            setLoading(false);
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

    // select id
    const handleSelectItem = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((item) => item !== id)
                : [...prevSelectedItems, id]
        );
    };

    const handleDelete = async (id) => {
        try {
            const documentRef = doc(firestore, "category", id);
            await deleteDoc(documentRef);
            toast.success('Xóa danh mục thành công.', {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            fetchData();
            setSelectedItems([]);
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

    // handle edit cate
    const handleEdit = (id) => {
        navigate(`/edit-cate`, { state: { id } });
    };

    return (
        <div className="page plr-15">
            <BreadCumHeader title={"QL Danh Mục"} />
            <div className="btn-ac-blog">
                <div className="row-ic-add mr-10"
                    onClick={handleNextPage}
                >
                    <AddIcon />
                    <button>Tạo mới</button>
                </div>
                {selectedItems.length > 0 && (
                    <CSSTransition
                        in={selectedItems.length > 0}
                        timeout={500}
                        classNames="btn-delete-image"
                        unmountOnExit
                    >
                        <div
                            className="row-ic-edit mr-10"
                            onClick={() => selectedItems.forEach((id) => handleEdit(id))}
                        >
                            <EditIcon />
                            <button>Chỉnh Sửa</button>
                        </div>
                    </CSSTransition>
                )}
                {selectedItems.length > 0 && (
                    <CSSTransition
                        in={selectedItems.length > 0}
                        timeout={500}
                        classNames="btn-delete-image"
                        unmountOnExit
                    >
                        <div
                            className="row-ic-delete"
                            onClick={() => selectedItems.forEach((id) => handleDelete(id))}
                        >
                            <DeleteIcon />
                            <button>Xóa</button>
                        </div>
                    </CSSTransition>
                )}
            </div>
            {loading ? (
                <Loading />
            ) : (
                <TableDataCate
                    documents={data}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                />
            )}
        </div>
    )
}

export default CatePage
