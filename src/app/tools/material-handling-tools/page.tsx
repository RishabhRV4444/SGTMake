import Products from "@/app/tools/products";
export default function Page(){
    const products=[
        {
            img:"/hammer6.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/hammer5.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/hammer4.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/hammer3.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/hammer2.png",
            title:"5 in 1 Ratchet bundle",
            sku:"13D74K44M",
            price:155
        },
        {
            img:"/hammer1.png",
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