import React from 'react'
import icon_home from '../assets/icon-house.png';
import { useNavigate } from 'react-router-dom';
import { savePathCate } from '../core/db/local';

const BreadCumHeader = ({ title }) => {
    // navigate
    const navigate = useNavigate();

    // handle next page
    const handleNextPage = () => {
        savePathCate("/");
        navigate("/");
    }
    return (
        <div className='col-bread'>
            <div className='title-head'>
                {title}
            </div>
            <div className='row-bread'>
                <div className='row-bread'>
                    <img className='ic-home' src={icon_home} alt='icon-home' />
                    <div className='tit-bread' onClick={handleNextPage}>Trang chủ <span>{`>`}</span> </div>
                </div>
                <div className='tit-bread-actives'>{title}</div>
            </div>
        </div>
    )
}

export default BreadCumHeader
