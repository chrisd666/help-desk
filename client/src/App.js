import React, { useState, useEffect } from 'react';
import './App.css';
import api from './api/customApi';
import { apiUrl } from './api/endpoints';
import AppRouter from './AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import { changeLoginState } from './store/actions';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const init = async () => {
    const token = window.localStorage.getItem('rp_token');
    if (token) {
      const user = await api.get(`${apiUrl}/api/twitter/self`);
      dispatch(changeLoginState(true, user, token));
    } else dispatch(changeLoginState(false, null, ''));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
