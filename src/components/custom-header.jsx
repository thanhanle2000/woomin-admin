import React, { useState, useEffect, useRef } from 'react';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CustomDrawer from './custom-drawer';
import { getObUser } from '../core/db/local';

const CustomHeader = () => {
  // useState
  const [visible, setVisible] = useState(false);
  const drawerRef = useRef(null);

  // handle onclick
  const onClick = () => {
    setVisible(!visible);
  };

  // useEffect
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && visible) {
        setVisible(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [visible]);


  // Click event handler to toggle the drawer visibility
  const toggleDrawer = () => {
    setVisible(!visible);
  };

  // lấy thông tin user
  const user = getObUser();

  return (
    <div>
      <div className='row-header'>
        <div className='icon-drawer' ref={drawerRef} onClick={onClick}>
          <TableRowsIcon />
        </div>
        <CustomDrawer id="navigation" visible={visible} onClose={toggleDrawer} />
        <div className='search-input-container'>
          <input type='search' placeholder='Nhập nội dung cần tìm' />
          <SearchIcon className='search-icon' />
        </div>
        <div className='user-if'>
          <NotificationsNoneIcon className='icon-noti' />
          <div className='row-if'>
            <AccountCircleIcon />
            <div className='col-if-user'>
              <div className='title-wel'>Welcome</div>
              <div className='name-ac'>{user}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomHeader;
