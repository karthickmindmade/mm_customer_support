import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Ticketviewer from '../common/ticketviewer';
import { useRouter } from 'next/router';
import Axios from 'axios';
import ViewTeam from '../common/view_team';
import ReactPaginate from 'react-paginate';
import { Tooltip, Typography } from '@mui/material';
function Userticket(props) {
    const { tickets } = props;
    const [maptickets, setmaptickets] = useState([]);
    const Router = useRouter();
    const [login, setLogin] = useState();
    const [showdetails, setShowdetails] = useState(false);
    const [dticketsId, setdticketsId] = useState("");
    const [dticketsscreenshots, setdticketsscreenshots] = useState("");
    // var [team, setTeam] = useState([]);
    useEffect(() => {
        setmaptickets(tickets.reverse());
        setLogin(window.localStorage.getItem('loggedin'));
        if (window.localStorage.getItem('loggedin') === "false") {
            Router.push("/");
        } else if (window.localStorage.getItem('loggedin') === null) {
            Router.push("/");
        };
        localStorage.setItem('updateclose', "open");
    }, [tickets]);
    const Openticket = (ticketsId, Screenshots) => {
        setdticketsId(ticketsId);
        setdticketsscreenshots(Screenshots);
        setShowdetails(true);
    };
    function closeDetails() {
        setShowdetails(false);
    };
    const [datalimit, setdatalimit] = useState(10);
    const [currentpage, setCurrentpage] = useState(1);
    //pagination
    function handlePageChange(pageNumber) {
        setCurrentpage(pageNumber + 1);
    };

    const pagedatalimit = (e) => {
        setdatalimit(e.target.value);
    };
    return (
        <div>
            <Head>
                <title>Client Dashboard</title>
            </Head>
            {showdetails === false ?

                <div className="teambody">
                    <div className='dash-head mt-1 mb-1'>
                        <h1>TICKETS</h1>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>TICKETS ID</TableCell>
                                    <TableCell align="left">EMAIL</TableCell>
                                    <TableCell align="left">DATE</TableCell>
                                    <TableCell align="left">TEAM</TableCell>
                                    <TableCell align="left">STATUS</TableCell>
                                </TableRow>
                            </TableHead>
                            {maptickets.slice((currentpage - 1) * datalimit, currentpage * datalimit).map((tickets) =>
                                <Tooltip key={tickets.ticketsId} title="View Details" followCursor>
                                    <TableBody  >
                                        <TableRow className="tickets-bodyrow" onClick={() => Openticket(tickets.ticketsId, tickets.Screenshots)}>
                                            <TableCell>{tickets.ticketsId}</TableCell>
                                            <TableCell className='table_spacing' >{tickets.Email}</TableCell>
                                            <TableCell className='table_spacing' >{tickets.Cus_CreatedOn === null ? <>{tickets.Adm_CreatedOn}</> : <>{tickets.Cus_CreatedOn}</>}</TableCell>
                                            <TableCell >{tickets.TeamAssign.length <= 0 ? <>Not Assigned</> : <ViewTeam teamArray={tickets.TeamAssign} />}</TableCell>
                                            <TableCell > {tickets.Status === "completed" ? <h5 className="inprogress">Inprogress</h5> : <h5 className={tickets.Status}>{tickets.Status}</h5>}

                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Tooltip>
                            )}
                        </Table>
                    </TableContainer>
                    {maptickets.length < 10 ? <></> :
                        <div className='page-bottom'>
                            < ReactPaginate
                                previousLabel={""}
                                nextLabel={""}
                                pageCount={Math.ceil(maptickets.length / datalimit)}
                                onPageChange={(e) => handlePageChange(e.selected)}
                                containerClassName={"pagination mt-3"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                activeClassName={"active"}
                            />
                            <div className='pagedata-limit flex'>
                                <Typography>Clients per page</Typography>

                                <select className='pagedatalimit-select' onChange={pagedatalimit}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    }
                </div> :
                <>
                    <Ticketviewer
                        dticketsId={dticketsId}
                        dticketsscreenshots={dticketsscreenshots}
                        closeDetails={closeDetails}
                    />
                </>
            }

        </div>
    );
}
export default Userticket;