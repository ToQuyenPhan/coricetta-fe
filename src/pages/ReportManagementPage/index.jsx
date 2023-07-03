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
import AdminHeader from '../../components/AdminHeader';

function Reports(){
    const [reports, setReports] = useState([])
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const token = localStorage.getItem('Token');
    const navigate = useNavigate();

    const fetchReportData = async () => {
        const res = await fetch("https://localhost:44327/api/Reports/all?currentPage=1&pageSize=8", { mode: 'cors', method: 'GET', headers: new Headers({
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        })});
        if(res.status === 200){
            const data = await res.json();
            setReports(data.items);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Someting wrong!'
              })
        }
    }

    useEffect(() => {
        if(localStorage.getItem('Role') && localStorage.getItem('Token')){
            fetchReportData();
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You do not have permission to view this page!'
              })
            navigate('/');
        }      
    })

    return(
        <div>
             <AdminHeader />
            <br />
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
                            <TableCell>Người báo cáo</TableCell>
                            <TableCell>Công thức</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report,index) => (
                            <TableRow key={index}>
                                <TableCell>{report.userName}</TableCell>
                                <TableCell>{report.recipeName}</TableCell>
                                <TableCell>{report.description}</TableCell>
                                <TableCell>{report.status}</TableCell>
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
}

export default Reports;