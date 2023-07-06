import React, { useEffect, useState } from 'react';
import { Title, useGetList } from 'react-admin';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import AdminHeader from '../../components/AdminHeader';

const UserUpdatePopup = ({ open, handleClose, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');
    const token = localStorage.getItem('Token');

    useEffect(() => {
        if (user) {
            setName(user.userName || '');
            setEmail(user.email || '');
            setPhone(user.phoneNumber || '');
            setPassword(user.password || '');
            setStatus(user.status || '');
            setRole(user.role || '');
        } else {
            setName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setStatus('');
            setRole('');
        }
    }, [user]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();


        if (!name || !email || !phone || !password || !status || !role) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Vui lòng điền đầy đủ thông tin!',
            });
            return;
        }

        const res = await fetch('https://localhost:44327/api/Users/update', {
            mode: 'cors',
            method: 'PUT',
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                userName: name,
                email,
                password,
                phoneNumber: phone,
                role,
                status
            })
        });

        if (res.ok) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Chỉnh sửa hồ sơ thành công!',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            });
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update User</DialogTitle>
            <DialogContent>
                <form onSubmit={handleFormSubmit}>
                    <TextField 
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        required
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const UserList = () => {
    const [visiblePasswords, setVisiblePasswords] = useState([]);
    const [users, setUsers] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const token = localStorage.getItem('Token');
    const navigate = useNavigate();

    const fetchUserData = async () => {
        const res = await fetch('https://localhost:44327/api/Users/all?currentPage=1&pageSize=8', {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) {
            const data = await res.json();
            setUsers(data.items);
            setVisiblePasswords(new Array(data.items.length).fill(false));
        }
    };

    const handleDeleteClick = (userId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn vô hiệu hóa người dùng này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Inactive',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:44327/api/Users?userId=${userId}`, {
                    mode: 'cors',
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (res.ok) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đã vô hiệu hóa thành công!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                   fetchUserData();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something wrong!',
                    });
                    navigate('/users');
                }
            }
        });
    };

    useEffect(() => {
        if (localStorage.getItem('Role') && localStorage.getItem('Token')) {
            fetchUserData();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You do not have permission to view this page!',
            });
            navigate('/');
        }
    }, []);

    const togglePasswordVisibility = (index) => {
        const updatedVisiblePasswords = [...visiblePasswords];
        updatedVisiblePasswords[index] = !updatedVisiblePasswords[index];
        setVisiblePasswords(updatedVisiblePasswords);
    };

    const handleCreateUser = () => {
        navigate('/create-user');
    };

    const handleEditClick = (id) => {
        navigate("/create-user", { state: { userId: id } });
    };

    return (
        <div>
            <AdminHeader />
            <br />
            <Title title="User list" />
            <h1 className="text-orange-600 fontbold text-4xl ml-5 mb-3 inline-block">Danh sách các người dùng:</h1>
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUser}
                style={{ marginLeft: '15px', marginBottom: '10px' }}
            >
                Tạo
            </Button>
            <Card>
                <Table sx={{ padding: 2 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên người dùng</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Mật khẩu</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id} >
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        {visiblePasswords[index] ? user.password : '*'.repeat(user.password.length)}
                                        <Button onClick={() => togglePasswordVisibility(index)} style={{ marginLeft: '8px' }}>
                                            {visiblePasswords[index] ? <VisibilityOff /> : <Visibility />}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{user.status === 1 ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEditClick(user.id)}>
                                        Chỉnh sửa
                                    </Button>
                                    {user.status === 1 ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleDeleteClick(user.id)}
                                            style={{ marginLeft: '15px' }}
                                        >
                                            Vô hiệu hóa
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleDeleteClick(user.id)}
                                            style={{ marginLeft: '15px' }}
                                            disabled
                                        >
                                            Đã vô hiệu hóa
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

        </div>
    );
};

export default UserList;