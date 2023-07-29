import AddIcon from "@mui/icons-material/Add";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import BreadCumHeader from "../../components/breadcum-header";
import { firestore } from "../../core/services/controller";
import Loading from "../../components/loading";
import { TableDataBlog } from "./widget/table-data-blog";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSSTransition } from "react-transition-group";

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
  };

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
      setSelectedItems([]);
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
      <BreadCumHeader title={"QL Bài Viết"} />
      <div className="btn-ac-blog">
        <div className="row-ic-add mr-10" onClick={handleNextPage}>
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
        <TableDataBlog
          documents={documents}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
        />
      )}
    </div>
  );
};

export default BlogPage;
