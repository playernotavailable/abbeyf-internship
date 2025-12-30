import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const SellerSkeleton = () => {
  return (
    <li>
      <div className="author_list_pp">
        <Skeleton circle width={50} height={50} />
      </div>
      <div className="author_list_info">
        <Skeleton width={100} height={18} style={{ marginBottom: '5px' }} />
        <Skeleton width={60} height={15} />
      </div>
    </li>
  );
};

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching top sellers...');
        
        const response = await axios.get(
          'https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers'
        );
        
        console.log('API Response:', response.data);
        setSellers(response.data);
        
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            {error && (
              <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
                <p>Error loading top sellers: {error}</p>
                <p>Check browser console for details</p>
              </div>
            )}
            <ol className="author_list">
              {loading ? (
                new Array(12).fill(0).map((_, index) => (
                  <SellerSkeleton key={index} />
                ))
              ) : (
                sellers.map((seller, index) => (
                  <li key={seller.id || index}>
                    <div className="author_list_pp">
                      <Link to={`/author/${seller.authorId || ''}`}>
                        <img
                          className="lazy pp-author"
                          src={seller.authorImage || AuthorImage}
                          alt={seller.authorName || 'Author'}
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                      <Link to={`/author/${seller.authorId || ''}`}>
                        {seller.authorName || 'Unknown'}
                      </Link>
                      <span>{seller.price || '0.00'} ETH</span>
                    </div>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;