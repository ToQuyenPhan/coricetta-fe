import React, { useEffect } from 'react';
import { useState } from 'react';
import { Title, useGetList } from 'react-admin';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    TextField,
    Button,
    Toolbar,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@mui/material';

const UserList = () => {
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const token = localStorage.getItem('Token');
    const navigate = useNavigate();
    // const { data, total, isLoading } = useGetList('books', {
    //     filter: { q: filter },
    //     pagination: { page, perPage },
    //     sort: { field: 'id', order: 'ASC' }
    // });

    const fetchUserData = async () => {
        const res = await fetch("https://localhost:44327/api/Users/all?currentPage=1&pageSize=3", { mode: 'cors', method: 'GET', headers: new Headers({
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        })});
        if(res.status === 200){
            const data = await res.json();
            setUsers(data.items);
        }
    }

    useEffect(() => {
        if(localStorage.getItem('Role') && localStorage.getItem('Token')){
            fetchUserData();
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You do not have permission to view this page!'
              })
            navigate('/');
        }      
    })

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }
    return (
        <div>
            <Title title="Book list" />
            <TextField
                label="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                variant="filled"
                size="small"
                margin="dense"
            />
            <Card>
                <Table sx={{ padding: 2 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Fullname</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{user.password}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
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
    );
};

export default UserList;