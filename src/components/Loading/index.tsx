import { CircularProgress } from '@nextui-org/react';

interface LoadingProps extends React.HTMLAttributes<HTMLElement> {
  value?: number;
}

const Loading = ({ children, value }: LoadingProps) => {
  return (
    <section className="grid justify-center p-4">
      <CircularProgress
        className="mx-auto"
        aria-label="Loading..."
        size="lg"
        value={value}
        showValueLabel={true}
      />
      <section>{children}</section>
    </section>
  );
};

export default Loading;
