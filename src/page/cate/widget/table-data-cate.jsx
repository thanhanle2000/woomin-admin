import React from 'react'

const TableDataCate = ({
    documents,
    selectedItems,
    handleSelectItem,
}) => {
    return (
        <div className="col-list-banner table-container ">
            <div className="name-table-image mb-10">Danh mục sản phẩm</div>
            <table className="image-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Tên danh mục</th>
                        <th>Trạng thái</th>
                        <th>Người tạo</th>
                        <th>Thời gian tạo</th>
                        <th>Người sửa</th>
                        <th>Thời gian sửa</th>
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
                            <td>{document.title}</td>
                            <td className={
                                document.status ? "active-image-banner" : "unactive-image-banner"
                            }>
                                {document.status === true
                                    ? "Đang hoạt động"
                                    : "Ngưng hoạt động"}
                            </td>
                            <td>{document.userCreate}</td>
                            <td>{document.creationTime}</td>
                            <td>{document.userUpdate}</td>
                            <td>{document.timeUpdate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableDataCate
