import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card group">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </Link>
      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
