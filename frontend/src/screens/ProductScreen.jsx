import React, {  useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import products from '../products';
import { Link } from 'react-router-dom';
import { Form, Row, Col , Image, ListGroup, Card, Button,  } from 'react-bootstrap' ;
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
// import axios from  'axios';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import {addToCart} from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';


const ProductScreen = () => {
    
    const { id: productId } =  useParams();
    // console.log(productId);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    
    const [rating, setRating] = useState(0);
    const [comment, setComment ] = useState('');

    

    //replaced by redux
    // //product state for the single product to be fetched
    // const [product, setProduct ] = useState([]);

    // // runs on change to productId 
    // useEffect( () => {
    //     const fetchProduct = async() => {
    //         const {data} = await axios.get(`/api/products/${ProductId}`);
    //         setProduct(data);
    //     }

    //     fetchProduct(); //call 

    // }, [ProductId]); //dependency productId

    
    // const product = products.find((p) => p._id === ProductId);
    // console.log(product);

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery( productId );
    

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
    
    
    const { userInfo } = useSelector((state) => state.auth);
    
    const addToCartHandler = () => {
        dispatch( addToCart({ ...product, qty }) );
        navigate('/cart');
    }
   
    

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                productId,
                rating,
                comment
            }).unwrap();
            refetch();
            toast.success('Review Submitted!');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

  return (
    <>

        <Link className='btn btn-light my-3 btn1' to='/' >GO Back</Link>
        { isLoading ? ( <Loader /> ) : error ? (<Message variant='danger'>{error?.data?.Message || error.error }</ Message>) : (
        <> 
        <Meta title={product.name}/>
        <Row>
            <Col md={5} >
                <Image src={product.image} style={{ height:'300px', width: '100%', objectFit: 'cover' }} className='img1' alt={product.name} fluid />
            </Col>
            <Col md={4} >
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>
                    Price: ${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                    Price: ${product.description}
                </ListGroup.Item>
            </ListGroup>
            </Col>
            <Col md={3} >
                <Card className='price-card'>
                    <ListGroup variant='flush' >
                        <ListGroup.Item className='card-ls-group'>
                            <Row>
                                <Col>
                                    Price:
                                </Col>
                                <Col>
                                    <strong>{ product.price }</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='card-ls-group'>
                            <Row>
                                <Col>
                                    Status:
                                </Col>
                                <Col>
                                    <strong>
                                        { product.countInStock > 0 ? 'In Stock' : 'Out of Stock' } 
                                    </strong>
                                </Col>
                            </Row>
                        </ListGroup.Item >

                        {
                            product.countInStock > 0 && (
                                <ListGroup.Item className='card-ls-group'>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col>
                                            <Form.Control
                                                as='select'
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}  >
                                                    {[...Array(product.countInStock).keys()].map((x) => (<option key={ x + 1} value={ x + 1}> {x + 1}
 
                                                    </option>)) }
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )
                        }

                        <ListGroup.Item className='card-ls-group'>
                            <Button className='btn-block btn1' type='button' disabled={ product.countInStock === 0 } 
                            onClick={addToCartHandler}>
                        Add to Cart
                        </Button>
                        </ListGroup.Item>
                        
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row className='review'>
            <Col md={6}>
                <h2>Reviews</h2>
                { product.reviews.length === 0 && <Message variant='primary'>No Reviews</Message>}
                <ListGroup variant='flush'>
                    { product.reviews.map(review  => (
                        <ListGroup.Item key={review._id}>
                            <strong>{ review.name }</strong>
                            <Rating value={ review.rating } />
                            <p>{ review.createdAt.substring(0, 10) }</p>
                            <p>{ review.comment }</p>
                        </ListGroup.Item>    
                    )
                )
                }
                <ListGroup.Item>
                    <h2>write a Customer review</h2>
                    { loadingProductReview && <Loader /> }
                    { userInfo ? ( 
                    <Form onSubmit={ submitHandler }>
                        <Form.Group controlId="rating" className='my-2'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as='select' 
                            className='form-select'
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            >
                                <option value="">Select . . .</option>
                                <option className='form-select' value="1">1 - Poor.</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='comment' className='my-2'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as='textarea'
                                row='3'
                                value = {comment}
                                onChange={(e) => setComment(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Button 
                            className='btn1'
                            disabled={ loadingProductReview }
                            type='submit'
                            variant='primary'
                        >Submit</Button>
                    </Form> ) : ( <Message >Please
                    <Link to='/login'> login </Link> to write a review{ ' ' }</Message> )}
                </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>

    </>) }
        
    </>
  )
}

export default ProductScreen