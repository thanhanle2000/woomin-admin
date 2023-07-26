import React from 'react'

const PopupActives = ({ currentActive, handleActiveChange, updateImageActiveStatus, closeModal }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <h2 className="title-popup-actives">Cập nhật trạng thái</h2>
                <div className="action-actives-image">
                    <label>
                        <input
                            type="checkbox"
                            checked={currentActive}
                            onChange={handleActiveChange} />
                        {currentActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                    </label>
                </div>
                <div className="row-btn-update">
                    <button
                        className="btn-update-actives "
                        onClick={updateImageActiveStatus}
                    >
                        Cập nhật
                    </button>
                    <button className="btn-colse-actives" onClick={closeModal}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PopupActives
