// frontend/src/components/Todo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Edit and delete icons
import './Todo.css';

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data.reverse()); // Show the latest tasks on top
    };

    const addTask = async (e) => {
        e.preventDefault();
        const newTask = { title };
        if (editTaskId) {
            await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, newTask);
            setEditTaskId(null); // Reset edit task id
        } else {
            await axios.post('http://localhost:5000/api/tasks', newTask);
        }
        fetchTasks();
        setTitle('');
    };

    const deleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) { // Confirmation dialog
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
            fetchTasks();
        }
    };

    const editTask = (task) => {
        setEditTaskId(task._id);
        setTitle(task.title);
    };

    return (
        <div className="todo-container">
            <h1 className="app-title">My Todo List</h1>
            <form onSubmit={addTask} className="todo-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    required
                    className="task-input"
                />
                <button type="submit" className="add-btn">
                    {editTaskId ? 'Update Task' : 'Add Task'}
                </button>
            </form>
            <div className="task-list">
                {tasks.map((task) => (
                    <div key={task._id} className="task-item">
                        <h2 className="task-title">{task.title}</h2>
                        <div className="task-actions">
                            <button className="edit-btn" onClick={() => editTask(task)}>
                                <FaEdit />
                            </button>
                            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Todo;
