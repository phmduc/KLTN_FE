import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../../layouts/MainLayout/MainLayout.js';
import './Products.css';
import { getAllProduct } from '../../Redux/slice/productSlice.js';
import { Form } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard/ProductCard.js';
import ReactPaginate from 'react-paginate';
function Products() {
  const listCate = useSelector((state) => state.category.category);
  const listProducts = useSelector((state) => state.product.productsList);

  const [products, setProducts] = useState([]);
  const [productsFilter, setProductsFilter] = useState([]);
  const [cate, setCate] = useState();
  const [size, setSize] = useState();
  const inputCate = useRef(false);
  const inputSize = useRef(false);
  const inputPriceMin = useRef(0);
  const inputPriceMax = useRef(0);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 9;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / 9);
  const [isLoad, setLoad] = useState([]);
  var listsize = [];
  const dispatch = useDispatch();
  async function getProducts() {
    try {
      const response = await axios.get('/api/products');
      dispatch(getAllProduct(response.data));
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const filter = () => {
    let filterList = listProducts;
    if (inputSize.current.value !== '0') {
      filterList = filterList.filter((elem, index) => {
        return elem.size.some(function (item, index) {
          return item.sizeId === inputSize.current.value;
        });
      });
    }
    if (inputCate.current.value !== '0') {
      filterList = filterList.filter((elem, index) => {
        return elem.idCate === inputCate.current.value;
      });
    }
    if (inputPriceMin.current.value) {
      filterList = filterList.filter((elem, index) => {
        return elem.size.some(function (item, index) {
          return item.price > inputPriceMin.current.value;
        });
      });
    }
    if (inputPriceMax.current.value) {
      filterList = filterList.filter((elem, index) => {
        return elem.size.some(function (item, index) {
          return item.price < inputPriceMax.current.value;
        });
      });
    }

    setProducts(filterList);
  };
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 9) % products.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    getProducts();
  }, [isLoad]);

  return (
    <MainLayout>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-3'>
            <div className='siteBar'>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='category'>Danh mục</Form.Label>
                  <Form.Select ref={inputCate} value={cate} id='category'>
                    <option value='0'>Chọn danh mục</option>
                    {listCate.map((elem, index) => {
                      return (
                        <option key={index} value={elem._id}>
                          {elem.nameCate}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='size'>Size</Form.Label>
                  <Form.Select ref={inputSize} value={size} id='size'>
                    <option value='0'>Chọn size</option>
                    {products.map((elem, index) => {
                      return elem.size.map((value, index) => {
                        if (
                          !listsize.find(function (item, index) {
                            return item === value.sizeId;
                          })
                        ) {
                          listsize = [...listsize, value.sizeId];
                          return (
                            <option key={index} value={value.sizeId}>
                              {value.sizeId}
                            </option>
                          );
                        }
                      });
                    })}
                  </Form.Select>
                </Form.Group>
                <div className='priceFilter d-flex'>
                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='category'>Giá thấp nhất</Form.Label>
                    <Form.Control />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='category'>Giá cao nhất</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </div>
                <div className='row g-3 d-flex justify-content-between'>
                  <button
                    type='button'
                    onClick={() => {
                      filter();
                    }}
                    className='filter btn col-lg-12 col-md-5'>
                    Lọc
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setProducts(listProducts);
                    }}
                    className='filter btn col-lg-12 col-md-5'>
                    Hủy lọc
                  </button>
                </div>
              </Form>
            </div>
          </div>
          <div className='col-lg-9'>
            <div className='list-product'>
              <div className='row'>
                {currentItems.length !== 0 ? (
                  currentItems.map((item, index) => (
                    <div className='col-lg-4'>
                      <ProductCard item={item} />
                    </div>
                  ))
                ) : (
                  <span>Xin lỗi không tìm thấy sản phẩm yêu cầu</span>
                )}
              </div>
            </div>
            <ReactPaginate
              className='pagination'
              breakLabel='...'
              nextLabel='>'
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel='<'
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Products;
