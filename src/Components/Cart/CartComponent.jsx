import { useEffect, useState } from "react";
import { GetBookByIdApi, CreateOrders } from "../API/BookStoreApi";
import './Cart.scss';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CartComponent() {
    let Navigate = useNavigate()
    let CartList = JSON.parse(localStorage.getItem("BookIdCartList"))
    let [cartData, setCartData] = useState([])
    let [markDelete, setMarkDelete] = useState(false)
    let [bookNumberChange, setBookNumberChange] = useState(false)
    let [buy, setBuy] = useState(false)
    let [ordersData, setOrdersData] = useState([])
    let orders = []
    let listBoughtBookId = []
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }

    useEffect(() => {
        retrieveData()
    }, [markDelete, bookNumberChange])

    let retrieveData = async () => {
        let fetchPromises = CartList.map(async (element) => {
            let response = await GetBookByIdApi(element.bookId, headers)
            return response.data
        })
        const bookDataArray = await Promise.all(fetchPromises);
        setCartData(bookDataArray)
    }

    let handleDelete = (index) => {
        const updatedCartList = [...CartList]
        updatedCartList.splice(index, 1)
        localStorage.setItem("BookIdCartList", JSON.stringify(updatedCartList))
        setCartData(cartData.filter((_, i) => i !== index));
        setMarkDelete(!markDelete)
    }

    let handleSelect = (event, index) => {
        var foundOrder = false;
        if (event.target.checked) {
            if (orders.length === 0) {
                var order = {
                    userId: sessionStorage.getItem("userId"),
                    shopId: CartList[index].shopId,
                    shopName: CartList[index].shopName,
                    totalPrice: CartList[index].price * CartList[index].bookNumber,
                    address: "",
                    orderItems: [
                        {
                            bookName: CartList[index].title,
                            bookId: CartList[index].bookId,
                            quantity: CartList[index].bookNumber
                        }
                    ]
                }
                orders.push(order)
            }
            else {
                orders.forEach((order) => {
                    if (order.shopId === CartList[index].shopId) {
                        order.totalPrice += CartList[index].price * CartList[index].bookNumber
                        order.orderItems.push({
                            bookName: CartList[index].title,
                            bookId: CartList[index].bookId,
                            quantity: CartList[index].bookNumber
                        })
                        foundOrder = true
                    }
                })
                if (!foundOrder) {
                    var order = {
                        userId: sessionStorage.getItem("userId"),
                        shopId: CartList[index].shopId,
                        shopName: CartList[index].shopName,
                        totalPrice: CartList[index].price * CartList[index].bookNumber,
                        address: "",
                        orderItems: [
                            {
                                bookName: CartList[index].title,
                                bookId: CartList[index].bookId,
                                quantity: CartList[index].bookNumber
                            }
                        ]
                    }
                    orders.push(order)
                }
            }
        }
        else {
            orders.forEach((order) => {
                if (order.shopId === CartList[index].shopId) {
                    var i = 0;
                    order.orderItems.forEach((orderItem) => {
                        if (orderItem.bookId === CartList[index].bookId) {
                            order.totalPrice -= CartList[index].price * CartList[index].bookNumber
                            order.orderItems.splice(i, 1)
                        }
                        i++;
                    })
                }
            })
        }
        orders = orders.filter((order) => order.orderItems.length > 0)
    }

    let handleBuy = () => {
        setOrdersData(orders)
        setBuy(true)
    }

    let handleAddress = (event, index) => {
        ordersData[index].address = event.target.value
    }

    let handlePhoneNumber = (event, index) => {
        // update later
    }

    let handleMinusBookNumber = (index) => {
        if (CartList[index].bookNumber > 1) {
            CartList[index].bookNumber -= 1;
            const updatedCartList = [...CartList]
            localStorage.setItem("BookIdCartList", JSON.stringify(updatedCartList))
            setBookNumberChange(!bookNumberChange)
        }
    }

    let handlePlusBookNumber = (index) => {
        CartList[index].bookNumber += 1;
        const updatedCartList = [...CartList]
        localStorage.setItem("BookIdCartList", JSON.stringify(updatedCartList))
        setBookNumberChange(!bookNumberChange)
    }

    let handleConfirm = () => {
        try {
            ordersData.forEach(async (orderData) => {
                try {
                    await CreateOrders(orderData, headers)
                }
                catch (error) {
                    console.log(error)
                }
            })
            toast.success("Order Success!")
            setBuy(false)
            // xoa cac xach da duoc mua khoi gio hang;
            ordersData.forEach((orderData) => {
                orderData.orderItems.forEach((orderItem) => listBoughtBookId.push(orderItem.bookId))
            })
            // mark list delete index
            listBoughtBookId.forEach((id) => {
                CartList.forEach((item, index) => {
                    if (item.bookId === id)
                        CartList.splice(index, 1)
                })
            })
            const updatedCartList = [...CartList]
            localStorage.setItem("BookIdCartList", JSON.stringify(updatedCartList))
            Navigate("/account")

        }
        catch (error) {
            toast.error("System Error, Try Again!")
        }
    }

    return (
        <>
            <div className="cart">
                <div className="cart-item-container">
                    <table className="table tabble-border">
                        <thead>
                            <tr>
                                <th className="font-weight-bold">Book</th>
                                <th className="font-weight-bold">Name</th>
                                <th className="font-weight-bold">Price</th>
                                <th className="font-weight-bold">Quantity</th>
                                <th className="font-weight-bold">Status</th>
                                <th className="font-weight-bold">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartData.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row" >
                                        <div >
                                            <img src={`https://bookstore.io.vn${item.imagePath.substring(item.imagePath.indexOf("/images/"))}`} style={{width: "80px",height : "80px"}} alt="Product" />
                                        </div>
                                    </th>
                                    <td>{item.title}</td>
                                    <td>{item.price} $</td>
                                    <td>
                                        <div className="number">
                                            <div className="flex">
                                                <span onClick={() => handleMinusBookNumber(index)} className="p-2 rounded-circle bg-input"><i class="bi bi-dash"></i></span>
                                                <span className="p-2 rounded-circle bg mx-1 ">{CartList[index].bookNumber}</span>
                                                <span onClick={() => handlePlusBookNumber(index)} className="p-2 rounded-circle bg-input"><i className="bi bi-plus"></i></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="checkbox" onChange={(event) => handleSelect(event, index)} />
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(index)} className="p-2 rounded-circle bg-input inline"><i class="bi bi-x"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="control">
                    <div>
                        <button onClick={handleBuy} className="btn btn-primary hover">Buy Selected</button>
                    </div>
                </div>
            </div>
            {buy &&
                <div className="bill">
                    {
                        ordersData.map((order, index) => (
                            <div key={index} className="bill-item">
                                <span>Bill</span>
                                {
                                    order.orderItems.map((orderItem) => (
                                        <div> Book: {orderItem.bookName} -  Quantity: {orderItem.quantity}</div>
                                    ))
                                }
                                <div>Total Price: {order.totalPrice}</div>
                                <div>Shop: {order.shopName}</div>
                                <table>
                                    <tr>
                                        <td>Address</td>
                                        <td>
                                            <input type="text" onChange={(event) => handleAddress(event, index)}></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>PhoneNumber</td>
                                        <td>
                                            <input type="text" onChange={(event) => handlePhoneNumber(event, index)}></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Payment Type</td>
                                        <td>
                                            <input type="text" value="fresh money"></input>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        ))
                    }
                    <div><button onClick={handleConfirm}>Confirm</button></div>
                </div>
            }
        </>
    )
}

export default CartComponent;