import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className=" h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="max-w-md shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardContent className="p-6 text-center">
          <h1 className="text-4xl font-bold mt-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The page you are looking for does not exist.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button className="w-1/2 border" onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
