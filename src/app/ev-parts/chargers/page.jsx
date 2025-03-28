import Products from "../products";

export default function Page(){
    const products=[
        {
            img:"/charger1.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger2.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger3.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger4.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger5.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger6.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger7.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger8.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/charger9.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
    ]
    return <>
        <Products products={products}/>
    </>
}