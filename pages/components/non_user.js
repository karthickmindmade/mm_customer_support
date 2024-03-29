import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { CounterContext } from "../components/contex/adminProvider";
import moment from 'moment';
import { renderEmail } from 'react-html-email'
import NonUserBody from './utils/nonUserBody';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
const schema = yup.object().shape({
    Companyname: yup.string().required("*required"),
    Clientname: yup.string().required("*required"),
    email: yup.string().required("*required").email(),
    Phonenumber: yup.string().required("*required").max(10),
    Password: yup.string().required("*required").min(6),
    DomainName: yup.string().required("*required"),
    Description: yup.string().required("*required"),
});
export default function ScrollDialog(props) {
    const { setTesting, setshowvalue, Email } = useContext(CounterContext);
    const [loader, setloader] = useState(false)
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [show5, setshow5] = useState(false);
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(schema),
    });
    const { errors } = formState;

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmitForm = ({ Companyname, Clientname, email, Phonenumber, Password, DomainName, Description }) => {
        setloader(true)
        const messageHtml = renderEmail(<NonUserBody name={Clientname} body={Companyname} />)

        Axios.post(`https://mindmadetech.in/api/unregisteredcustomer/new`, {
            Companyname: Companyname,
            Clientname: Clientname,
            Email: email,
            Phonenumber: Phonenumber,
            Password: Password,
            CreatedOn: moment(new Date()).format('DD-MM-YYYY hh:mm A'),
            DomainName: DomainName,
            Description: Description
        }).then((response) => {
            if (response.data.statusCode === 400) {
                setshowvalue(1 + response.data.message)
                setloader(false)
                setTesting(true)
            } else {
                setshowvalue("Registered Successfully")
                setloader(false)
                setOpen(false);
                setTesting(true)
                Email.send({
                    Host: "mindmadetech.in",
                    Username: "_mainaccount@mindmadetech.in",
                    Password: "1boQ[(6nYw6H.&_hQ&",
                    To: email,
                    From: "support@mindmade.in",
                    Subject: "MindMade Support",
                    Body: messageHtml
                }).then(
                    message => console.log(message)
                );
            }
        }).catch((err) => { return err; })
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        setTesting(false)
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div className='z-index-99'>
            <a className='mt-3' onClick={handleClickOpen('paper')}>Click Here</a>
            <Dialog
                open={open}

                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title"><div className='form-title'>RAISE YOUR TICKETS</div></DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <div className="addform">
                            <form>

                                <div className="form-group">
                                    <label className="label">Company Name<span>*</span></label>
                                    <input className="issue-form-input" name="Companyname" type="text" {...register('Companyname')} />
                                    <p className="me-2 text-danger">{errors.Companyname?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="label"> Client Name<span>*</span></label>
                                    <input className="issue-form-input" name="Clientname" type="text" {...register('Clientname')} />
                                    <p className="me-2 text-danger">{errors.Clientname?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="col label">Email ID<span>*</span></label>
                                    <input className="issue-form-input" name="email" type="text" {...register('email')} />
                                    <p className="me-2 text-danger">{errors.email?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="col label">Phonenumber<span>*</span></label>
                                    <input className="issue-form-input" name="Phonenumber" type="text" {...register('Phonenumber')} />
                                    <p className="me-2 text-danger">{errors.Phonenumber?.message}</p>
                                </div>

                                <div className="form-group">
                                    <label className="col label">Password<span>*</span></label>
                                    <div className='login-input-password'>
                                        <input className="issue-form-input" type={show5 === true ? "text" : "password"} name='Password' {...register('Password')} />
                                        <Button className='login-password-i' onClick={() => setshow5(!show5)}>{!show5 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</Button>
                                    </div>

                                    <p className="me-2 text-danger">{errors.Password?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="label">Domain Name<span>*</span></label>
                                    <input className="issue-form-input" name="DomainName" rows="4" cols="50" maxLength="200" {...register('DomainName')} />
                                    <p className="me-2 text-danger">{errors.DomainName?.message}</p>
                                </div>

                                <div className="form-group">
                                    <label className="label">Description<span>*</span></label>
                                    <textarea className="issue-form-input" name="Description" rows="4" cols="50" maxLength="200" {...register('Description')} />
                                    <p className="me-2 text-danger">{errors.Description?.message}</p>
                                </div>
                            </form>

                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {loader === false ? <>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit(handleSubmitForm)}>Submit</Button>
                    </> : <> <CircularProgress size={30} /></>}

                </DialogActions>
            </Dialog>
        </div>
    );
}