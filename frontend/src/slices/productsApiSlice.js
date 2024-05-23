import { PRODUCTS_URL, CATEGORIES_URL, IMAGES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (productId) => ({
        url: `${CATEGORIES_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Category'],
    }),
    deleteImage: builder.mutation({
      query: (data) => ({
        url: `${IMAGES_URL}`,
        method: 'DELETE',
        body: { path: data },
      }),
      providesTags: ['Image'],
    }),
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getCategoryDetails: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}`,
        body: data,
        method: 'POST',
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}/${data.categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadCategoryImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoryQuery,
  useDeleteCategoryMutation,
  useGetProductDetailsQuery,
  useGetCategoryDetailsQuery,
  useCreateProductMutation,
  useCreateCategoryMutation,
  useUpdateProductMutation,
  useUpdateCategoryMutation,
  useUploadProductImageMutation,
  useUploadCategoryImageMutation,
  useDeleteProductMutation,
  useDeleteImageMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
