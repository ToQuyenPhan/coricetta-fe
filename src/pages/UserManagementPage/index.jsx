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
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AdminHeader from '../../components/AdminHeader';

const UserList = () => {
    const [visiblePasswords, setVisiblePasswords] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const token = localStorage.getItem('Token');
    const navigate = useNavigate();

    const fetchUserData = async () => {
        const res = await fetch('https://localhost:44327/api/Users/all?currentPage=1&pageSize=10', {
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
            setHasNext(data.hasNext);
            setHasPrevious(data.hasPrevious);
            setCurrentPage(data.currentPage);
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

    const fetchPrevious = async () => {
        const res = await fetch(`https://localhost:44327/api/Users/all?currentPage=${currentPage - 1}&pageSize=10`, {
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
            setHasNext(data.hasNext);
            setHasPrevious(data.hasPrevious);
            setCurrentPage(data.currentPage);
        }
    }

    const fetchNext = async () => {
        const res = await fetch(`https://localhost:44327/api/Users/all?currentPage=${currentPage + 1}&pageSize=10`, {
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
            setHasNext(data.hasNext);
            setHasPrevious(data.hasPrevious);
            setCurrentPage(data.currentPage);
        }
    }

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
            <h1 className="text-orange-600 font-bold text-4xl ml-5 mb-3 inline-block">Danh sách các người dùng:</h1>
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
            <Toolbar>
                <Button type='button' disabled={!hasPrevious} onClick={fetchPrevious}>Previous page</Button>
                <Button type='button' disabled={!hasNext} onClick={fetchNext}>Next page</Button>
            </Toolbar>
        </div>
    );
};

export default UserList;