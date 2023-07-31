import React, { useEffect, useRef } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ImageIcon from '@mui/icons-material/Image';
import RateReviewIcon from '@mui/icons-material/RateReview';
import logoWeb from './../assets/logo-web.png';
import { getPathCate, savePathCate } from '../core/db/local';
import { useNavigate } from 'react-router-dom';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

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
        { id: 3, name: "Quản lý bài viết", icon: <RateReviewIcon />, link: "/blog" },
        { id: 4, name: "Quản lý danh mục", icon: <DashboardCustomizeIcon />, link: "/cate" },
        { id: 5, name: "Quản lý sản phẩm    ", icon: <ContentPasteIcon />, link: "/product" },
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

    // xử lí logout
    const handeLogOut = () => {
        localStorage.removeItem('obUser');
        navigate("/login");
    }

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
            <div className='col-drawer'>
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
                <div className='row-ac-dr' onClick={handeLogOut}>
                    <LogoutIcon />
                    <div className='tit-item-dr'>
                        Đăng xuất
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomDrawer;
