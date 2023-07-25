import React, { useEffect, Fragment } from 'react';
import { useState } from 'react';
import { Title, useGetList } from 'react-admin';
import Swal from 'sweetalert2';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    TextField,
    Toolbar,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@mui/material';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import AdminHeader from '../../components/AdminHeader';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingId, setIsEditingId] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('Token');

    const fetchCategoryData = async () => {
        const res = await fetch("https://localhost:44327/api/Categories/all", {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setCategories(data);
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    };

    const fetchUpdateData = async () => {
        const res = await fetch(`https://localhost:44327/api/Categories/update?categoryId=${isEditingId}`, {
            mode: "cors",
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({ "categoryName": name, "status": 1 })
        });
        if (res.status === 200) {
            setIsEditing(false);
            setIsEditingId(0);
            fetchCategoryData();
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    }

    const fetchCreateData = async (e) => {
        setOpen(!open);
        e.preventDefault();
        const res = await fetch(`https://localhost:44327/api/Categories/create`, {
            mode: "cors",
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({ "categoryName": name, "status": 1 })
        });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tạo loại món ăn thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            fetchCategoryData();
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    }

    const handleNameChange = event => {
        setName(event.target.value);
    };

    const handleEditClick = (id, name, measurement, calo) => {
        setIsEditing(true);
        setIsEditingId(id);
        setName(name);
    }

    const handleCancelClick = () => {
        setIsEditing(false);
        setIsEditingId(0);
    }

    const handleOpen = () => {
        setOpen(!open);
        setName('');
    }

    const handleDeleteClick = async (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn xóa loại món ăn này không?',
            text: "Loại món ăn này sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Hủy',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:44327/api/Categories/delete?categoryId=${id}`, {
                    mode: "cors",
                    method: "DELETE",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    })
                });
                if (res.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Xóa loại món ăn thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fetchCategoryData();
                } else {
                    const data = await res.text();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data
                    })
                }
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem('Role') && localStorage.getItem('Token')) {
            var role = localStorage.getItem('Role');
            if (role !== 'ADMIN') {
                navigate('/');
            }
            fetchCategoryData();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You do not have permission to view this page!'
            })
            navigate('/');
        }
    })

    return (
        <div>
            <AdminHeader />
            <br />
            <div>
                <Title title="Book list" />
                {/* <TextField
                label="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                variant="filled"
                size="small"
                margin="dense"
            /> */}
                <h1 className="text-orange-600 font-bold text-4xl ml-5 mb-3 inline-block">Danh sách các loại món ăn:</h1>
                <div className='m-3'>
                    <Fragment className="grid place-items-center">
                        <Button onClick={handleOpen} variant="gradient" className="shadow-none">
                            <BsFillPlusCircleFill size={30} color="green" />
                        </Button>
                        <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">
                            <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Tạo Loại Món Ăn Mới</h2></DialogHeader>
                            <DialogBody divider>
                                <form id="create" onSubmit={fetchCreateData}>
                                    <div className="mb-4">
                                        <h5 className="text-left ml-3 font-bold">Tên loại món ăn:</h5>
                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                            type="text" placeholder="Nhập tên cho loại món ăn mới của bạn!" onChange={handleNameChange} value={name}
                                            required minLength={5} maxLength={50} />
                                    </div>
                                </form>
                            </DialogBody>
                            <DialogFooter className="flex justify-end">
                                <Button
                                    variant="text"
                                    color="red"
                                    onClick={handleOpen}
                                    className="mr-3"
                                >
                                    <span className="text-xl">Hủy bỏ</span>
                                </Button>
                                <Button variant="gradient" color="green" type="submit" className=" bg-green-600 px-3 py-1" form="create">
                                    <span className="text-xl">Tạo</span>
                                </Button>
                            </DialogFooter>
                        </Dialog>
                    </Fragment>
                </div>
                <Card>
                    <Table sx={{ padding: 2 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Tên loại món ăn</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map(category => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>
                                        {isEditing && parseInt(isEditingId) === parseInt(category.id) ? (
                                            <div><input type='text' className='w-full border-2 border-black' value={name}
                                                onChange={handleNameChange} required minLength={5} maxLength={50}
                                                placeholder='Nhập tên nguyên liệu!' /></div>
                                        ) : (
                                            <div>{category.categoryName}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing && parseInt(isEditingId) === parseInt(category.id) ? (
                                            <div>
                                                <span onClick={handleCancelClick} className='hover:underline hover:cursor-pointer'>Hủy</span>
                                                <span onClick={fetchUpdateData} className='hover:underline hover:cursor-pointer ml-2'>Chỉnh sửa</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <span
                                                    onClick={() => handleEditClick(category.id, category.categoryName)}
                                                    className='hover:underline hover:cursor-pointer'>Chỉnh sửa</span>
                                                <span onClick={() => handleDeleteClick(category.id)} className='hover:underline hover:cursor-pointer ml-5'>Xóa</span>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                <Toolbar>
                    {/* {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous page</Button>}
                {page < total / perPage && <Button onClick={() => setPage(page + 1)}>Next page</Button>} */}
                </Toolbar>
            </div>
        </div>
    );
}

export default Categories;