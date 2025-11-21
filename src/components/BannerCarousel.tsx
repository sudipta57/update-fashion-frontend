import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

interface Banner {
  _id: string;
  imageUrl: string;
  link: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: banners.length > 1, // Only enable infinite if more than 1 banner
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1, // Only autoplay if more than 1 banner
    autoplaySpeed: 3000,
    nextArrow: <></>,
    prevArrow: <></>,
  };

  // If only one banner, show it without carousel
  if (banners.length === 1) {
    return (
      <div className="relative min-h-[40rem]">
        <Link to={banners[0].link}>
          <img
            src={banners[0].imageUrl}
            alt="Banner"
            className="w-full h-[40rem] object-cover"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[40rem]">
      <Slider {...settings} className="w-full">
        {banners.map((banner) => (
          <Link key={banner._id} to={banner.link}>
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="w-full h-[40rem] object-cover"
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;