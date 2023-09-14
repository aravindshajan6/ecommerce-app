import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import {  FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from  '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';


const ProductListScreen = () => {

    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch} = useGetProductsQuery({ pageNumber });
    console.log(data);
    // console.log('data.pages:', data.pages);
    // console.log('data.page:', data.page);
    // console.log('pageNumber:', pageNumber);

    const [ createProduct, { isLoading: loadingCreate } ] = useCreateProductMutation();
    
    const [ deleteProduct, { isLoading: loadingDelete } ] = useDeleteProductMutation();

    const deleteHandler = async ( id ) =>{
        if(window.confirm('Are you sure ?')) {
            try {
                await deleteProduct(id);
                toast.success('Product Deleted');
                refetch();

            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        }
    }

    const createProductHandler = async () => {
        if( window.confirm(`Create a new Product ? `) ) {
            try {
                await createProduct();
                refetch();
                toast.success('New product created !')
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col  className='text-end'>
                <Button className="btn-sm m-3" onClick={ createProductHandler }>
                    <FaEdit />Create Product
                </Button>
            </Col>
        </Row>
        
        { loadingCreate && <Loader /> }
        { loadingDelete && <Loader /> }

        {isLoading ? ( <Loader /> ) : ( error ?  ( <Message variant='danger' >{ error }</Message> ) : ( 
            <>
                <Table striped bordered hover responsive className='table-sm table-responsive-md mt-2'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>NAME</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.products.map((product) => (
                            <tr key={ product._id }>
                                <td>{ product._id }</td>
                                <td>{ product.name }</td>
                                <td>{ product.price}</td>
                                <td>{ product.category }</td>
                                <td>{ product.brand }</td>
                                <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='primary' className='btn-sm mx-2'>
                                                <FaEdit />
                                            </Button> 
                                        </LinkContainer>
                                        <Button variant='danger' style={{ color: 'white'}}className='btn-sm mx-2' onClick={ () => deleteHandler(product._id) }>
                                                <FaTrash />
                                        </Button>
                                </td>
                            </tr>
                         )) 
                        }
                    </tbody>
                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
            </>
        ) )  }
    </>
  )
}

export default ProductListScreen