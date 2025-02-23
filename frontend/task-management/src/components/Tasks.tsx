import React, { useEffect, useState } from "react";
import { deleteSingleTask, getAllTasks, updateTaskStatus } from "../requests/Requests";
import { TaskModal } from "./TaskModal";
import { useNavigate } from "react-router-dom";
import './Tasks.css';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

const SUCCESS = 200;

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [hasError, setHasError] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("user-id");

    useEffect(() => {
        getAllTasks(userId).then((result) => {
            if (result.status === SUCCESS) {
                setTasks(result.tasks);
            } else {
                setHasError(true);
            }
        })
    }, [userId]);

    const toggleStatus = (taskId: number, status: boolean) => {
        updateTaskStatus(taskId, status).then((response) => {
            if (response === SUCCESS) {
                const updatedTasks = tasks.map(t => {
                    if (t.id === taskId) {
                        return {
                            ...t,
                            completed: status,
                        }
                    }
                    return { ...t };
                })
                setTasks(updatedTasks);
            } else {
                setHasError(true);
            }
    })
    }

    const deleteTask = (taskId: number) => {
        deleteSingleTask(taskId).then((response) => {
            if (response === SUCCESS) {
                const updatedTasks = tasks.filter(t => {
                    if (t.id !== taskId) {
                        return {
                            ...t,
                        }
                    }
                })
                setTasks(updatedTasks);
            } else {
                setHasError(true);
            }
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-id');
        navigate('/');
    }
    return (
        <div>
            <h1>Task List</h1>
            <button className="new-task" onClick={() => setIsModalOpen(true)}>Create New Task</button>
            <button className="logout" onClick={handleLogout}>Logout</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan={3}>No tasks found.</td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>
                                    <button className="status" onClick={() => toggleStatus(task.id, !task.completed)}>
                                        {task.completed ? "Completed" : "Pending"}
                                    </button>
                                </td>
                                <td>
                                    <button className="delete" onClick={() => deleteTask(task.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={userId} updateTasks={setTasks} tasks={tasks} />
        </div>
    );
};