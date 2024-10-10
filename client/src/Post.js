import {format} from 'date-fns';

export default function Post({title, summary, cover, content, createdAt}) {
    return(
        <div className="post">
        <div className="image">
         <img src="/images/city.jpg" alt="" />
        </div>
        <div className="texts">
          <h2>{title}</h2>
          <p className="info">
            <a className="author">Mobashhir Khan</a>
            <time>{format(new Date (createdAt), "MMM d, yyyy HH:mm")}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    );
}