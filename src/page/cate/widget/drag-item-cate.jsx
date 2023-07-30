import React, { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CategoryItem from '../../../components/cate-item';

const CategoryScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [droppedCategories, setDroppedCategories] = useState([]);

    const categories = [
        { id: 1, name: 'Danh mục cha 1', type: 'PARENT_CATEGORY' },
        { id: 2, name: 'Danh mục cha 2', type: 'PARENT_CATEGORY' },
        { id: 3, name: 'Danh mục con 1', type: 'CHILD_CATEGORY' },
        { id: 4, name: 'Danh mục con 2', type: 'CHILD_CATEGORY' },
    ];

    const handleCategorySelect = (id) => {
        setSelectedCategory(id);
    };

    const handleDrop = (item) => {
        // If the dropped item is a parent category, add it directly to the droppedCategories
        if (item.type === 'PARENT_CATEGORY') {
            setDroppedCategories((prevCategories) => [...prevCategories, item]);
        }
        // If the dropped item is a child category, find the parent category it belongs to and add it as a child of that parent
        else if (item.type === 'CHILD_CATEGORY' && selectedCategory !== null) {
            setDroppedCategories((prevCategories) => {
                return prevCategories.map((category) => {
                    if (category.id === selectedCategory) {
                        return {
                            ...category,
                            children: [...(category.children || []), item],
                        };
                    }
                    return category;
                });
            });
        }
    };

    const handleRemoveCategory = (id) => {
        setDroppedCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    };

    const parentCategories = categories.filter(category => category.type === 'PARENT_CATEGORY');
    const childCategories = categories.filter(category => category.type === 'CHILD_CATEGORY');

    const [, drop] = useDrop({
        accept: 'CATEGORY',
        drop: (item) => handleDrop(item),
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h3>Danh mục cha và con</h3>
                    {parentCategories.map(category => (
                        <CategoryItem
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            type={category.type}
                            onSelect={handleCategorySelect}
                        />
                    ))}
                    {childCategories.map(category => (
                        <CategoryItem
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            type={category.type}
                            onSelect={handleCategorySelect}
                        />
                    ))}
                </div>
                <div ref={drop} style={{ border: '1px solid #ccc', padding: '8px', width: '200px' }}>
                    <h3>Màn hình chọn</h3>
                    <div>
                        {selectedCategory !== null && (
                            <p>
                                Đang kéo: {categories.find(category => category.id === selectedCategory)?.name}
                            </p>
                        )}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <h3>Danh mục đã chọn</h3>
                        {droppedCategories.map(item => (
                            <div key={item.id} style={{ border: '1px solid #ccc', padding: '8px', margin: '8px', cursor: 'grab' }}>
                                {item.name}
                                <button style={{ marginLeft: '8px' }} onClick={() => handleRemoveCategory(item.id)}>X</button>
                                {item.children && item.children.map(child => (
                                    <div key={child.id} style={{ border: '1px solid #ccc', padding: '8px', margin: '8px', cursor: 'grab' }}>
                                        {child.name}
                                        <button style={{ marginLeft: '8px' }} onClick={() => handleRemoveCategory(child.id)}>X</button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};


export default CategoryScreen;
