import React, { useEffect, useRef } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ImageIcon from '@mui/icons-material/Image';
import RateReviewIcon from '@mui/icons-material/RateReview';
import logoWeb from './../assets/logo-web.png';
import { getPathCate, savePathCate } from '../core/db/local';
import { useNavigate } from 'react-router-dom';

const CustomDrawer = ({ id, visible, onClose }) => {
    // useRef
    const containerRef = useRef(null);

    // useEffect
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.focus();
                }
            }, 350);
        }
    }, [visible]);

    // hủy sự kiện ẩn drawer
    const handleInsideClick = (event) => {
        event.stopPropagation();
    };


    // data
    const data = [
        { id: 1, name: "Thống kê", icon: <AssessmentIcon />, link: "/" },
        { id: 2, name: "Quản lý hình ảnh", icon: <ImageIcon />, link: "/image" },
        { id: 3, name: "Quản lý bài viết", icon: <RateReviewIcon />, link: "" },
    ]

    // navigate
    const navigate = useNavigate();

    // chuyển trang
    const handleNextPage = (link) => {
        onClose();
        savePathCate(link);
        navigate(link);
    }

    // get path
    const getPath = getPathCate();

    return (
        <div
            ref={containerRef}
            id={id}
            role="navigation"
            className="Drawer"
            aria-hidden={!visible}
            tabIndex="0"
            onClick={handleInsideClick}
        >
            <div className={visible ? 'ic-close-dr' : 'dp-none'} onClick={onClose}>
                <ArrowBackIosIcon />
            </div>
            <div className='p-drawer'>
                <img className='img-logo' src={logoWeb} alt='logo' />
                <div className='col-item-dr'>
                    {
                        data.map((e) =>
                            <div key={e.id} className={getPath === e.link ? 'row-ac-dr-actives' : 'row-ac-dr'} onClick={() => handleNextPage(e.link)}>
                                {e.icon}
                                <div className='tit-item-dr'>
                                    {e.name}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomDrawer;
