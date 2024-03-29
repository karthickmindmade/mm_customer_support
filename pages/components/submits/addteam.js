import React, { useState, useEffect, useContext } from 'react';
import Axios from "axios";
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { CounterContext } from '../contex/adminProvider';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { renderEmail } from 'react-html-email';
import TeamCreatedBody from '../utils/teamCreatedBody';
import moment from 'moment';
const schema = yup.object().shape({
    Email: yup.string().required("*required").email(),
    Password: yup.string().required("*required").min(6),
    Phonenumber: yup.string().required("*required").max(10)
});

function Addteam() {
    const { setdialogformopen, setTesting, setshowvalue,Email } = useContext(CounterContext)
    const [loader, setloader] = useState(false);
    const [show, setshow] = useState('')
    var [addteam, setAddteam] = useState('');
    const Router = useRouter();
    const [show5, setshow5] = useState(false);
    const [login, setLogin] = useState();
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(schema),
    });
    const { errors } = formState;
    var email2=Email
    const addTeam = ({ Email, Password, Phonenumber }) => {
        const messageHtml2 = renderEmail(<TeamCreatedBody email={Email} password={Password} />)
        setloader(true)
        if(Email!=="" && Password!=="" && Phonenumber!=="" && addteam!==""){
            Axios.post(`https://mindmadetech.in/api/team/new`, {
            Email: Email,
            Password: Password,
            Team: addteam,
            Phonenumber: Phonenumber,
            CreatedOn: moment(new Date()).format('DD-MM-YYYY hh:mm A'),
            CreatedBy: window.localStorage.getItem('ad_email')
        }).then((response) => {
            if (response.data.statusCode === 400) {
                if (response.data.message === "Email already Exists!") {
                    setshow(response.data.message);
                    setloader(false);
                } else {
                    localStorage.setItem('updateclose', "close");
                    setTesting(true)
                    setshowvalue(1 + response.data.message);
                    setdialogformopen("true")
                    setloader(false);
                }

            } else {
                localStorage.setItem('updateclose', "close");
                setTesting(true)
                setshowvalue("Registered Successfully");
                setdialogformopen("true")
                setloader(false)
                email2.send({
                    Host: "mindmadetech.in",
                    Username: "_mainaccount@mindmadetech.in",
                    Password: "1boQ[(6nYw6H.&_hQ&",
                    To: Email,
                    From: "support@mindmade.in",
                    Subject: "MindMade Support",
                    Body: messageHtml2
                }).then(
                    message => console.log(message)
                )
            }
        })
            .catch((err) => { return err; })
        }else{
            setshow("Please select team");
            setloader(false);
        } 
    };

    useEffect(() => {
        setLogin(window.localStorage.getItem('loggedin'));
        if (window.localStorage.getItem('loggedin') === "false") {
            Router.push("/")
        } else if (window.localStorage.getItem('loggedin') === null) {
            Router.push("/")
        }
    }, []);

    return (
        <div>
            <div className="container mainbody">
                <div className="top-btn">
                    <div className='team-dropdown'>
                        <div className='team-list'>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="Design" onChange={(e) => setAddteam(e.target.value)} />
                                <label className="form-check-label" >Design</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="server" onChange={(e) => setAddteam(e.target.value)} />
                                <label className="form-check-label" >server</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="development" onChange={(e) => setAddteam(e.target.value)} />
                                <label className="form-check-label" >development</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="SEO" onChange={(e) => setAddteam(e.target.value)} />
                                <label className="form-check-label" >SEO</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="addform">
                    <form>
                        <div className="form-group">
                            <label className="label">Email<span>*</span></label>
                            <input className="form-input" name="Email" type="email" {...register('Email')} />
                            <p className="me-2 text-danger">{errors.Email?.message}</p>
                        </div>
                        <div className="form-group">
                            <label className="col label">Password<span>*</span></label>
                            <div className='login-input-password'>
                                <input className="form-input" type={show5 === true ? "text" : "password"} name='Password' {...register('Password')} />
                                <Button className='login-password-i' onClick={() => setshow5(!show5)}>{!show5 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</Button>
                            </div>
                            <p className="me-2 text-danger">{errors.Password?.message}</p>
                        </div>
                        <div className="form-group">
                            <label className="col label">Phonenumber<span>*</span></label>
                            <input className="form-input" name="Phonenumber" type="text" {...register('Phonenumber')} />
                            <p className="me-2 text-danger">{errors.Phonenumber?.message}</p>
                        </div>
                        <div className="row justify-content-center">
                            <div className='bottom-area'>
                                <p className="me-2 text-danger">{show}</p>
                                {loader === false ? <> <button type="submit" onClick={handleSubmit(addTeam)} className="btn2 float-end"> Add </button></> : <> <CircularProgress className="float-end" size={25} /></>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Addteam;