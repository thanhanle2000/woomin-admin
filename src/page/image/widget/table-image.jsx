import React from "react";

const ImageTable = ({
  lstImage,
  selectedImages,
  handleCheckboxChange,
  openModal,
}) => {
  return (
    <div className="col-list-banner table-container ">
      <div className="name-table-image mb-10">Hình Ảnh Banner</div>
      <table className="image-table">
        <thead>
          <tr>
            <th></th>
            <th>Image</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th>Ngày tạo</th>
            <th>Người sửa</th>
            <th>Ngày sửa</th>
          </tr>
        </thead>
        <tbody>
          {lstImage.map((image) => (
            <tr key={image.id}>
              <td>
                <label className="row-lst-image">
                  <input
                    className="m-l-15 m-r-15"
                    type="checkbox"
                    value={image.id}
                    checked={selectedImages.includes(image.id)}
                    onChange={handleCheckboxChange}
                  />
                </label>
              </td>
              <td>
                <img
                  className="img-upload-view"
                  src={image.image}
                  alt={image.image}
                />
              </td>
              <td
                className={
                  image.status ? "active-image-banner" : "unactive-image-banner"
                }
                onClick={() => openModal(image.id)}
              >
                {image.status ? "Đang hoạt động" : "Ngưng hoạt động"}
              </td>
              <td>{image.userCreate}</td>
              <td>{image.timeCreate}</td>
              <td>{image.userUpdate}</td>
              <td>{image.timeUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImageTable;
