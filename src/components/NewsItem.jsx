import React from 'react'
const NewsItem = (props) => {
    const { title, description, imageUrl, newsUrl, author, date, source } = props;
    const defaultImage = "https://i-invdn-com.investing.com/news/LYNXNPEC0B0BR_L.jpg";
    return (
        <div className="my-3">
           <div className="card">
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", right: "0", zIndex: "1" }}>
                     <span className="badge rounded-pill bg-primary">{source}</span>
                </div>
                <img
                    src={imageUrl || defaultImage}
                    className="card-img-top"
                    alt={title || "News image"}
                    style={{
                        height: "180px",
                        objectFit: "cover",
                        width: "100%"
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <p className="card-text"><small className="text-body-secondary">by {author ? author : "Unknown"} on {new Date(date).toDateString()}</small></p>
                    <a rel="noopener noreferrer" href={newsUrl} target="_blank" className="btn btn-dark">Read More</a>
                </div>
            </div>
        </div>
    )
}

export default NewsItem;