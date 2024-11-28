import { DragOverlay, useDraggable, UseDraggableArguments } from '@dnd-kit/core';

interface Props {
    id: string;
    data?: UseDraggableArguments['data'];
}

const KanbanItem = ({ children, id, data }: React.PropsWithChildren<Props>) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id, // Use the id prop from the component
        data // Use the data prop from the component
    });

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{
                    opacity: isDragging ? 0.5 : 1, // Use isDragging to control opacity
                    borderRadius: '8px',
                    cursor: 'grab',
                }}
            >
                {children}
            </div>
            {isDragging && ( // Show DragOverlay only when dragging
                <DragOverlay zIndex={1000}>
                    <div style={{
                        borderRadius: '8px',
                        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                        cursor: 'grabbing',
                    }}>
                        {children}
                    </div>
                </DragOverlay>
            )}
        </div>
    );
};

export default KanbanItem;