import React from 'react';

const ProductForm = ({
    title,
    setTitle,
    isChecked,
    setIsChecked,
    warehouse,
    setWarehouse,
    logo,
    setLogo,
    price,
    setPrice,
    priceDrop,
    setPriceDrop,
    selectedImages,
    handleImageChange,
    data,
    checkValue,
    handleChange,
}) => {
    return (
        <div className="row-select-cate">
            <div className="w-100">
                <div className="title-blog pb-10">
                    <label>Tên sản phẩm</label>
                    <input
                        className="title-blog-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="VD: Dự án mới nhất "
                    />
                    <div className="checkbox-row">
                        <label className="w-80">
                            <span className="custom-checkbox" />
                            Trạng thái
                        </label>
                        <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                    </div>
                    <div className="checkbox-row">
                        <label className="w-80">
                            <span className="custom-checkbox" />
                            Còn hàng
                        </label>
                        <input type="checkbox" checked={warehouse} onChange={(e) => setWarehouse(e.target.checked)} />
                    </div>
                </div>
                <div className="row-input-blog pbt-10">
                    <label>Logo</label>
                    <div className="input-blog">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const selectedFile = e.target.files ? e.target.files[0] : null;
                                if (selectedFile && selectedFile.size <= 1024 * 1024) {
                                    setLogo(selectedFile);
                                } else {
                                    setLogo(null);
                                    alert('Vui lòng chọn một ảnh nhỏ hơn hoặc bằng 1MB.');
                                }
                            }}
                        />
                    </div>
                    <div className="logo-input-wrapper">
                        {logo && (
                            <div className="logo-preview">
                                <img className="w-d-image-logo" src={URL.createObjectURL(logo)} alt="Logo" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="title-blog pbt-10">
                    <label>Giá</label>
                    <input
                        className="title-blog-input w-30"
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <label className="pl-20">Giá giảm</label>
                    <input
                        className="title-blog-input w-30"
                        type="text"
                        value={priceDrop}
                        onChange={(e) => setPriceDrop(e.target.value)}
                    />
                </div>
                <div>
                    <div className="row-input-blog pbt-10">
                        <label>Hình ảnh con</label>
                        <div className="input-blog">
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                        </div>
                    </div>
                    <div className="multi-select-row">
                        {selectedImages.map((imageUrl, index) => (
                            <img key={index} src={imageUrl.img} alt={`Selected${index + 1}`} className="img-multi-select" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="col-item-cate">
                <div className="title-select-cate">Chọn thêm danh mục</div>
                <div className="container-item-cate">
                    {data.map((e) => (e.status === false ? null : (
                        <div key={e.id} className="item-select-cate">
                            <input type="checkbox" id={e.id} checked={checkValue[e.id] || false} onChange={handleChange} />
                            {e.title}
                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
