import Products from "@/app/tools/products";
export default function Page(){
    const products=[
        {
            img:"/striper3.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/striper2.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/striper4.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/striper6.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/striper1.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/striper5.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/xx.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/xx.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/xx.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/xx.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
    ]
    return <>
        <Products products={products}/>
    </>
}