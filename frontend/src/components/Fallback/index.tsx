import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
} from '@nextui-org/react';

interface ErrorProps extends React.HTMLAttributes<HTMLElement> {
  error: Error;
}

const Fallback = ({ error }: ErrorProps) => {
  console.error('Error component', error);
  const isError = error instanceof Error;

  return (
    <section className="flex justify-center">
      <Card className="grid text-center m-12 justify-center">
        <CardHeader className="grid grid-rows-2 gap-4 justify-center">
          <h1 className="text-2xl">Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{isError && <i>Error: {error.message}</i>}</p>
        </CardBody>
        <Divider />
        <CardFooter className="justify-center">
          <Link href={'/'}>Go Home</Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Fallback;
