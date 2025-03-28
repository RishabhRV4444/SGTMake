import Products from "@/app/tools/products";
export default function Page(){
    const products=[
        {
            img:"/tap1.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/tap2.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/tap3.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/tap4.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/tap5.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/tap6.png",
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