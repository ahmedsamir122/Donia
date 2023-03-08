import Talent from "./Talent";
import classes from "./Talents.module.css";
import user from "../../img/user.jpg";
const Talents = () => {
  const artists = [
    { name: "zaki", img: user },
    { name: "zaki", img: user },
    { name: "zaki", img: user },
    { name: "zaki", img: user },
    { name: "zaki", img: user },
    { name: "zaki", img: user },
    { name: "zaki", img: user },
    { name: "zaki", img: user },
  ];
  return (
    <section className={classes.main}>
      <div className="container">
        <div className={classes.conArtists}>
          {artists.map((artist, i) => (
            <Talent key={i} name={artist.name} img={artist.img} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Talents;
