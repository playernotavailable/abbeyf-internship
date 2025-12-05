import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const NewItemSkeleton = () => {
  return (
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

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div 
      className="custom-arrow custom-next"
      onClick={onClick}
      style={{
        position: "absolute",
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        zIndex: 10,
        fontSize: '20px',
        color: '#333'
      }}
    >
      <i className="fa fa-chevron-right"></i>
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div 
      className="custom-arrow custom-prev"
      onClick={onClick}
      style={{
        position: "absolute",
        left: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        zIndex: 10,
        fontSize: '20px',
        color: '#333'
      }}
    >
      <i className="fa fa-chevron-left"></i>
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems'
        );
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching new items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewItems();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12">
            {loading ? (
              <Slider {...settings}>
                {new Array(8).fill(0).map((_, index) => (
                  <div key={index} className="px-2">
                    <NewItemSkeleton />
                  </div>
                ))}
              </Slider>
            ) : (
              <Slider {...settings}>
                {items.map((item, index) => (
                  <div key={item.id || index} className="px-2">
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId || ''}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={`Creator: ${item.authorName || 'Unknown'}`}
                        >
                          <img 
                            className="lazy" 
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
                          <h4>{item.title || 'Untitled'}</h4>
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
              </Slider>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;