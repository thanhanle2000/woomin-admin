import React from 'react';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HeaderHome = () => {
  return (
    <div>
      <div className='row-header'>
          <div className='icon-drawer'>
          <TableRowsIcon />
          </div>
          <div className='search-input-container'>
            <input type='search' placeholder='Search' />
            <SearchIcon className='search-icon' />
          </div>
          <div className='user-if'>
            <NotificationsNoneIcon/>
            <div className='row-if'>
              <AccountCircleIcon/>
             <div className='col-if-user'>
                <div>Welcome</div>
                <div>thanhan.le</div>
             </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default HeaderHome;
