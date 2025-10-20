type IToastLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

function ToastLayout({ children, className }: IToastLayoutProps) {
  return (
    <div className={`w-full p-4 rounded-md shadow ${className}`}>
      {children}
    </div>
  );
}

export default ToastLayout;
