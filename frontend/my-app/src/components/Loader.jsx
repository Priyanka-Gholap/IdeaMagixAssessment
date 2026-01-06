const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="flex gap-2">
      <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
      <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

export default Loader;
