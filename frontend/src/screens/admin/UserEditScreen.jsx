import React,  { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, FormGroup } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast }  from 'react-toastify';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';


const UserEditScreen = () => {

    const { id: userId } = useParams();

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState(0);
    const [ isAdmin, setIsAdmin ] = useState(false);

    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery
    ( userId );

    const [ updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => { 
        if( user ) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        } 
     }, [ user ]);

     const submitHandler = async (e) => {
        
        e.preventDefault();

        try {
            await updateUser({ userId, name, email, isAdmin});
            toast.success('User updated Successfully');
            refetch();
            navigate('/admin/userList');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
     }


  return ( 
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
            Go Back
        </Link>
        <FormContainer> 
            <h1>Edit User</h1>
            { loadingUpdate && <Loader /> }
            { isLoading ? ( <Loader /> ) : ( error ? ( <Message variant='danger' /> ) : ( 
                <Form onSubmit={ submitHandler }>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Name </Form.Label>
                        <Form.Control
                            type='text'    
                            placeholder='Enter name'
                            value={ name }
                            onChange={ (e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='my-2'>
                        <Form.Label>Email </Form.Label>
                        <Form.Control
                            type='text'    
                            placeholder='Enter Email'
                            value={ email }
                            onChange={ (e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <FormGroup controlId='isAdmin' className='my-2' >
                        <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked= { isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        >

                        </Form.Check>
                    </FormGroup>
                    
                    <Button variant='primary' type='submit' className='my-2'>Update User</Button>

                </Form> 
            ) )}
        </FormContainer>
    </>
  )
}

export default UserEditScreen;