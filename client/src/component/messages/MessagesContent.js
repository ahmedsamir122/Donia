import classes from "./MessagesContent.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import img1 from "../../img/user2.jpg";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
const MessageContent = () => {
  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.messagesCon}>
          <div className={classes.left}>
            <div className={classes.topLeft}>
              <input className={classes.input} placeholder="Search messages " />
              <SearchOutlinedIcon className={classes.searchIcon} />
            </div>
            <div className={classes.conversationCon}>
              <Link to="/messages/2" className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </Link>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.conversation}>
                <img className={classes.img} src={img1} alt="" />
                <div className={classes.dataUser}>
                  <div className={classes.dataTop}>
                    <p className={classes.userName}>Jonas</p>
                    <p className={classes.date}>9 June</p>
                  </div>
                  <div className={classes.textCon}>
                    <p className={classes.sender}>You: </p>
                    <p className={classes.text}>
                      how did you ggfgfgfgfgfgfgfgfo yesterday ?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.right}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageContent;
