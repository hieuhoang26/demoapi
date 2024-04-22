import { useEffect, useState, useRef } from 'react';
import { GetBookByPageApi, GetBookByCondition } from "../API/BookStoreApi";
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import { useAuth } from '../Sercutiry/AuthContext';
import logo1 from '../../assets/Bookshop.gif'

function Home() {

    // set cart
    if (JSON.parse(localStorage.getItem("BookIdCartList")) === null) {
        localStorage.setItem("BookIdCartList", JSON.stringify([]))
    }
    let Navigate = useNavigate()
    let [bookData, setBookData] = useState([])
    const sectionRef = useRef(null);
    const handleInputClick = () => {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
    };
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
    let retrieveBookData = async () => {
        try {
            let response = await GetBookByPageApi(0, headers)
            setBookData(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        retrieveBookData()
    }, [])

    let handleViewDetail = (bookId) => {
        Navigate(`/bookdetail/${bookId}`)
    }

    // filer book
    let Auth = useAuth();
    const [categories, setCategories] = useState(Auth.categories);
    useEffect(() => {
        setCategories(Auth.categories)
    }, [Auth.categories])

    let filter = useFormik({
        initialValues: {
            title: null,
            authors: null,
            lowPrice: null,
            highPrice: null,
            category: null,

        },
        onSubmit: async (values) => {
            if (values.category === "") values.category = null;
            try {
                let response = await GetBookByCondition(values, headers)
                setBookData(response.data)
                console.log(response.data)
            }
            catch (error) {
                console.log(error)
            }
        }
    })

    // change page
    let handleChangePage = async (page) => {
        try {
            let response = await GetBookByPageApi(page, headers)
            setBookData(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleCategoryChange = (categoryName) => {
        filter.setFieldValue('category', categoryName);
        filter.handleSubmit()
    };
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (String) => {
        filter.setFieldValue('title', String);
        // filter.setFieldValue('authors', String);
        filter.handleSubmit()
    };




    return (
        <>
            <div className="container-fluid hero-header">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-md-12 col-lg-7">
                            <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
                            <h1 className="mb-5 display-3 text-primary">Organic Veggies & Fruits Foods</h1>
                            <div className="position-relative mx-auto">
                                <input className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill" type="number" placeholder="Search" />
                                <button type="submit" className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100" style={{ top: 0, right: '25%' }}>Submit Now</button>
                            </div>
                        </div>
                        {/* <div className="col-md-12 col-lg-5">
                            <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img src="../../../public/hero-img-1.png" className="img-fluid w-100 h-100 bg-secondary rounded" alt="First slide" />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Fruits</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img src="../../../public/hero-img-2.jpg" className="img-fluid w-100 h-100 rounded" alt="Second slide" />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Vegetables</a>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* <div className='filter'>
                <form className="form" onSubmit={filter.handleSubmit}>
                    <label>Title</label>
                    <input type="text" name="title" value={filter.values.id} onChange={filter.handleChange} placeholder='enter title' />
                    <label>Authors</label>
                    <input className='authors' type="text" name="authors" value={filter.values.authors} onChange={filter.handleChange} placeholder='enter authors' />
                    <label>Price from</label>
                    <input className='price' type="number" name="lowPrice" value={filter.values.lowPrice} onChange={filter.handleChange} />
                    <label>to</label>
                    <input className='price' type="number" name="highPrice" value={filter.values.highPrice} onChange={filter.handleChange} />
                    <label>Category</label>
                    <select name="category" value={filter.values.category} onChange={filter.handleChange}>
                        <option value="">none</option>
                        {categories.map((category) => {
                            return (
                                <optgroup label={category.name}>
                                    {category.subcategories.map((subcategory) => (
                                        <option value={subcategory.name}>{subcategory.name}</option>
                                    ))}
                                </optgroup>
                            )
                        })
                        }
                    </select>
                    <button type="submit"> Filter </button>
                </form>
            </div> */}
            <div className="container-fluid featurs py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className=" col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-car-side fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h6>Free Shipping</h6>
                                    <p className="mb-0">Freeon order over $300</p>
                                </div>
                            </div>
                        </div>
                        <div className=" col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-user-shield fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h6>Security Payment</h6>
                                    <p className="mb-0">100% security payment</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-exchange-alt fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h6>30 Day Return</h6>
                                    <p className="mb-0">30 day money guarantee</p>
                                </div>
                            </div>
                        </div>
                        <div className=" col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fa fa-phone-alt fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h6>24/7 Support</h6>
                                    <p className="mb-0">Support every time fast</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='home-list-book'>
                <div className="container fruite py-5">
                    <div className="container py-5">
                        {/* <h1 class="mb-4">Fresh fruits shop</h1> */}
                        <div class="row g-4">
                            <div className='col-lg-12'>
                                <div class="row g-4">
                                    <div class="col-xl-4">
                                        <div class="input-group mx-auto d-flex">
                                            <input
                                                type="search"
                                                className="form-control p-3"
                                                placeholder="keywords"
                                                aria-describedby="search-icon-1"
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                            />
                                            <span
                                                id="search-icon-1"
                                                className="input-group-text p-3"
                                                onClick={() => handleSearchChange(searchValue)}
                                            >
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-5"></div>
                                    <div class="col-xl-3">
                                        <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                            <label for="fruits">Default Sorting:</label>
                                            <select id="fruits" name="fruitlist" class="border-0 form-select-sm bg-light me-3"
                                                form="fruitform">
                                                <option value="volvo">Nothing</option>
                                                <option value="saab">Popularity</option>
                                                <option value="opel">Organic</option>
                                                <option value="audi">Fantastic</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-4">
                                    <div className='col-lg-2'>
                                        <div className="row g-4">
                                            <div className="col-lg-12">
                                                <div className="mb-3 text-left fruite-categorie">
                                                    <h5>Categories</h5>
                                                    <ul className="list-unstyled categorie-list">
                                                        <li>
                                                            <span onClick={() => handleCategoryChange("")}>All</span>
                                                        </li>
                                                        {categories.map((category) => (
                                                            <li key={category.name}>
                                                                <div className="justify-content-between ">
                                                                    <span onClick={() => handleCategoryChange(category.name)}>{category.name}</span>
                                                                    <span>({category.subcategories.length})</span>
                                                                </div>
                                                                <div className='ml-3'>
                                                                    {category.subcategories.map((subcategory) => (
                                                                        <li key={subcategory.name}>
                                                                            <span onClick={() => handleCategoryChange(subcategory.name)}>{subcategory.name}</span>
                                                                        </li>
                                                                    ))}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3 text-left">
                                                    <h5 className="mb-2">Price</h5>
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            name="lowPrice"
                                                            className="form-control mr-2"
                                                            value={filter.values.lowPrice}
                                                            onChange={filter.handleChange}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="highPrice"
                                                            className="form-control"
                                                            value={filter.values.highPrice}
                                                            onChange={filter.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <button type="button" class="btn btn-primary" onClick={filter.handleSubmit}>Lọc</button>

                                            </div>


                                        </div>

                                    </div>
                                    <div className='col-lg-10'>
                                        <div class="row g-4">
                                            {bookData.length == 0 ? (
                                                <div className="col-lg-12">
                                                    <p>Không có dữ liệu sách để hiển thị.</p>
                                                </div>
                                            ) : (
                                                bookData.map((book) => (
                                                    <div className="col-md-4 col-lg-4 col-xl-3"  >
                                                        <div className="rounded position-relative fruite-item">
                                                            <div className="fruite-img" onClick={() => handleViewDetail(book.id)}>
                                                                <img src={book.imagePath.substring(book.imagePath.indexOf("images/"))} alt='' className="img-fluid w-100 rounded-top" />
                                                            </div>
                                                            <div className="p-3">
                                                                <p>{book.title}</p>
                                                                <div className="justify-content-between flex-lg-wrap">
                                                                    <h5 className="text-danger fs-5 fw-bold">{book.price}$</h5>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>


            </div>
            <div className='page'>
                <li onClick={() => handleChangePage(0)}>1</li>
                <li onClick={() => handleChangePage(1)}>2</li>
                <li onClick={() => handleChangePage(2)}>3</li>
                <li onClick={() => handleChangePage(3)}>4</li>
                <li className='more'>...</li>
            </div>
            {/* <div className='image'>
                            <img className='image-item' src={book.imagePath.substring(book.imagePath.indexOf("images/"))} alt='' />
                        </div>
                        <div className='info'>
                            <div className='title'>{book.title}</div>
                            <div className='price'>{book.price} $</div>
                            <div className='sold'>Sold: {book.soldQuantity}</div>
                        </div> */}
        </>

    )
}

export default Home;
