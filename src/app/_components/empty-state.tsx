
const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="text-center py-12 text-gray-400 flex flex-col items-center">
    <div className="bg-gray-50 p-4 rounded-full mb-4">
      <Icon size={32} className="opacity-50" />
    </div>
    <p>{message}</p>
  </div>
)

export default EmptyState;
