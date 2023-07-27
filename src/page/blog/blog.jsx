import AddIcon from '@mui/icons-material/Add';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import BreadCumHeader from "../../components/breadcum-header";
import { firestore } from "../../core/services/controller";
import Loading from '../../components/loading';

const BlogPage = () => {
    // useState
    const [documents, setDocuments] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // navigate
    const navigate = useNavigate();

    // handle Next Page
    const handleNextPage = () => {
        navigate("/upload-blog");
    }

    // useEffect
    useEffect(() => {
        fetchData();
    }, []);

    // lấy dữ liệu
    const fetchData = async () => {
        setLoading(true); // Show loading state
        try {
            const collectionRef = collection(firestore, "blogs");
            const querySnapshot = await getDocs(collectionRef);
            const documentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocuments(documentsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const documentRef = doc(firestore, "blogs", id);
            await deleteDoc(documentRef);
            console.log("Document deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((item) => item !== id)
                : [...prevSelectedItems, id]
        );
    };

    return (
        <div className="page plr-15">
            <BreadCumHeader title={'QL Bài Viết'} />
            <div className="row-ic-add" onClick={handleNextPage}>
                <AddIcon />
                <button>Tạo mới</button>
            </div>
            {loading ? <Loading /> : <div>
                <h2>Danh sách bài viết</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Chọn</th>
                            <th>Hình ảnh</th>
                            <th>Tên bài viết</th>
                            <th>Trạng thái</th>
                            <th>Thời gian tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((document) => (
                            <tr key={document.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(document.id)}
                                        onChange={() => handleSelectItem(document.id)}
                                    />
                                </td>
                                <td>
                                    {document.logo ? (
                                        <img src={document.logo} alt="Logo" style={{ maxWidth: "50px" }} />
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td>{document.title}</td>
                                <td>{document.status === true ? "Đang hoạt động" : "Ngưng hoạt động"}</td>
                                <td>{document.creationTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={() => {
                        selectedItems.forEach((id) => handleDelete(id));
                        setSelectedItems([]);
                    }}
                >
                    Xóa các mục đã chọn
                </button>
            </div>}
        </div>
    );
};

export default BlogPage;
