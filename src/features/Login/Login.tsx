import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {loginTC} from "./auth-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

type ErrorType = {
    password?: string
    email?: string
}
export type FormType = {
    email: string
    password: string
    rememberMe: boolean
}
export const Login = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector<boolean>
        ((state)=> state.auth.isLoggedIn)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            //класическая валидация
            const errors: ErrorType = {}
            const regx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 4) {
                errors.password = 'Must be more 3 symbols'
            }
            if (!values.email) {
                errors.email = 'Required'
            } else if (!regx.test(values.email)) { //берем у объекта метод тест
                //метод тест возвращает булево значение соответствет ли строка выражению
                errors.email = 'Invalid email address'
            }
            return errors
            //если объект errors не будет пустым то в onSubmit мы не попадем
        },
        onSubmit: async(values) => {
            //диспатчим данные из формы
            const promise = await dispatch(loginTC(values))
            //в onSubmit прилетают values
            //values это наш объект initialValues
            formik.resetForm()
            //после отправки форма очищается
        },
    })

    // console.log(formik.errors)
    // console.log(formik.values)

    if(isLoggedIn) return <Navigate to={'/'}/>
    //const navigate = useNavigate()
    //используется если нужно прикрутить логику например редиректить при нажатии на кнопку
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            // будет смотреть был ли посещен инпут
                            //если был посещен и фокус потерян значит инпут трогали
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: "red"}}>{formik.errors.email}</div>}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                            // убираем name onChange onBlur value
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: "red"}}>{formik.errors.password}</div>}
                        <FormControlLabel label={'Remember me'} control={
                            <Checkbox
                                checked={formik.values.rememberMe}
                                {...formik.getFieldProps('rememberMe')}/>}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}

//атрибут onSubmit у него есть метод handleSubmit
//обработчик события
//handleSubmit вызывает onSubmit внутри formik
//важно указать name чтобы формик понял что к чему