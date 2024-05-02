import { Link } from 'react-router-dom';

interface ErrorProps extends React.HTMLAttributes<HTMLElement> {
  error: Error;
}

const Error = ({ children, error }: ErrorProps) => {
  console.error('Error component', error);
  const isError = error instanceof Error;
  return (
    <div className="text-center mt-12">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{isError && <i>Error: {error.message}</i>}</p>
      <Link to={'/'}>Go Home</Link>
    </div>
  );
};

export default Error;
