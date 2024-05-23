import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteImageMutation,
  useGetCategoryQuery,
} from '../../slices/productsApiSlice';
import { FaTrash } from 'react-icons/fa';

const ProductEditScreen = () => {
  const SortableItem = SortableElement(({ value }) => {
    console.log('e :>> ', value);
    return (
      <li className='imageRow'>
        {value.path} <Image src={value.path} className='imageItem' />{' '}
        <Button
          variant='danger'
          className='btn-sm'
          onClick={() => deleteHandler(value.path)}
        >
          <FaTrash style={{ color: 'white' }} />
        </Button>
      </li>
    );
  });

  const SortableList = SortableContainer(({ items }) => {
    console.log('items :>> ', items);
    return (
      <ul>
        {items?.map((value, index) => (
          <SortableItem
            key={`item-${value.path}`}
            index={index}
            value={value}
          />
        ))}
      </ul>
    );
  });
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoryQuery({});
  console.log('categories :>> ', categories);
  const { id: productId } = useParams();
  const deleteHandler = async (path) => {
    try {
      console.log('images :>> ', images);
      setImages(images.filter((e) => e.path != path));
      await deleteImage(path).unwrap();
      // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Image Deleted');
      await updateProduct({
        productId,
        name,
        images,
        material,
        category,
        description,
      }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [material, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('images :>> ', images);
      await updateProduct({
        productId,
        name,
        images,
        material,
        category,
        description,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setImages(product.images);
      setBrand(product.material);
      setCategory(product.category);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImages([...images, { path: res.image }]);
      console.log('this.images :>> ', [...images, { path: res.image }]);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const targetHasProp = (target, hasProp) => {
    while (target) {
      if (hasProp(target)) {
        return true;
      }
      // eslint-disable-next-line no-param-reassign
      target = target.parentElement;
    }
    return false;
  };
  const shouldCancelSortStart = (coach) => {
    // Cancel sort if a user is interacting with a given element
    return targetHasProp(coach.target, (el) => {
      return ['button'].includes(el.tagName.toLowerCase());
    });
  };
  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        بازگشت
      </Link>
      <FormContainer>
        <h1>ویرایش محصول</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>نام</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>عکس ها</Form.Label>
              <SortableList
                shouldCancelStart={shouldCancelSortStart}
                items={images}
                onSortEnd={({ oldIndex, newIndex }) => {
                  let temp = arrayMoveImmutable(images, oldIndex, newIndex);
                  console.log('temp :>> ', temp);
                  setImages(temp);
                }}
              />
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId='material'>
              <Form.Label>جنس</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter material'
                value={material}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>دسته بندی</Form.Label>
              <Form.Select
                onChange={(e) => {
                  console.log('e :>> ', e);
                  setCategory(e.target.value);
                }}
              >
                {categories?.categories.map((e) => (
                  <option value={e._id} selected={e._id === product.category}>
                    {e.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>توضیحات</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              به روز رسانی
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
