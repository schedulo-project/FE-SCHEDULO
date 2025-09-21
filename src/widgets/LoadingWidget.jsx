const LoadingWidget = () => {
  return (
    <div className="flex items-center justify-center space-x-1 h-10">
      <span className="w-3 h-3 bg-gray-600 rounded-full animate-bounce-dot-1"></span>
      <span className="w-3 h-3 bg-gray-600 rounded-full animate-bounce-dot-2"></span>
      <span className="w-3 h-3 bg-gray-600 rounded-full animate-bounce-dot-3"></span>
    </div>
  );
};

export default LoadingWidget;
