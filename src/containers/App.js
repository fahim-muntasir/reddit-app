import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure } from '../actions/redditActions';
import { setPosts, setLoading, setError } from '../actions/redditActions'; 
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import { fetchPosts } from '../api/api';

const App = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const loading = useSelector((state) => state.loading);

  const handleSearch = async (term) => {
    dispatch(fetchPostsRequest());

    try {
      const data = await fetchPosts(term);
      dispatch(fetchPostsSuccess(data));
    } catch (error) {
      dispatch(fetchPostsFailure(error.message));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const posts = await fetchPosts();
        dispatch(setPosts(posts));
        dispatch(setLoading(false));
      } catch (error) {
        console.error('Error fetching posts:', error);
        dispatch(setError(true));
      }
    };
  
    fetchData();
  }, [dispatch]); 
  

  return (
    <div>
      <h1>Reddit App</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? <p>Loading...</p> : <PostList posts={posts} />}
    </div>
  );
};

export default App;
