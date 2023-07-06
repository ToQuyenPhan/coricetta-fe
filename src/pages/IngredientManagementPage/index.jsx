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

function Ingredients() {
    const [ingredients, setIngredients] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [measurement, setMeasurement] = useState('');
    const [calo, setCalo] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingId, setIsEditingId] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('Token');

    const fetchIngredientData = async () => {
        const res = await fetch("https://localhost:44327/api/Ingredients/all", {
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
            setIngredients(data);
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
        const res = await fetch(`https://localhost:44327/api/Ingredients/update?ingredientId=${isEditingId}`, {
            mode: "cors",
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({ "ingredientName": name, "measurement": measurement, "calories": calo, "status": 1 })
        });
        if (res.status === 200) {
            setIsEditing(false);
            setIsEditingId(0);
            fetchIngredientData();
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    }

    const fetchCreateData = async () => {
        const res = await fetch(`https://localhost:44327/api/Ingredients/create`, {
            mode: "cors",
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({ "ingredientName": name, "measurement": measurement, "calories": calo, "status": 1 })
        });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tạo nguyên liệu thành công!',
                showConfirmButton: false,
                timer: 1500
            })
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

    const handleMeasurementChange = event => {
        setMeasurement(event.target.value);
    };

    const handleCaloChange = event => {
        setCalo(event.target.value);
    };

    const handleEditClick = (id, name, measurement, calo) => {
        setIsEditing(true);
        setIsEditingId(id);
        setName(name);
        setMeasurement(measurement);
        setCalo(calo);
    }

    const handleCancelClick = () => {
        setIsEditing(false);
        setIsEditingId(0);
    }

    const handleOpen = () => {
        setOpen(!open);
        setName('');
        setMeasurement('');
        setCalo(0);
    }

    const handleDeleteClick = async (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn xóa nguyên liệu này không?',
            text: "Nguyên liệu này sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:44327/api/Ingredients/delete?ingredientId=${id}`, {
                    mode: "cors",
                    method: "DELETE",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    })
                });
                if (res.status === 200) {
                    fetchIngredientData();
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
            fetchIngredientData();
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
                <h1 className="text-orange-600 font-bold text-4xl ml-5 mb-3 inline-block">Danh sách các nguyên liệu:</h1>
                <div className='m-3'>
                    <Fragment className="grid place-items-center">
                        <Button onClick={handleOpen} variant="gradient" className="shadow-none">
                            <BsFillPlusCircleFill size={30} color="green" />
                        </Button>
                        <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">
                            <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Tạo Nguyên Liệu Mới</h2></DialogHeader>
                            <DialogBody divider>
                                <form id="create" onSubmit={fetchCreateData}>
                                    <div className="mb-4">
                                        <h5 className="text-left ml-3 font-bold">Tên nguyên liệu:</h5>
                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                            type="text" placeholder="Nhập tên cho nguyên liệu mới của bạn!" onChange={handleNameChange} value={name}
                                            required minLength={5} maxLength={50} />
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="text-left ml-3 font-bold">Đơn vị:</h5>
                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                            type="text" placeholder="Nhập đơn vị cho nguyên liệu!" onChange={handleMeasurementChange} value={measurement}
                                            required minLength={1} maxLength={50} />
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="text-left ml-3 font-bold">Lượng calo:</h5>
                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                            type="number" placeholder="Nhập lượng calo cho nguyên liệu!" onChange={handleCaloChange} value={calo}
                                            required min={0} />
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
                                    <span className="text-xl">Tạo menu</span>
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
                                <TableCell>Name</TableCell>
                                <TableCell>Đơn vị</TableCell>
                                <TableCell>Lượng calo/ gram</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredients.map(ingredient => (
                                <TableRow key={ingredient.id}>
                                    <TableCell>{ingredient.id}</TableCell>
                                    <TableCell>
                                        {isEditing && parseInt(isEditingId) === parseInt(ingredient.id) ? (
                                            <div><input type='text' className='w-full border-2 border-black' value={name}
                                                onChange={handleNameChange} required minLength={5} maxLength={50}
                                                placeholder='Nhập tên nguyên liệu!' /></div>
                                        ) : (
                                            <div>{ingredient.ingredientName}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing && parseInt(isEditingId) === parseInt(ingredient.id) ? (
                                            <div><input type='text' className='w-full border-2 border-black' value={measurement}
                                                onChange={handleMeasurementChange} required minLength={1} maxLength={50}
                                                placeholder='Nhập đơn vị cho nguyên liệu!' /></div>
                                        ) : (
                                            <div>{ingredient.measurement}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing && parseInt(isEditingId) === parseInt(ingredient.id) ? (
                                            <div><input type='number' className='w-full border-2 border-black' value={calo}
                                                onChange={handleCaloChange} required min={0}
                                                placeholder='Nhập lượng calo cho nguyên liệu!' /></div>
                                        ) : (
                                            <div>{ingredient.calories}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing && parseInt(isEditingId) === parseInt(ingredient.id) ? (
                                            <div>
                                                <span onClick={handleCancelClick} className='hover:underline hover:cursor-pointer'>Hủy</span>
                                                <span onClick={fetchUpdateData} className='hover:underline hover:cursor-pointer ml-2'>Chỉnh sửa</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <span
                                                    onClick={() => handleEditClick(ingredient.id, ingredient.ingredientName, ingredient.measurement, ingredient.calories)}
                                                    className='hover:underline hover:cursor-pointer'>Chỉnh sửa</span>
                                                <span onClick={() => handleDeleteClick(ingredient.id)} className='hover:underline hover:cursor-pointer ml-5'>Xóa</span>
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

export default Ingredients;