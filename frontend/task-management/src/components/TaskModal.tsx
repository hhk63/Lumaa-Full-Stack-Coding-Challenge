import React, { useState } from "react";
import './TaskModal.css';
import { createNewTask } from "../requests/Requests";
import { Task } from "./Tasks";

interface TaskModalProps {
    isOpen: boolean;
    userId: string | null;
    tasks: Task[];
    onClose: () => void;
    updateTasks: (tasks: Task[]) => void;
}

const SUCCESS = 200;

export const TaskModal = ({ isOpen, userId, tasks, onClose, updateTasks }: TaskModalProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = () => {
        createNewTask(title, description, status, userId).then((response) => {
            if (response.status === SUCCESS) {
                updateTasks([...tasks, { id: response.id, title, description, completed: status }]);
                onClose();
            } else {
                //handle the error
            }
        })
    }
    return (
        <div className="task-modal">
            <div className="content">
                <button className="close" onClick={onClose}>Close</button>
                <div className="task-title">
                    <label>Title</label>
                    <input type="text" onChange={(event) => setTitle(event?.target.value)} value={title} />
                </div>
                <div className="task-description">
                    <label>Description</label>
                    <input type="text" onChange={(event) => setDescription(event?.target.value)} value={description} />
                </div>
                <div className="status-checkbox">
                    <label>Completed</label>
                    <input type="checkbox" onChange={() => setStatus(!status)} value={status.toString()} />
                </div>
                <button onClick={() => handleSubmit()}>Submit</button>
            </div>
        </div>
    )
}