import React from "react";

const ImageTable = ({
    lstImage,
    selectedImages,
    handleCheckboxChange,
    openModal
}) => {
    return (
        <table className="image-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Image</th>
                    <th>Trạng thái</th>
                    <th>Người tạo</th>
                    <th>Ngày tạo</th>
                    <th>Code</th>
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
                            className={image.active ? "active-image-banner" : "unactive-image-banner"}
                            onClick={() => openModal(image.id)}
                        >
                            {image.active ? "Đang hoạt động" : "Ngưng hoạt động"}
                        </td>
                        <td>{image.userCreate}</td>
                        <td>{image.timeCreate}</td>
                        <td>{image.imageName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ImageTable;
