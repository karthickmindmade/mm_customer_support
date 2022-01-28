import React, { useState, useEffect,useContext } from 'react';
import Head from 'next/head';
import Axios from "axios";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import FormDialog from '../common/dialogsform';
import { useRouter } from 'next/router'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Ticketviewer from '../common/ticketviewer';
import { CounterContext } from '../contex/adminProvider'
function Teamticket(props) {
    const { tickets,teamname} = useContext(CounterContext);
    const Router = useRouter()
    var [show, setShow] = useState('');
   
    var [selectedstatus, setSelectedstatus] = useState('');
    function handlestatus(e) {
        setSelectedstatus(e.target.value)
    }
   
    //tickets status update functions 
    const [disabled, setdisabled] = useState("enable")
    const updateemail = (Status) => {
        if (Status === "completed") {
            setdisabled("disabled")
        } else {
            setdisabled("enable")
        }
    }
   //status submit function
    function handleUpdatestatus(ticketsId, timeline) {

        if (selectedstatus === 'started') {
            Axios.put(`https://mindmadetech.in/api/tickets/status/update/${ticketsId}`, {
                Status: selectedstatus,
                ticketsId: ticketsId,
                Tm_Start_UpdatedOn: fulldate + ' ' + fullTime,
                Tm_Start_UpdatedBy: search1
            }).then((response) => {
                setShow("update started Successfully");
                localStorage.setItem('updateclose', "close");
            });
        } else if (selectedstatus === 'inprogress') {
            Axios.put(`https://mindmadetech.in/api/tickets/status/update/${ticketsId}`, {
                Status: selectedstatus,
                ticketsId: ticketsId,
                Tm_Process_UpdatedOn: fulldate + ' ' + fullTime,
                Tm_Process_UpdatedBy: search1
            }).then((response) => {
                setShow("update inprogress Successfully");
                localStorage.setItem('updateclose', "close");
            });
        } else if (selectedstatus === 'completed') {
            Axios.put(`https://mindmadetech.in/api/tickets/status/update/${ticketsId}`, {
                Status: selectedstatus,
                ticketsId: ticketsId,
                Tm_Complete_UpdatedOn: fulldate + ' ' + fullTime,
                Tm_Complete_UpdatedBy: search1
            }).then((response) => {
                setShow("update completed Successfully");
                localStorage.setItem('updateclose', "close");
            });
        } else return null
    }
    setTimeout(() => {
        setShow()
    }, [3500])

    //current time and date 
    var date, TimeType, hour, minutes, seconds, fullTime, dateupadate, monthupadate, yearupadate, fulldate;
    date = new Date();
    hour = date.getHours();
    if (hour <= 11) {
        TimeType = 'AM';
    }
    else {
        TimeType = 'PM';
    }
    if (hour > 12) {
        hour = hour - 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes.toString();
    }
    seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds.toString();
    }
    dateupadate = date.getDate();
    monthupadate = (date.getMonth() + 1);
    yearupadate = date.getFullYear();
    // Adding all the variables in fullTime variable.
    fullTime = hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString()
    fulldate = dateupadate.toString() + '-' + monthupadate.toString() + '-' + yearupadate.toString()
   
    //auth access for team ticket page
    const [login, setLogin] = useState()
    useEffect(() => {
        setLogin(window.localStorage.getItem('loggedin'))
        if (login === "false") {
            Router.push("/")
        } else if (login === null) {
            Router.push("/")
        }
    })
    const [dticketsId, setdticketsId] = useState("")
    const Notificationupdate = (ticketsId) => {
        setdticketsId(ticketsId)
        setShowdetails(true)
    }
    const [showdetails, setShowdetails] = useState(false)
    function closeDetails() {
        setShowdetails(false)
    }
    return (
        <div>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            {showdetails === false ?
            <div className='container'>
                <div className="teambody">
                    <div className='adminticket-head'>
                        <h1>Tickets</h1>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell  >TicketId</TableCell>
                                    <TableCell align="left">Username</TableCell>
                                    <TableCell align="left">Date</TableCell>
                                    <TableCell align="left">Team</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            {tickets.filter(val => {
                                return val.Team.toLowerCase().includes(teamname.toLowerCase())
                            }).map((tickets) =>
                              
                                    <TableBody key={tickets.ticketsId} className='update-right' >
                                        <TableRow className={tickets.Notification === "unseen" ? "highlighted-row update6" : "tickets-bodyrow update6"}  onClick={() => Notificationupdate(tickets.ticketsId)}>
                                              
                                            <TableCell>{tickets.ticketsId}</TableCell>
                                            <TableCell >{tickets.Username}</TableCell>
                                            <TableCell >{tickets.Cus_CreatedOn}</TableCell>
                                            <TableCell >{tickets.Team}</TableCell>
                                            <TableCell > <h5 className={tickets.Status}>{tickets.Status}</h5>
                                                <h5 className='statusUpdateTime'>Updated at {tickets.statusUpdateTime}</h5>
                                            </TableCell>            
                                        </TableRow>
                                        <FormDialog
                                        dialog_className="update7"
                                            dialogtitle={<div onClick={() => updateemail(tickets.Status)}>update</div>}
                                            className="btn3 ticket-update2"
                                            dialogbody={<div>{disabled === "disabled" ? <div className='ticket-update-alert'>ticket has been completed</div> :
                                                <div className="form dialog" >
                                                    <div className="form-toggle"></div>
                                                    <div className="form-panel update one">
                                                        <div className="form-header">
                                                            <h1>Update Ticket {tickets.ticketsId}</h1>
                                                        </div>
                                                        <div className="addform">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label className="label">status</label>

                                                                    <select className="form-input" onChange={handlestatus}>
                                                                        <option value="">--Select Team--</option>
                                                                        <option className='started' value="started">started</option>
                                                                        <option className='inprogress' value="inprogress">inprogress</option>
                                                                        <option className='completed' value="completed">completed</option>
                                                                    </select>

                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    <button className="btn2 float-end mt-3 mb-3" onClick={() => handleUpdatestatus(tickets.ticketsId, tickets.timeline)}>update</button>
                                                    <h4 className="alert1 text-center">{show}</h4>
                                                </div>
                                            }
                                            </div>
                                            }
                                        />
                                    </TableBody>
                                   
                               
                            )}
                        </Table>
                    </TableContainer>
                </div>
                </div> :
                <>
                    <Ticketviewer
                        dticketsId={dticketsId}

                        closeDetails={closeDetails}
                    />
                </>
            }
        </div>
    );
}
export default Teamticket;
