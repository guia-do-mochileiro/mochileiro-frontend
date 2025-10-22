import { CircleCheckBig } from "lucide-react";
import ToastLayout from "./ToastLayout";

type Props = {
  title?: string;
  description?: string;
  iconSrc?: string;
};

function SuccessToast({ title, description, iconSrc }: Props) {
  return (
    <ToastLayout className="bg-green-200 text-green-900">
      <div className="flex items-center">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            className="mr-4 h-8 w-8 min-w-fit object-contain"
            aria-hidden
          />
        ) : (
          <CircleCheckBig className="mr-4 min-w-fit" />
        )}
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-2">{description}</p>
        </div>
      </div>
    </ToastLayout>
  );
}

export default SuccessToast;
