//product component to use in HomeScreen

import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React from 'react';
import Rating from './Rating';

const Product = ( { product } ) => {
    
  return (
    <Card className='my-3 p-3 rounded card-home-screeen'  >
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} style={{ height: '256px',objectFit: 'cover'}} variant='top'></Card.Img>
        </Link>

        <Card.Body>     
            <Link to={`/product/${product._id}`}></Link>
            <Card.Title as='div' className='product-title'> 
                <strong> {product.name} </strong>
            </Card.Title>
            <Card.Text as='div' >
                <Rating value={product.rating} text={`${product.numReviews}`} />
            </Card.Text>
            <Card.Text as='h3' > 
                ${product.price}
            </Card.Text>


        </Card.Body>
    </Card>
    
  )
}

export default Product