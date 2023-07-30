// components/cate-item.js
import React from 'react';
import { useDrag } from 'react-dnd';

const CategoryItem = ({ id, name, type, onSelect }) => {
    const [, drag] = useDrag({
        type: 'CATEGORY',
        item: { id, name, type },
    });

    const handleClick = () => {
        onSelect(id);
    };

    return (
        <div ref={drag} style={{ border: '1px solid #ccc', padding: '8px', margin: '8px', cursor: 'grab' }} onClick={handleClick}>
            {name}
        </div>
    );
};

export default CategoryItem;
