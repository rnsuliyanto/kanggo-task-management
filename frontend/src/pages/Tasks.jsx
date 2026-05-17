import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [deadline, setDeadline] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [filter, search, page, navigate]);

    useEffect(() => {
        setPage(1);
    }, [filter, search]);

    const fetchTasks = async () => {
        try {
            let url = `/tasks?page=${page}&limit=5&`;
            if (filter) url += `status=${filter}&`;
            if (search) url += `search=${search}`;
            const response = await api.get(url);
            setTasks(response.data.tasks);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (!title.trim()) {
            setErrorMsg('Judul tugas tidak boleh kosong');
            return;
        }

        if (deadline) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(deadline)) {
                setErrorMsg('Format tanggal deadline tidak valid');
                return;
            }
        }

        try {
            const taskData = { title, description, status, deadline };
            if (editingId) {
                await api.put(`/tasks/${editingId}`, taskData);
                setEditingId(null);
            } else {
                await api.post('/tasks', taskData);
            }
            setTitle('');
            setDescription('');
            setStatus('pending');
            setDeadline('');
            fetchTasks();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Gagal menyimpan tugas');
        }
    };

    const handleEdit = (task) => {
        setEditingId(task.id);
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setDeadline(task.deadline ? task.deadline.split('T')[0] : '');
        setErrorMsg('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus tugas ini?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                alert('Gagal menghapus tugas');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                
                <div className="flex justify-between items-center bg-white border-4 border-black p-4 shadow-neo">
                    <h1 className="text-3xl font-black uppercase">Task Manager</h1>
                    <button onClick={handleLogout} className="neo-button bg-neo-pink text-white">
                        LOGOUT
                    </button>
                </div>

                <div className="bg-white border-4 border-black p-6 shadow-neo">
                    <h2 className="text-xl font-bold mb-4 uppercase border-b-4 border-black pb-2">
                        {editingId ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                    </h2>
                    {errorMsg && <div className="bg-neo-pink text-white font-bold p-3 border-2 border-black mb-4">{errorMsg}</div>}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Judul Tugas"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="neo-input bg-neo-bg"
                        />
                        <textarea
                            placeholder="Deskripsi (Opsional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="neo-input bg-neo-bg h-24 resize-none"
                        ></textarea>
                        <div className="flex gap-4 flex-wrap">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="neo-input bg-neo-bg flex-1"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="neo-input bg-neo-bg flex-1"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="neo-button bg-neo-blue text-white flex-1">
                                {editingId ? 'UPDATE TUGAS' : 'SIMPAN TUGAS'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setTitle('');
                                        setDescription('');
                                        setStatus('pending');
                                        setDeadline('');
                                        setErrorMsg('');
                                    }}
                                    className="neo-button bg-gray-300 text-black"
                                >
                                    BATAL
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white border-4 border-black p-6 shadow-neo">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b-4 border-black pb-2 gap-4">
                        <h2 className="text-xl font-bold uppercase">Daftar Tugas</h2>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Cari tugas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="neo-input bg-neo-bg w-full md:w-48"
                            />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="neo-input bg-neo-bg font-bold"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {tasks.length === 0 ? (
                            <p className="font-bold text-center py-4">Tugas tidak ditemukan.</p>
                        ) : (
                            tasks.map((task) => (
                                <div key={task.id} className="border-4 border-black p-4 bg-neo-bg flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-black uppercase">{task.title}</h3>
                                        <p className="mb-2">{task.description}</p>
                                        <div className="flex gap-2 text-sm font-bold">
                                            <span className={`px-2 py-1 border-2 border-black ${
                                                task.status === 'done' ? 'bg-green-400' :
                                                task.status === 'in-progress' ? 'bg-neo-yellow' : 'bg-gray-300'
                                            }`}>
                                                {task.status.toUpperCase()}
                                            </span>
                                            {task.deadline && (
                                                <span className="px-2 py-1 border-2 border-black bg-white">
                                                    Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="neo-button bg-neo-yellow text-black px-3 py-1"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="neo-button bg-neo-pink text-white px-3 py-1"
                                        >
                                            HAPUS
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-6 border-t-4 border-black pt-4">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(page - 1)}
                            className="neo-button bg-white text-black disabled:opacity-50"
                        >
                            SEBELUMNYA
                        </button>
                        <span className="font-bold">Halaman {page} dari {totalPages || 1}</span>
                        <button 
                            disabled={page >= totalPages || totalPages === 0} 
                            onClick={() => setPage(page + 1)}
                            className="neo-button bg-white text-black disabled:opacity-50"
                        >
                            SELANJUTNYA
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Tasks;