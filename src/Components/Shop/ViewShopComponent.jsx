import { useNavigate, useParams } from "react-router-dom";
import { GetShopById, GetBookForShopApi } from "../API/BookStoreApi";
import { useEffect, useState } from "react";
import './ViewShopComponent.scss';

function ViewShopComponent() {
    let Navigate = useNavigate()
    let { shopId } = useParams()
    let [shopData, setShopData] = useState({})
    let [bookData, setBookData] = useState([])
    let [shopLogo, setShopLogo] = useState("")
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
    let RetrieveData = async () => {
        try {
            let response1 = await GetShopById(shopId, headers)
            setShopData(response1.data)
            setShopLogo(response1.data.shopLogoPath.substring(response1.data.shopLogoPath.indexOf("/images/")))
            let response2 = await GetBookForShopApi(shopId, headers)
            setBookData(response2.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        RetrieveData()
    }, [])

    let handleViewDetail = (bookId) => {
        Navigate(`/bookdetail/${bookId}`)
    }
    return (
        <>
            <div className="info-shop">
                <div className="image-shop">
                    <img src={`https://bookstore.io.vn${shopLogo}`} />
                </div>
                <div className="detail">
                    <table>
                        <tr>
                            <td>{shopData.shopName}</td>
                        </tr>
                        <tr>
                            <td>Address:</td>
                            <td>{shopData.shopAddress}</td>
                        </tr>
                        <tr>
                            <td>Email Contact:</td>
                            <td>{shopData.contactEmail}</td>
                        </tr>
                        <tr>
                            <td>Phone Contact:</td>
                            <td>{shopData.contactPhone}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div className="label">
                <label className="font-weight-bold text-uppercase ">Shop Books</label>
            </div>
            <div className="books">
                {bookData.map((book) => (
                    <div className='item' onClick={() => handleViewDetail(book.id)}>
                        <div className='image'>
                            <img className='image-item' src={`https://bookstore.io.vn${book.imagePath.substring(book.imagePath.indexOf("/images/"))}`} />
                        </div>
                        <div className='info'>
                            <div className='title'>{book.title}</div>
                            <div className='price'>{book.price} $</div>
                            <div className='sold'>Sold: {book.soldQuantity}</div>
                        </div>
                    </div>
                ))
                }
            </div>
        </>
    )
}

export default ViewShopComponent;