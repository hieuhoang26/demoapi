import { useNavigate, useParams } from 'react-router-dom';
import { GetBookDetailByIdApi, GetReviewApi, GetRateApi, GetShopByBookIdApi } from "../API/BookStoreApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import './BookDetail.scss'
import { useAuth } from '../Sercutiry/AuthContext';
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
} from 'mdb-react-ui-kit';
function BookDetailComponent() {
    let Auth = useAuth()
    let Navigate = useNavigate()
    let { id } = useParams()
    let [bookData, setBookData] = useState({})
    let [bookImages, setBookImages] = useState([])
    let [reviewData, setReviewData] = useState([])
    let [rateData, setRateData] = useState({})
    let [bookNumber, setBookNumber] = useState(1)
    let [shop, setShop] = useState({})
    let [isloadshop, setIsLoadShop] = useState(false)
    const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }

    let retrieveBook = async () => {
        try {
            let response1 = await GetBookDetailByIdApi(id, headers)
            setBookData(response1.data)
            setBookImages(response1.data.images)
            let response2 = await GetReviewApi(id, 0, headers)
            setReviewData(response2.data)

            let response3 = await (GetRateApi(id, headers))
            setRateData(response3.data)

            let response4 = await (GetShopByBookIdApi(id, headers))
            setShop(response4.data)
            setIsLoadShop(true)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        retrieveBook()
    }, [])

    let handleMinusBookNumber = () => {
        if (bookNumber > 1) {
            setBookNumber(bookNumber - 1)
        }
    }
    let handlePlusBookNumber = () => {
        setBookNumber(bookNumber + 1)
    }
    let handleAddCart = () => {
        if (Auth.isAuthenticated) {
            if (localStorage.getItem("BookIdCartList") == null) {
                let BookIdCartList = []
                BookIdCartList.push({ "bookId": id, "title": bookData.title, "price": bookData.price, "bookNumber": bookNumber, "shopId": bookData.shopId, "shopName": bookData.shopName })
                localStorage.setItem("BookIdCartList", JSON.stringify(BookIdCartList))
                toast.success("Add Book To Cart Success!")
            } else {
                let ExistBookIdCartList = JSON.parse(localStorage.getItem("BookIdCartList"))
                ExistBookIdCartList.push({ "bookId": id, "title": bookData.title, "price": bookData.price, "bookNumber": bookNumber, "shopId": bookData.shopId, "shopName": bookData.shopName })
                localStorage.setItem("BookIdCartList", JSON.stringify(ExistBookIdCartList))
                toast.success("Add Book To Cart Success!")
            }
        }
        else {
            toast.warn("Please Login!")
            Navigate("/login")
        }
    }

    let handleViewShop = () => {
        Navigate(`/viewshopdetail/${shop.id}`)
    }
    //tab-pane
    const [basicActive, setBasicActive] = useState('description');

    const handleBasicClick = (value) => {
        if (value === basicActive) {
            return;
        }

        setBasicActive(value);
    };
    return (
        <div className='bookdetail'>
            <div className="book">
                <div className="image">
                    {bookImages.map((image) => {
                        console.log(bookImages)
                        return <img src={`https://bookstore.io.vn${image.substring(image.indexOf("/images/"))}`} alt='' key={image} />;
                    })}
                </div>
                <div className="info">
                    <table>
                        <tr>
                            <td className='title'>{bookData.title}</td>
                        </tr>
                        <tr>
                            <td className='label'>author:</td>
                            <td>{bookData.author}</td>
                        </tr>
                        <tr>
                            <td className='label'>category:</td>
                            <td>{bookData.category}</td>
                        </tr>
                        <tr>
                            <td className='label'>price:</td>
                            <td className='price'>{bookData.price}$</td>
                        </tr>
                        <tr>
                            <td className='label'>current quantity:</td>
                            <td>{bookData.currentQuantity}</td>
                        </tr>
                        <tr>
                            <td className='label'>soldQuantity:</td>
                            <td>{bookData.soldQuantity}</td>
                        </tr>
                        <tr>
                            <td className='label'>number:</td>
                            <td className='number'>
                                <li onClick={handleMinusBookNumber}>-</li>
                                <li>{bookNumber}</li>
                                <li onClick={handlePlusBookNumber}>+</li>
                            </td>
                        </tr>
                    </table>
                    <div className='button'>
                        <button onClick={handleAddCart}>Add Cart</button>
                    </div>
                </div>
            </div>
            <div className='more'>
                <div className="book-detail">
                    <table>
                        <tr>
                            <td className='one'>Publisher</td>
                            <td className='two'>{bookData.publisher}</td>
                        </tr>
                        <tr>
                            <td className='one'>Publication Date</td>
                            <td className='two'>{bookData.publicationDate}</td>
                        </tr>
                        <tr>
                            <td className='one'>Dimension</td>
                            <td className='two'>{bookData.dimension}</td>
                        </tr>
                        <tr>
                            <td className='one'>Cover Type</td>
                            <td className='two'>{bookData.coverType}</td>
                        </tr>
                        <tr>
                            <td className='one'>Number Of Pages</td>
                            <td className='two'>{bookData.numberOfPages}</td>
                        </tr>
                        <tr>
                            <td className='one'>Publishing House</td>
                            <td className='two'>{bookData.publishingHouse}</td>
                        </tr>
                    </table>
                </div>
                <div className='shop'>
                    <div className='shop-image'>
                        {isloadshop && <img src={`https://bookstore.io.vn${shop.shopLogoPath.substring(shop.shopLogoPath.indexOf("/images/"))}`}></img>}
                    </div>
                    <div className='shop-info'>
                        <div className='detail'>
                            <li className='name'>{shop.shopName}</li>
                            <li className='address'>(.) {shop.shopAddress}</li>
                            <li><button onClick={handleViewShop}>View Shop</button></li>
                        </div>
                    </div>
                </div>
            </div>

            <MDBTabs className='mt-3'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick('description')} active={basicActive === 'description'} className='font-weight-bold'>
                        Description
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick('review')} active={basicActive === 'review'} className='font-weight-bold'>
                        Review
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            <MDBTabsContent>
                <MDBTabsPane open={basicActive === 'description'}>
                    <div className='description'>
                        <div className='content '>
                            {bookData.description}
                        </div>
                    </div>
                </MDBTabsPane>
                <MDBTabsPane open={basicActive === 'review'}>
                    <div className="comment">
                        {
                            reviewData.map((item) => (
                                <div className="view-comment">
                                    <table>
                                        <tr>
                                            <td className='name'>User:</td>
                                            <td className='content'>{item.username}</td>
                                        </tr>
                                        <tr>
                                            <td className='name'>Comment:</td>
                                            <td className='content'>{item.comment}</td>
                                        </tr>
                                    </table>
                                </div>
                            ))
                        }
                    </div>
                </MDBTabsPane>
            </MDBTabsContent>
            

        </div>

    )
}

export default BookDetailComponent;