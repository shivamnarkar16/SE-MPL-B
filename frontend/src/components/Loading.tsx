import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-[90dvh] flex items-center justify-center">
      Loading <Loader2 className="mx-3 animate-spin " />
    </div>
  );
};

export default Loading;
