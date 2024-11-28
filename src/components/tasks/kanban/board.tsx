import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import React from 'react';

// KanbanBoardContainer Component
export const KanbanBoardContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div
            style={{
                width: 'calc(100% + 64px)',
                height: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column', // Changed from 'justifyContent' to 'flexDirection'
                margin: '0', // Avoid negative margins
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    padding: '40px',
                    overflow: 'auto', // Use 'auto' for better UX
                }}
            >
                {children}
            </div>
        </div>
    );
};

// KanbanBoard Component
type KanbanBoardProps = {
    onDragEnd: (event: DragEndEvent) => void;
    children: React.ReactNode; // Explicitly type children
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ children, onDragEnd }) => {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 45,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            distance: 45,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    return (
        <DndContext onDragEnd={onDragEnd} sensors={sensors}>
            {children}
        </DndContext>
    );
};