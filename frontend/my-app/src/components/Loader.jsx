const Loader = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex space-x-2">
        <span className="h-3 w-3 rounded-full bg-blue-500 animate-bounce" />
        <span className="h-3 w-3 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]" />
        <span className="h-3 w-3 rounded-full bg-blue-300 animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  );
};

export default Loader;
