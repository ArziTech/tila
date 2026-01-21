import { Card } from "@/components/ui/card";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8!">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mx-auto mb-4 text-2xl font-bold">
            T
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TILA</h1>
          <p className="text-gray-500">Today I've Learned About</p>
        </div>

        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
