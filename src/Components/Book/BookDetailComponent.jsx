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

        // <div className='bookdetail'>
        //     <div className="book">
        //         <div className="image">
        //             {bookImages.map((image) => {
        //                 console.log(bookImages)
        //                 return <img src={`https://bookstore.io.vn${image.substring(image.indexOf("/images/"))}`} alt='' key={image} />;
        //             })}
        //         </div>
        //         <div className="info">
        //             <table>
        //                 <tr>
        //                     <td className='title'>{bookData.title}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='label'>author:</td>
        //                     <td>{bookData.author}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='label'>category:</td>
        //                     <td>{bookData.category}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='label'>price:</td>
        //                     <td className='price'>{bookData.price}$</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='label'>current quantity:</td>
        //                     <td>{bookData.currentQuantity}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='label'>soldQuantity:</td>
        //                     <td>{bookData.soldQuantity}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='label'>number:</td>
        //                     <td className='number'>
        //                         <li onClick={handleMinusBookNumber}>-</li>
        //                         <li>{bookNumber}</li>
        //                         <li onClick={handlePlusBookNumber}>+</li>
        //                     </td>
        //                 </tr>
        //                 <tr>
        //                     <td className='button'><button onClick={handleAddCart}>Add Cart</button></td>
        //                 </tr>
        //             </table>
        //         </div>
        //     </div>
        //     <div className='more'>
        //         <div className="book-detail">
        //             <table>
        //                 <tr>
        //                     <td className='one'>Publisher</td>
        //                     <td className='two'>{bookData.publisher}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='one'>Publication Date</td>
        //                     <td className='two'>{bookData.publicationDate}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='one'>Dimension</td>
        //                     <td className='two'>{bookData.dimension}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='one'>Cover Type</td>
        //                     <td className='two'>{bookData.coverType}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='one'>Number Of Pages</td>
        //                     <td className='two'>{bookData.numberOfPages}</td>
        //                 </tr>
        //                 <tr>
        //                     <td className='one'>Publishing House</td>
        //                     <td className='two'>{bookData.publishingHouse}</td>
        //                 </tr>
        //             </table>
        //         </div>
        //         <div className='shop'>
        //             <div className='shop-image'>
        //                 {isloadshop && <img src={`https://bookstore.io.vn${shop.shopLogoPath.substring(shop.shopLogoPath.indexOf("/images/"))}`}
        //                 ></img>}
        //             </div>
        //             <div className='shop-info'>
        //                 <div className='detail'>
        //                     <li className='name'>{shop.shopName}</li>
        //                     <li className='address'>(.) {shop.shopAddress}</li>
        //                     <li><button onClick={handleViewShop}>View Shop</button></li>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className='description'>
        //         <div className='label'>
        //             <label>Description</label>
        //         </div>
        //         <div className='content'>
        //             {bookData.description}
        //         </div>
        //     </div>
        //     <div className="rate">
        //         <table>
        //             <tr>
        //                 <td className='one'>Five Star</td>
        //                 <td>{rateData.fiveStar}</td>
        //             </tr>
        //             <tr>
        //                 <td className='one'>Four Star</td>
        //                 <td>{rateData.fourStar}</td>
        //             </tr>
        //             <tr>
        //                 <td className='one'>Three Star</td>
        //                 <td>{rateData.threeStar}</td>
        //             </tr>
        //             <tr>
        //                 <td className='one'>Two Star</td>
        //                 <td>{rateData.twoStar}</td>
        //             </tr>
        //             <tr>
        //                 <td className='one'>One Star</td>
        //                 <td>{rateData.oneStar}</td>
        //             </tr>
        //         </table>
        //     </div>
        //     <div className="comment">
        //         <div className='one'>
        //             <label>Comment</label>
        //         </div>
        //         {
        //             reviewData.map((item) => (
        //                 <div className="view-comment">
        //                     <table>
        //                         <tr>
        //                             <td className='name'>User:</td>
        //                             <td className='content'>{item.username}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='name'>Comment:</td>
        //                             <td className='content'>{item.comment}</td>
        //                         </tr>
        //                     </table>
        //                 </div>
        //             ))
        //         }
        //     </div>
        // </div>
        <div className="container-fluid py-5 ">
            <div className="container py-5">
                <div className="row g-4 mb-5">
                    <div className="col-lg-6 book_image">
                        <div className="border rounded">
                            {bookImages.map((image) => {
                                console.log(bookImages)
                                return <img src={`https://bookstore.io.vn${image.substring(image.indexOf("/images/"))}`} alt='' key={image} />;
                            })}
                        </div>
                    </div>
                    <div className="col-lg-6 text-left book_content">
                        <h4 className="fw-bold mb-3">Brocoli</h4>
                        <div className="d-flex mb-3">
                            <i className="fa fa-star text-secondary"></i>
                            <i className="fa fa-star text-secondary"></i>
                            <i className="fa fa-star text-secondary"></i>
                            <i className="fa fa-star text-secondary"></i>
                            <i className="fa fa-star"></i>
                        </div>
                        <p className="mb-2">Sold Quality: {bookData.soldQuantity}</p>
                        <h4 className="fw-bold mb-3">3,35 $</h4>

                        <div className="input-group quantity mb-2" style={{ width: '100px' }}>
                            <div className="input-group-btn">
                                <button className="btn btn-sm btn-minus rounded-circle bg-light border text-center"
                                    onClick={handleMinusBookNumber}
                                >
                                    <i className="fa fa-minus"></i>
                                </button>
                            </div>
                            <input type="text" className="form-control form-control-sm text-center border-0"
                                value={bookNumber} />
                            <div className="input-group-btn">
                                <button className="btn btn-sm btn-plus rounded-circle bg-light border"
                                    onClick={handlePlusBookNumber}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                            onClick={handleAddCart}
                        >
                            <i className="fa fa-shopping-bag me-2 text-primary">                 </i>
                            Add to cart
                        </div>
                        <div className='text_dan'>
                            <p className="mb-1">The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic words etc.</p>
                            <p className="mb-1">Susp endisse ultricies nisi vel quam suscipit. Sabertooth peacock flounder; chain pickerel hatchetfish, pencilfish snailfish</p>
                        </div>

                    </div>
                    <div className='col-lg-12 shop_content text-left'>
                        <div className='shop border rounded'>
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
                    <div className="col-lg-12 border rounded">
                        <nav>
                            <div className="nav nav-tabs mb-3">
                                <button className="nav-link active border-white border-bottom-0" type="button" role="tab"
                                    id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                    aria-controls="nav-about" aria-selected="true">Description</button>
                                <button className="nav-link border-white border-bottom-0" type="button" role="tab"
                                    id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission"
                                    aria-controls="nav-mission" aria-selected="false">Reviews</button>
                            </div>
                        </nav>
                        <div className="tab-content mb-5">
                            <div className="tab-pane active text-left" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                                <p>
                                    {bookData.description}
                                </p>
                                <div className="px-2">
                                    <div className="row g-4">
                                        <div className="col-6">
                                            <div className="row text-center align-items-center justify-content-center py-2">
                                                <div className="col-6">
                                                    <p className="mb-0">Publishing House</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0">{bookData.publishingHouse}</p>
                                                </div>
                                            </div>
                                            <div className="row bg-light align-items-center text-center justify-content-center py-2">
                                                <div className="col-6">
                                                    <p className="mb-0">Publisher</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0">{bookData.publisher}</p>
                                                </div>
                                            </div>
                                            <div className="row text-center align-items-center justify-content-center py-2">
                                                <div className="col-6">
                                                    <p className="mb-0">Publication Date</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0">{bookData.publicationDate}</p>
                                                </div>
                                            </div>
                                            <div className="row bg-light text-center align-items-center justify-content-center py-2">
                                                <div className="col-6">
                                                    <p className="mb-0">Dimension</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0">{bookData.dimension}</p>
                                                </div>
                                            </div>
                                            <div className="row text-center align-items-center justify-content-center py-2">
                                                <div className="col-6">
                                                    <p className="mb-0">Cover Type</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0">{bookData.coverType}</p>
                                                </div>
                                            </div>
                                            <div className="row bg-light text-center align-items-center justify-content-center py-2">
                                                <div className="col-6">
                                                    <p className="mb-0">Number Of Pages</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0">{bookData.numberOfPages}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                                <div className="d-flex">
                                    <img src="img/avatar.jpg" className="img-fluid rounded-circle p-3" style={{ width: '100px', height: '100px' }} alt="" />
                                    <div className="">
                                        <p className="mb-2" style={{ fontSize: '14px' }}>April 12, 2024</p>
                                        <div className="d-flex justify-content-between">
                                            <h5>Jason Smith</h5>
                                            <div className="d-flex mb-3">
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                        </div>
                                        <p>The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic
                                            words etc. Susp endisse ultricies nisi vel quam suscipit </p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <img src="img/avatar.jpg" className="img-fluid rounded-circle p-3" style={{ width: '100px', height: '100px' }} alt="" />
                                    <div className="">
                                        <p className="mb-2" style={{ fontSize: '14px' }}>April 12, 2024</p>
                                        <div className="d-flex justify-content-between">
                                            <h5>Sam Peters</h5>
                                            <div className="d-flex mb-3">
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star text-secondary"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                        </div>
                                        <p className="text-dark">The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic
                                            words etc. Susp endisse ultricies nisi vel quam suscipit </p>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="nav-vision" role="tabpanel">
                                <p className="text-dark">Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam
                                    amet diam et eos labore. 3</p>
                                <p className="mb-0">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.
                                    Clita erat ipsum et lorem et sit</p>
                            </div>
                        </div>
                    </div>
                    <form action="#" className='text-left border rounded'>
                        <h4 className="mb-5 fw-bold mt-2">Leave a Reply</h4>
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="border-bottom rounded">
                                    <input type="text" className="form-control border-0 me-4" placeholder="Yur Name *" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="border-bottom rounded">
                                    <input type="email" className="form-control border-0" placeholder="Your Email *" />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="border-bottom rounded my-4">
                                    <textarea name="" id="" className="form-control border-0" cols="30" rows="4" placeholder="Your Review *" spellcheck="false"></textarea>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between py-3 ">
                                    <div className="d-flex align-items-center">
                                        <p className="mb-0 me-3">Please rate:</p>
                                        <div className="d-flex align-items-center" style={{ fontSize: '12px' }}>
                                            <i className="fa fa-star text-muted"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                        </div>
                                    </div>
                                    <a href="#" className="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default BookDetailComponent;