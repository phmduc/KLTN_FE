import Admin from '../../layouts/Admin/Admin.js';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import ModalForm from '../../components/Modal/Modal.js';
import { validation } from '../../js/validation.js';
import {
  addproduct,
  updateproduct,
  deleteproduct,
  deleteImage,
} from '../../Redux/apiRequests.js';
import ReactPaginate from 'react-paginate';
import { loading, unLoadding } from '../../Redux/slice/loading.js';
import MainLayout from '../../layouts/MainLayout/MainLayout.js';
import './ProductAdmin.css';
import { getAllProduct } from '../../Redux/slice/productSlice.js';
import { Form, Button } from 'react-bootstrap';
function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const listCate = useSelector((state) => state.category.category);
  const [isLoad, setLoaded] = useState(false);
  const [ID, setID] = useState('');
  const [name, setName] = useState('');
  const [cate, setCate] = useState();
  const [desc, setDesc] = useState('');
  const [size, setSize] = useState([]);
  const [image, setImage] = useState([]);
  const [previewSource, setPreviewSource] = useState([]);
  const [fileInput, setFileInput] = useState();
  const [imgMessage, setImgMessage] = useState('');
  const [message, setMessage] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [sizeCount, setSizeCount] = useState('');
  const [sizePrice, setSizePrice] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 6;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / 6);
  const dispatch = useDispatch();

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 6) % products.length;
    setItemOffset(newOffset);
  };
  async function getProducts() {
    try {
      const response = await axios.get('/api/products');
      dispatch(getAllProduct(response.data));
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getProducts();
    dispatch(unLoadding());
  }, [isLoad]);
  const resetInput = async () => {
    setName('');
    setCate('');
    setDesc('');
    setSize([]);
    setPreviewSource([]);
    setFileInput();
  };
  const handleSubmitAdd = async () => {
    console.log(validation.validateName(name));
    console.log(validation.validateCate(cate));

    console.log(validation.validateSize(size));

    if (
      validation.validateName(name) === true &&
      validation.validateCate(cate) === true &&
      validation.validateSize(size) === true
    ) {
      if (
        products.find(function (product, index) {
          return product.name === name;
        })
      ) {
        setMessage('Sản phẩm đã tồn tại');
      } else {
        if (previewSource.length < 5) {
          setImgMessage('Vui Lòng Nhập Đủ 5 Bức Ảnh');
          return false;
        } else {
          dispatch(loading());
          let imageData = await uploadImage(previewSource);
          imageData = imageData.map((elem, index) => {
            return { publicId: elem.public_id, url: elem.url };
          });

          const newProduct = {
            name: name,
            desc: desc,
            image: imageData,
            idCate: cate,
            size: size,
          };
          await addproduct(newProduct, dispatch);
          dispatch(unLoadding());
          setLoaded(!isLoad);
          toast.success(`Thêm thành công`, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    } else {
      setMessage('Thông tin chưa hợp lệ, vui lòng kiểm tra lại');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setMessage('');
    if (previewSource.length > 4) {
      setImgMessage('Nhập tối đa 5 bức ảnh');
      return;
    } else {
      previewFile(file);
    }
  };
  const previewSize = () => {
    if (sizeId && sizeCount && sizePrice) {
      if (
        Number(sizeCount) > 0 &&
        Number.isInteger(Number(sizeCount)) &&
        Number(sizePrice) > 0 &&
        Number.isInteger(Number(sizePrice))
      ) {
        if (
          size.some(function (item, index) {
            return sizeId === item.sizeId;
          })
        ) {
          const data = size.slice();
          const newmap = data.filter(function (value, index) {
            return value.sizeId !== sizeId;
          });
          setSize([
            ...newmap,
            {
              sizeId: sizeId,
              count: sizeCount,
              price: sizePrice,
            },
          ]);
        } else {
          setSize([
            ...size,
            {
              sizeId: sizeId,
              count: sizeCount,
              price: sizePrice,
            },
          ]);
        }
        setSizeId('');
        setSizeCount('');
        setSizePrice('');
      } else {
        if (Number(sizeCount) > 0 && Number.isInteger(Number(sizeCount)))
          setSizeCount('Không Hợp Lệ');
        if (Number(sizePrice) > 0 && Number.isInteger(Number(sizePrice)))
          setSizePrice('Không Hợp Lệ');
      }
    }
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource([...previewSource, reader.result]);
    };
  };
  const uploadImage = async (base64EncodedImage) => {
    let file;
    try {
      file = await axios.post('/api/uploads', { file: base64EncodedImage });
      return file.data;
    } catch (err) {
      console.error(err);
    }
  };

  const convertToBase64 = (url) => {
    return fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise(function (resolve) {
          var reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
      });
  };
  const handleSaveUpdate = async (index) => {
    if (
      validation.validateName(name) === true &&
      validation.validateCate(cate) === true &&
      validation.validateSize(size) === true
    ) {
      if (previewSource.length < 5) {
        setImgMessage('Vui Lòng Nhập Đủ 5 Bức Ảnh');
        return false;
      } else {
        dispatch(loading());
        let imageData = await uploadImage(previewSource);
        imageData = imageData.map((elem, index) => {
          return { publicId: elem.public_id, url: elem.url };
        });

        const updatedProduct = {
          _id: ID,
          name: name,
          desc: desc,
          image: imageData,
          idCate: cate,
          size: size,
        };
        products[index].image.forEach((elem, index) => {
          deleteImage(elem.publicId);
        });
        await updateproduct(updatedProduct, dispatch);
        dispatch(unLoadding());
        toast.success(`Update thành công`, {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoaded(!isLoad);
      }
    } else {
      setMessage('Thông tin chưa hợp lệ, vui lòng kiểm tra lại');
    }
  };
  const handleDelete = async (index) => {
    const deletedProduct = {
      _id: products[index]._id,
    };
    products[index].image.forEach((elem, index) => {
      deleteImage(elem.publicId);
    });
    await deleteproduct(deletedProduct, dispatch);
    setLoaded(!isLoad);
    toast.success(`Xóa thành công`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const updatePrepare = async (index) => {
    setID(products[index]._id);
    setName(products[index].name);
    setCate(products[index].idCate);
    setDesc(products[index].desc);
    setSize(products[index].size);
    const promise = products[index].image.map(async (elem, index) => {
      return await convertToBase64(elem.url).then((response) => response);
    });
    let images = await Promise.all(promise);
    setPreviewSource(images);
  };
  return (
    <Admin>
      <div className='productManage'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <ModalForm
                title='Thêm Sản Phẩm'
                icon='+ Thêm Sản Phẩm'
                size='lg'
                handleSubmit={handleSubmitAdd}
                reset={resetInput}>
                <div className='formProduct'>
                  {!message || <span className='message'>{message}</span>}
                  <form>
                    <div className='group-flex d-flex flex-wrap'>
                      <div className='form-group'>
                        <label htmlFor='nameProduct'>Tên sản phẩm</label>
                        <input
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          type='text'
                          className='form-control'
                          id='nameProduct'
                          placeholder='Nhập tên sản phẩm'
                        />
                        {validation.validateName(name) || (
                          <span className='message'>
                            {validation.validateName(name)}
                          </span>
                        )}
                      </div>
                      <div className='form-group'>
                        <label htmlFor='cate'>Danh Mục</label>
                        <Form.Select
                          onChange={(e) => setCate(e.target.value)}
                          value={cate}>
                          <option value={0}>Chọn danh mục...</option>
                          {listCate.map((elem, index) => {
                            return (
                              <option key={index} value={elem._id}>
                                {elem.nameCate}
                              </option>
                            );
                          })}
                        </Form.Select>
                        {validation.validateCate(cate) || (
                          <span className='message'>
                            {validation.validateCate(cate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='form-group'>
                      <label>Ảnh sản phẩm</label>
                      <input
                        type='file'
                        onChange={(e) => handleFileInputChange(e)}
                        value={fileInput}
                        id='fileProduct'
                      />
                      <div className='listPreview d-flex'>
                        {!previewSource ||
                          previewSource.map((image, index) => {
                            return (
                              <div key={index} className='item img-wrap'>
                                <img src={image} alt='' />
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    previewSource.splice(index, 1);
                                    setFileInput([]);
                                    setLoaded(!isLoad);
                                  }}>
                                  X
                                </button>
                              </div>
                            );
                          })}
                      </div>

                      <label className='fileLabel' htmlFor='fileProduct'>
                        + Thêm Ảnh
                      </label>
                    </div>
                    <div className='group-flex-3 d-flex flex-wrap'>
                      <div className='form-group'>
                        <label htmlFor='sizeProduct'>Size</label>
                        <input
                          value={sizeId}
                          onChange={(e) => {
                            setSizeId(e.target.value);
                          }}
                          type='text'
                          className='form-control'
                          id='sizeProduct'
                          placeholder='Nhập size'
                        />
                        {validation.validateSizeId(sizeId) || (
                          <span className='message'>
                            {validation.validateSizeId(sizeId)}
                          </span>
                        )}
                      </div>
                      <div className='form-group'>
                        <label htmlFor='countProduct'>Số lượng</label>
                        <input
                          value={sizeCount}
                          onChange={(e) => {
                            setSizeCount(e.target.value);
                          }}
                          type='text'
                          className='form-control'
                          id='countProduct'
                          placeholder='Nhập số lượng'
                        />
                        {validation.validateCount(sizeCount) || (
                          <span className='message'>
                            {validation.validateCount(sizeCount)}
                          </span>
                        )}
                      </div>
                      <div className='form-group  '>
                        <label htmlFor='priceProduct'>Giá sản phẩm</label>
                        <input
                          value={sizePrice}
                          onChange={(e) => {
                            setSizePrice(e.target.value);
                          }}
                          type='text'
                          className='form-control'
                          id='priceProduct'
                          placeholder='Nhập giá sản phẩm'
                        />
                        {validation.validatePrice(sizePrice) || (
                          <span className='message'>
                            {validation.validatePrice(sizePrice)}
                          </span>
                        )}
                      </div>
                      <button
                        type='button'
                        className='addsize btn mt-2'
                        onClick={() => {
                          previewSize();
                        }}>
                        Thêm size
                      </button>

                      <div className='sizePreview mt-2 '>
                        {!size ||
                          size.map((item, index) => {
                            return (
                              <div key={index} className='sizewrap d-flex'>
                                <button
                                  type='button'
                                  className='btn  d-flex justify-content-between w-100 align-items-center'
                                  onClick={() => {
                                    setSizeId(item.sizeId);
                                    setSizeCount(item.count);
                                    setSizePrice(item.price);
                                  }}>
                                  <span>Size: {item.sizeId} </span>
                                  <span>Số lượng: {item.count} </span>
                                  <span>Giá: {item.price} </span>
                                </button>
                                <button
                                  className='btn'
                                  type='button'
                                  onClick={(e) => {
                                    size.splice(index, 1);
                                    setLoaded(!isLoad);
                                  }}>
                                  X
                                </button>
                              </div>
                            );
                          })}
                      </div>
                      {validation.validateSize(size) || (
                        <span className='message'>
                          {validation.validateSize(size)}
                        </span>
                      )}
                    </div>
                    <div className='form-group'>
                      <label htmlFor='descProduct'>Mô tả</label>
                      <textarea
                        class='form-control'
                        value={desc}
                        onChange={(e) => {
                          setDesc(e.target.value);
                        }}
                      />
                    </div>
                  </form>
                </div>
              </ModalForm>
              <table className='table table-bordered table-hover border-dark productList'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Tên sản phẩm</th>
                    <th scope='col'>Hình ảnh</th>
                    <th scope='col'>Mô tả</th>
                    <th scope='col'>Hãng</th>
                    <th scope='col'>Size - Số lượng</th>
                    <th scope='col'>Tùy chọn</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {currentItems.map((item, index) => (
                    <tr className='item' key={item._id}>
                      <th scope='row'>{index + 1}</th>
                      <td className='name'>{item.name}</td>
                      <td className='imgs-wrap'>
                        <img className='imgs' src={item.image[0].url} alt='' />
                      </td>
                      <td className='descriptions'>
                        <div className='descriptions-sub'>{item.desc}</div>
                      </td>
                      <td className='cate'>
                        {listCate.map((elem, index) => {
                          if (elem._id === item.idCate) {
                            return elem.nameCate;
                          }
                        })}
                      </td>
                      <td className='size'>
                        {item.size.map((size) => (
                          <div key={size.sizeId} className='sizeNumber'>
                            Size {size.sizeId} - {size.count} Đôi - Giá:{' '}
                            {size.price} VND
                          </div>
                        ))}
                      </td>
                      <td className='controls'>
                        <button
                          className='btn'
                          onClick={() => {
                            handleDelete(index);
                          }}>
                          <i className='bi bi-trash-fill'></i>
                        </button>
                        <ModalForm
                          title='Chỉnh Sửa Sản Phẩm'
                          icon={<i className='bi bi-pencil-square'></i>}
                          reset={resetInput}
                          size='lg'
                          prepare={() => {
                            updatePrepare(index);
                          }}
                          handleSubmit={() => {
                            handleSaveUpdate(index);
                          }}>
                          <div className='formProduct'>
                            {!message || (
                              <span className='message'>{message}</span>
                            )}
                            <form>
                              <div className='group-flex d-flex flex-wrap'>
                                <div className='form-group'>
                                  <label htmlFor='nameProduct'>
                                    Tên sản phẩm
                                  </label>
                                  <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    type='text'
                                    className='form-control'
                                    id='nameProduct'
                                    placeholder='Nhập tên sản phẩm'
                                  />
                                </div>
                                <div className='form-group'>
                                  <label htmlFor='cate'>Danh Mục</label>
                                  <Form.Select
                                    onChange={(e) => setCate(e.target.value)}
                                    value={cate}>
                                    <option>Chọn danh mục...</option>
                                    {listCate.map((elem, index) => {
                                      return (
                                        <option key={index} value={elem._id}>
                                          {elem.nameCate}
                                        </option>
                                      );
                                    })}
                                  </Form.Select>
                                </div>
                              </div>
                              <div className='form-group'>
                                <label>Ảnh sản phẩm</label>
                                <input
                                  type='file'
                                  onChange={(e) => handleFileInputChange(e)}
                                  value={fileInput}
                                  id='fileProduct'
                                />
                                <div className='listPreview d-flex'>
                                  {!previewSource ||
                                    previewSource.map((image, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className='item img-wrap'>
                                          <img src={image} alt='' />
                                          <button
                                            type='button'
                                            onClick={(e) => {
                                              previewSource.splice(index, 1);
                                              setFileInput([]);
                                              setLoaded(!isLoad);
                                            }}>
                                            X
                                          </button>
                                        </div>
                                      );
                                    })}
                                </div>

                                <label
                                  className='fileLabel'
                                  htmlFor='fileProduct'>
                                  + Thêm Ảnh
                                </label>
                              </div>
                              <div className='group-flex-3 d-flex flex-wrap'>
                                <div className='form-group'>
                                  <label htmlFor='sizeProduct'>Size</label>
                                  <input
                                    value={sizeId}
                                    onChange={(e) => {
                                      setSizeId(e.target.value);
                                    }}
                                    type='text'
                                    className='form-control'
                                    id='sizeProduct'
                                    placeholder='Nhập size'
                                  />
                                </div>
                                <div className='form-group'>
                                  <label htmlFor='countProduct'>Số lượng</label>
                                  <input
                                    value={sizeCount}
                                    onChange={(e) => {
                                      setSizeCount(e.target.value);
                                    }}
                                    type='text'
                                    className='form-control'
                                    id='countProduct'
                                    placeholder='Nhập số lượng'
                                  />
                                </div>
                                <div className='form-group  '>
                                  <label htmlFor='priceProduct'>
                                    Giá sản phẩm
                                  </label>
                                  <input
                                    value={sizePrice}
                                    onChange={(e) => {
                                      setSizePrice(e.target.value);
                                    }}
                                    type='text'
                                    className='form-control'
                                    id='priceProduct'
                                    placeholder='Nhập giá sản phẩm'
                                  />
                                </div>
                                <button
                                  type='button'
                                  className='addsize btn mt-2'
                                  onClick={() => {
                                    previewSize();
                                  }}>
                                  Thêm size
                                </button>

                                <div className='sizePreview mt-2 '>
                                  {!size ||
                                    size.map((item, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className='sizewrap d-flex'>
                                          <button
                                            type='button'
                                            className='btn  d-flex justify-content-between w-100 align-items-center'
                                            onClick={() => {
                                              setSizeId(item.sizeId);
                                              setSizeCount(item.count);
                                              setSizePrice(item.price);
                                            }}>
                                            <span>Size: {item.sizeId} </span>
                                            <span>Số lượng: {item.count} </span>
                                            <span>Giá: {item.price} </span>
                                          </button>
                                          <button
                                            className='btn'
                                            type='button'
                                            onClick={(e) => {
                                              console.log(size.slice());
                                              let list = size.slice();
                                              list = list.filter(
                                                (value, index) => {
                                                  return value._id !== item._id;
                                                }
                                              );
                                              setSize(list);
                                              setLoaded(!isLoad);
                                            }}>
                                            X
                                          </button>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='descProduct'>Mô tả</label>
                                <textarea
                                  class='form-control'
                                  value={desc}
                                  onChange={(e) => {
                                    setDesc(e.target.value);
                                  }}
                                />
                              </div>
                            </form>
                          </div>
                        </ModalForm>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>
    </Admin>
  );
}

export default ProductAdmin;
