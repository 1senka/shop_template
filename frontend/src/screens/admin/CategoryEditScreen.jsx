import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';

import { toast } from 'react-toastify';
import {
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
  useGetCategoryDetailsQuery,
} from '../../slices/productsApiSlice';

const CategoryEditScreen = () => {
  const { id: categoryId } = useParams();

  const [name, setName] = useState('');
  const [image, setImage] = useState();

  const {
    data: category,
    isLoading,
    refetch,
    error,
  } = useGetCategoryDetailsQuery(categoryId);

  const [updateCategory, { isLoading: loadingUpdate }] =
    useUpdateCategoryMutation();

  const [uploadCategoryImage, { isLoading: loadingUpload }] =
    useUploadCategoryImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('images :>> ', image);
      await updateCategory({
        categoryId,
        name,
        image,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Category updated');
      refetch();
      navigate('/admin/categorylist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    console.log('category :>> ', category);
    if (category) {
      setName(category.name);
      setImage(category.image);
      console.log('category :>> ', category);
    }
  }, [category]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadCategoryImage(formData).unwrap();
      toast.success(res.message);
      setImage({ path: res.image });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <Link to='/admin/categorylist' className='btn btn-light my-3'>
        بازگشت
      </Link>
      <FormContainer>
        <h1>ویرایش دسته بندی</h1>
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

              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
              <li className='imageRow'>
                <Image src={image?.path} className='imageItem' />
              </li>
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

export default CategoryEditScreen;
