import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Image } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryQuery,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
const CategoriesListScreen = () => {
  const { data, isLoading, error, refetch } = useGetCategoryQuery({});
  const [deleteCategorie, { isLoading: loadingDelete }] =
    useDeleteCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteCategorie(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createCategory, { isLoading: loadingCreate }] =
    useCreateCategoryMutation();

  const createCategoryHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createCategory();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>دسته بندی ها</h1>
        </Col>
        <Col className='text-start'>
          <Button className='my-3' onClick={createCategoryHandler}>
            <FaPlus /> ایجاد دسته بندی
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>نام</th>
                <th>تصویر</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>
                    <Image src={category.image.path} className='imageItem' />
                  </td>
                  <td>{category.material}</td>
                  <td>
                    <LinkContainer to={`/admin/category/${category._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(category._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default CategoriesListScreen;
