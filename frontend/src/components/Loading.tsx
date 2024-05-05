import { Loader2 } from "lucide-react";
interface LoadingProps {
  text?: string;
}
const Loading = ({text}:LoadingProps) => {
  return (
    <div className="h-[90dvh] flex items-center justify-center">
      {text ? text : "Loading "} <Loader2 className="mx-3 animate-spin " />
    </div>
  );
};

export default Loading;
