/* eslint-disable no-shadow */
import PostNew from '@/components/post/post-new';
import { LoginForm } from 'src/features/auth';

const Home = () => {
  return (
    <div>
      {/* <LoginForm /> */}
      <div style={{ width: '100px' }}>
        <PostNew />
      </div>
    </div>
  );
};

export default Home;
