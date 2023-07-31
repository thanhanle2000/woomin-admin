import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from '@mui/icons-material/Edit';
// import { CSSTransition } from "react-transition-group";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alert_snackbar } from "../../components/alert";
import BreadCumHeader from '../../components/breadcum-header';
import { firestore } from "../../core/services/controller";


const ProductPage = () => {
    // useState
    const [data, setData] = useState([]);
    // const [selectedItems, setSelectedItems] = useState([]);
    // const [loading, setLoading] = useState(false);

    // useEffect
    useEffect(() => {
        fetchData();
    }, []);

    // lấy dữ liệu
    const fetchData = async () => {
        // setLoading(true); // Show loading state
        try {
            const collectionRef = collection(firestore, "category");
            const querySnapshot = await getDocs(collectionRef);
            const dataJs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(dataJs);
            // setLoading(false);
        } catch (error) {
            alert_snackbar(error, 2);
        }
    };
    // navigate
    const navigate = useNavigate();

    // handleNextPage
    const handleNextPage = () => {
        navigate("/upload-product", { state: { data } });
    }

    return (
        <div className="page plr-15">
            <BreadCumHeader title={"QL Sản Phẩm"} />
            <div className="btn-ac-blog">
                <div className="row-ic-add mr-10"
                    onClick={handleNextPage}
                >
                    <AddIcon />
                    <button>Tạo mới</button>
                </div>
                {/* {selectedItems.length > 0 && (
                    <CSSTransition
                        in={selectedItems.length > 0}
                        timeout={500}
                        classNames="btn-delete-image"
                        unmountOnExit
                    >
                        <div
                            className="row-ic-edit mr-10"
                        // onClick={() => selectedItems.forEach((id) => handleEdit(id))}
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
                        // onClick={() => selectedItems.forEach((id) => handleDelete(id))}
                        >
                            <DeleteIcon />
                            <button>Xóa</button>
                        </div>
                    </CSSTransition>
                )} */}
            </div>
        </div>
    )
}

export default ProductPage
