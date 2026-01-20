import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import nftImage from "../../images/nftImage.jpg";
import AuthorImage from "../../images/author_thumbnail.jpg";

const ExploreItemSkeleton = () => {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="nft__item">
        <div className="author_list_pp">
          <Skeleton circle width={50} height={50} />
        </div>
        <div className="de_countdown">
          <Skeleton width={100} height={20} />
        </div>
        <div className="nft__item_wrap">
          <Skeleton height={300} borderRadius={8} />
        </div>
        <div className="nft__item_info">
          <Skeleton width={150} height={22} style={{marginBottom: '10px'}} />
          <Skeleton width={80} height={18} />
          <Skeleton width={50} height={18} style={{marginTop: '8px'}} />
        </div>
      </div>
    </div>
  );
};

const formatExpiryDate = (expiryDate) => {
  if (!expiryDate) return '5h 30m 32s';

  const now = Date.now();
  const timeLeft = expiryDate - now;

  if (timeLeft <= 0) return '5h 30m 32s';

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(8);
  const [filterOption, setFilterOption] = useState('default');

  useEffect(() => {
    const fetchExploreItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://us-central1-nft-cloud-functions.cloudfunctions.net/explore'  
        );
        setItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Error fetching explore items:', error);
      } finally {
        setLoading(false);
      }   
    };
    fetchExploreItems();
  }, []);

  // Filter/Sort function
  useEffect(() => {
    if (items.length === 0) return;

    let sorted = [...items];

    switch (filterOption) {
      case 'price_low_to_high':
        sorted.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
        break;
      case 'price_high_to_low':
        sorted.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
        break;
      case 'likes_high_to_low':
        sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'default':
      default:
        sorted = [...items];
        break;
    }

    setFilteredItems(sorted);
    setVisibleItems(8); // Reset visible items when filter changes
  }, [filterOption, items]);

  const loadMoreItems = () => {
    setVisibleItems(prev => prev + 4);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <>
      {/* Filter Dropdown */}
      <div className="col-lg-12 mb-4">
        <div className="items_filter">
          <select 
            value={filterOption} 
            onChange={handleFilterChange}
            className="form-select"
            style={{
              width: '200px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="default">Default</option>
            <option value="price_low_to_high">Price: Low to High</option>
            <option value="price_high_to_low">Price: High to Low</option>
            <option value="likes_high_to_low">Most Liked</option>
          </select>
        </div>
      </div>

      {loading ? (
        new Array(8).fill(0).map((_, index) => (
          <ExploreItemSkeleton key={index} />
        ))
      ) : (
        <>
          {filteredItems.slice(0, visibleItems).map((item, index) => (
            <div className="col-lg-3 col-md-6 mb-4" key={item.id || index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to={`/author/${item.authorId || ''}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={`Creator: ${item.authorName || 'Unknown Author'}`}
                  >
                    <img 
                      src={item.authorImage || AuthorImage} 
                      alt={item.authorName || 'Author'}  
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="de_countdown">
                  {formatExpiryDate(item.expiryDate)}
                </div>

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <Link to={`/item-details/${item.nftId || item.id || ''}`}>
                    <img
                      src={item.nftImage || nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title || 'NFT'}
                    />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId || item.id || ''}`}>
                    <h4>{item.title || 'NFT Title'}</h4>
                  </Link>
                  <div className="nft__item_price">
                    {item.price || '0.00'} ETH 
                  </div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {visibleItems < filteredItems.length && (
            <div className="col-lg-12">
              <div className="text-center">
                <button 
                  className="btn-main lead" 
                  onClick={loadMoreItems}
                >
                  Load More
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ExploreItems;