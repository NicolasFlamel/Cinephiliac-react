interface IconProps {
  src: string;
  'data-checked'?: string;
  width?: string;
  height?: string;
  isSelected?: boolean;
  className?: string;
}

const Icon = (props: IconProps) => {
  const { width, height, ...imgProps } = props;

  return <img {...imgProps} style={{ width, height }} />;
};

export default Icon;
