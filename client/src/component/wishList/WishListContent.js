import classes from "./WishListContent.module.css";
import { useSelector } from "react-redux";
import WishListOne from "./WishListOne";

const WishListContent = (props) => {
  const wishList = useSelector((state) => state.wishlist.wishlist);

  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.conArtists}>
          {wishList?.map((artist, i) => (
            <WishListOne
              key={artist.user}
              username={artist.username}
              photo={artist.photo}
              id={artist.user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishListContent;
