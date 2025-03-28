import React from 'react';
import Products from '../products';

const MotorsPage = () => {
    const products1=[
        {
            img:"/qb1.png",
            title:"4000W 90h Motor",
            sku:"13D74K44M",
            price:150.00
        },
        {
            img:"/qb1.png",
            title:"4000W 90h Motor",
            sku:"13D74K44M",
            price:150.00
        },
        {
            img:"/qb1.png",
            title:"4000W 90h Motor",
            sku:"13D74K44M",
            price:150.00
        },
    ]

    const products2=[
        {
            img:"/sotion.png",
            title:"5600rpm 3000W Motor",
            sku:"13D74K44M",
            price:150
        },
        {
            img:"/sotion.png",
            title:"5600rpm 3000W Motor",
            sku:"13D74K44M",
            price:150
        },
        {
            img:"/sotion.png",
            title:"5600rpm 3000W Motor",
            sku:"13D74K44M",
            price:150
        },
    ]


    return (
        <div>
            <MotorComponent title="QS Motors" products={products1}/>
            <MotorComponent title="Sotion Motors" products={products2}/>
        </div>
    );
};

export default MotorsPage;

const MotorComponent=({title,products})=>{
    return(
        <div>
            <div className="flex m-3 justify-between">
                <h1 className='text-3xl font-semibold'>{title}</h1>
                <button className='rounded-xl bg-orange-600 text-white p-3'>View All</button>
            </div>
            <Products products={products}/>
        </div>
    )
}