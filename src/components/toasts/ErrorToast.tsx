import { CircleX } from "lucide-react";
import type { ToastContentProps } from "react-toastify";
import ToastLayout from "./ToastLayout";

type Props = Partial<ToastContentProps> & {
  title?: string;
  description?: string;
};

function ErrorToast({ title, description }: Props) {
  return (
    <ToastLayout className="bg-red-100">
      <div className="flex items-center text-red-900">
        <CircleX className="mr-4 min-w-fit" />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-2">{description}</p>
        </div>
      </div>
    </ToastLayout>
  );
}

export default ErrorToast;
