import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Dashboard from "../common/navdashboard";
import Userissue from "../submits/userissues";
import { withRouter } from "next/router";
import Axios from "axios";
import router from "next/router";
import Userticket from "../tickets/userticket";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListItemText from '@mui/material/ListItemText';
import CustomerProfile from "../profile/customerProfile";
import Dashcard from "../common/dashCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Copyrights from "../common/copyRight";
import FormAlert from "../common/alert";
import CustomerChangePass from "../profile/CustomerChangePass";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const CustomerDashboard = () => {
  const [user, setUser] = useState();
  const [finishStatus, setfinishStatus] = useState(false);
  const [login, setLogin] = useState();
  // usertab
  var [activeTab, setActivetab] = useState(" ");
  var [tickets, setTickets] = useState([]);
  const [ticketraisedcount, setticketraisedcount] = useState();
  const [raisedinprogresscount, setraisedinprogresscount] = useState();
  const [raisedcompletedcount, setraisedcompletedcount] = useState();
  useEffect(() => {
    setLogin(window.localStorage.getItem('loggedin'));
    if (window.localStorage.getItem('loggedin') === "false") {
      router.push("/");
    } else if (window.localStorage.getItem('loggedin') === null) {
      router.push("/");
    }
  },[]);
  useEffect(() => {
    setUser(window.localStorage.getItem('clientname'));
  }, []);
  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!finishStatus) {
      if (window.confirm("Do you want to Logout ?")) {
        setfinishStatus(true);
        // your logic
        router.push("/");
        localStorage.setItem('loggedin', false);
      } else {
        window.history.pushState(null, null, window.location.pathname);
        setfinishStatus(false);
      }
    }
  };
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);
  const onBackButtonEvent3 = () => {
    router.push("/");
    localStorage.setItem('loggedin', false);
    localStorage.removeItem('activeTab');
    localStorage.removeItem('loggedWho');
  };
  useEffect(() => {
    setUser(window.localStorage.getItem('user'));
  }, []);
  // dashtab
  const DashTabActive = () => {
    localStorage.setItem('activeTab', "Dashboard");
  };
  // tickettab
  const TicketTabActive = () => {
    localStorage.setItem('activeTab', 'ticket');
  };
  const profileTabActive = () => {
    localStorage.setItem('activeTab', 'profile');
  };
  // usertab
  useEffect(() => {
    // if (activeTab === " ") {
      setActivetab(window.localStorage.getItem('activeTab'));
    // }

  }, []);
  useEffect(() => {
    Axios.get(`https://mindmadetech.in/api/tickets/customertickets/${user}`)
      .then((res) => setTickets(res.data))
      .catch((err) => { return err; })
  }, [user]);
  useEffect(() => {
    setticketraisedcount(tickets.filter(val => { return val }).map((ticket) => setticketraisedcount(ticket.Status.length)).length);
    var doneCount=tickets.filter(val => { return val.Status.includes("completed") }).map((ticket) => setraisedcompletedcount(ticket.Status.length)).length;
    setraisedinprogresscount(doneCount+tickets.filter(val => { return val.Status.toLowerCase().includes("inprogress") }).map((ticket) => setraisedinprogresscount(ticket.Status.length)).length);
    setraisedcompletedcount(tickets.filter(val => { return val.Status.includes("Completed") }).map((ticket) => setraisedcompletedcount(ticket.Status.length)).length);
  }, [tickets]);
  
  return (
    <>
      {login === "false" ? <div className="access ">access denied</div> :
        <div>
          <Dashboard
            dashActive={activeTab === "Dashboard" ? "nav-link active" : "nav-link"}
            ticketActive={activeTab === "ticket" ? "nav-link active" : "nav-link"}
            TicketTabActive={TicketTabActive}
            DashTabActive={DashTabActive}
            logout={onBackButtonEvent3}
            ChangePassword={<CustomerChangePass customername={user} />}
            profileAlt={user}
            email={user}
            sidenavcontent={
              <button className={activeTab === "profile" ? "nav-link active" : "nav-link"} onClick={profileTabActive} id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false"> <ListItem button>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              </button>
            }
            headertext="USER DASHBOARD"
            navcontent={
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                USER DASHBOARD
              </Typography>
            }
            tabbody={
              <div className="tab-body" maxwidth="lg" sx={{ mt: 4, mb: 4 }}>
                <div className="tab-content" id="v-pills-tabContent">
                  <div className={activeTab === "Dashboard" ? "tab-pane fade show active" : "tab-pane fade"} id="v-pills-dash" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <div className="user-dash-page">
                      <div className="row">
                        <div className="col"> <Userissue customername={user} /></div>
                        <div className="col">
                          <div className="customer-cards">
                            <Dashcard
                              cardHead="No of Tickets"
                              cardbody={ticketraisedcount}
                              cardfooter="Raised"
                              cardIcon={<div className="icon-rotation"><FontAwesomeIcon icon={faTicketAlt} /></div>}
                            />
                            <Dashcard
                              cardHead="No of Tickets"
                              cardbody={raisedinprogresscount}
                              cardfooter="Inprogress"
                              cardIcon={<div className="icon-rotation"><HourglassTopIcon /></div>}
                            />
                            <Dashcard
                              cardHead="No of Tickets"
                              cardbody={raisedcompletedcount}
                              cardfooter="Completed"
                              cardIcon={<div className="icon-rotation"><DoneAllIcon /></div>}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='copyright-com'>
                      <Copyrights />
                    </div>
                  </div>
                  <div className={activeTab === "profile" ? "tab-pane fade show active" : "tab-pane fade"} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                    <CustomerProfile customername={user} />
                  </div>
                  <div className={activeTab === "ticket" ? "tab-pane fade show active" : "tab-pane fade"} id="v-pills-tickets" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                    <Userticket tickets={tickets} />
                  </div>
                </div>
              </div>
            } />
          <FormAlert />

        </div>
      }
    </>
  )
}
export default withRouter(CustomerDashboard);


