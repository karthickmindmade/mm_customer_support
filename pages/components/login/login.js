import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.css";
import Axios from 'axios';
import { CounterContext } from '../contex/adminProvider';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import Sidebody from '../common/login&singupSidebody';
import ScrollDialog from '../non_user';
import FormDialog from '../common/dialogsform';
import { Typography } from '@mui/material';
import ForgetPasswordBody from '../utils/forgetPasswordBody';
import { renderEmail } from 'react-html-email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6)
});
export default function Login1() {
  var generator = require('generate-password');
  const { setTesting, setshowvalue, setdialogformopen, Email } = useContext(CounterContext)
  const router = useRouter();
  const [userlogin, setUserlogin] = useState('');
  const [show5, setshow5] = useState(false);
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const adminLogin = ({ email, password }) => {

    setUserlogin(email);


    Axios.post(`https://mindmadetech.in/api/login/validate`, {
      Email: email,
      Password: password,
    }).then((response) => {
      if (response.data.statusCode === 400) {
        setTesting(true)
        setshowvalue(1 + response.data.message);
      } else {
        if (response.data.type === "admin") {
          localStorage.setItem('ad_email', email);
          router.push({
            pathname: `/components/dash/admindashboard`,
          });
          localStorage.setItem('loggedin', true);
          localStorage.setItem('activeTab', "Dashboard");
          setTesting(true)
          setshowvalue("Logged in successfully");
        } else if (response.data.type === "team") {
          localStorage.setItem('tm_name', email);
          router.push({
            pathname: `/components/dash/teamdashboard`,
          });
          localStorage.setItem('loggedin', true);
          localStorage.setItem('activeTab', "Dashboard");
          setTesting(true)
          setshowvalue("Logged in successfully");
        } else if (response.data.type === "customer") {
          localStorage.setItem('clientname', email);
          localStorage.setItem('loggedWho', "customer");
          router.push({
            pathname: `/components/dash/customerdashboard`,
          });
          localStorage.setItem('loggedin', true);
          localStorage.setItem('activeTab', "Dashboard");
          setTesting(true)
          setshowvalue("Logged in successfully");
        }



      }
    }).catch((err) => { return err; })
  };
  const onBackButtonEvent = (e) => {
    e.preventDefault();
    router.push("/");
  };
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem('user', userlogin);
  }, [userlogin]);
  const [forgetValidate, setforgetValidate] = useState(false)
  const [forgetValue, setforgetValue] = useState()

  //forgetpassort function

  const [display, setdisplay] = useState(false)
  function forgetpassword() {
    Axios.get(`https://mindmadetech.in/api/forgotpassword/verify_email/${forgetValue}`, {

    }).then((response) => {
      if (response.data.statusCode === 400) {
        setforgetValidate(<p className='red'>{response.data.message}</p>)
      } else {
        var password = generator.generate({
          length: 10,
          numbers: true,
          symbols: true
        });

        Axios.put(`https://mindmadetech.in/api/forgotpassword/reset_password`, {
          Email: forgetValue,
          Password: password,
        }).then((response) => {
          if (response.data.statusCode === 400) {

            setforgetValidate(<p className='red'>{response.data.message}</p>)
          } else {
            setdisplay(true)
            setforgetValidate(<p className='forget-status'>*You will get new password through email associated with your account<br /> within two minutes</p>)
            const messageHtml = renderEmail(<ForgetPasswordBody password={password} />)
            Email.send({
              Host: "mindmadetech.in",
              Username: "_mainaccount@mindmadetech.in",
              Password: "1boQ[(6nYw6H.&_hQ&",
              To: forgetValue,
              From: "support@mindmade.in",
              Subject: "MindMade Support",
              Body: messageHtml
            }).then(
              message => console.log(message)
            );
          }
        }).catch((err) => { return err; })
      }
    }).catch((err) => { return err; })
  }
  return (
    <div className="login-page">
      <div>
        <div className="login-body">
          <div className="left-body">
            <div className="form login">
              <div className='sublogin'>
                <div className='login-header'>
                  <h1>LOGIN</h1>
                </div>
                <form>
                  <div className="form-group ">
                    <label className="label">Email<span>*</span></label>
                    <input className="form-input" name="email" type="email"  {...register('email')} />
                    <p className="me-2 text-danger">{errors.email?.message}</p>
                  </div>
                  <div className="form-group log">
                    <label className="label">Password<span>*</span></label>
                    <div className='login-input-password'>
                        <input className="form-input" type={show5 === true ? "text" : "password"} name='password' {...register('password')} />
                        <Button className='login-password-i' onClick={() => setshow5(!show5)}>{!show5 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</Button>
                    </div>
                    <p className="me-2 text-danger">{errors.password?.message}</p>
                  </div>
                  <div className="form-group mt-2 log">
                    <Button className="btn" type="submit" onClick={handleSubmit(adminLogin)}><a className="nav-link">Login</a></Button>
                  </div>
                  <div className='form-group '>
                    <FormDialog
                      dialogbody_className="forget-body"
                      className="forget-text float-end mt-1"
                      closebuttonsec="display-non"
                      dialogtitle="Forgot Password?"
                      dialogbody={
                        <div>
                          <Typography variant="h5" className='text-center mm-color mb-2'>
                            Reset Your Password
                          </Typography>
                          <Typography variant="p" className='mt-2'>
                            Please enter your Email id below. We will send <br />
                            New password  to the email address <br />
                            associated with your account.
                          </Typography>
                          <div className="form-group mt-3 mb-2 flex">
                            <label className="forget-label width-25">Email ID</label>
                            <input className="forget-input" name="email" type="text" onChange={(e) => setforgetValue(e.target.value)} />
                          </div>
                          <div>{forgetValidate}</div>
                          {display === true ? <></> : <button className='forget-button' onClick={forgetpassword}>SEND PASSWORD</button>}

                          <Button className='w-100' onClick={() => setdialogformopen("true")&setforgetValidate("")&setdisplay(false)&setforgetValue('')} >{display === true ? "Ok" : "Cancel"}</Button>
                        </div>
                      }
                    />
                  </div>
                  <div className='form-group'> 
                    <div className='login-Unregistered'>
                      <p className='flex'>Don&apos;t have an account ?<ScrollDialog /></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="right-body">
            <Sidebody />
          </div>
        </div>
      </div>
    </div>
  )
}
