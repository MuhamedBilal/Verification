import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Verification } from './components/Verification';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='min-h-screen bg-gray-50'>
        <Verification />
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
