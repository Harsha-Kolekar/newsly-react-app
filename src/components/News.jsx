import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [searchParams] = useSearchParams();
    const searchQuery = props.isSearch ? searchParams.get('q') || '' : '';

    const capitalizeFirstLetter = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    };

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - Newsly`;
    }, [props.category]);

    const updateNews = async () => {
        props.setProgress(10);
        setLoading(true);
        
        try {
            let url;
            if (props.isSearch && searchQuery) {
                // If it's a search query, use the everything endpoint
                url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
                console.log('Search URL:', url);
            } else {
                // Otherwise, use the top-headlines endpoint with category
                url = `https://newsapi.org/v2/top-headlines?country=${props.country}${props.category ? `&category=${props.category}` : ''}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
                console.log('Category URL:', url);
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API Response:", data);

            // If it's a new search (page=1), replace the articles, otherwise append
            const newArticles = Array.isArray(data.articles) ? data.articles : [];
            if (page === 1) {
                setArticles(newArticles);
            } else {
                setArticles(prevArticles => [...prevArticles, ...newArticles]);
            }
            
            setTotalResults(Number(data.totalResults) || 0);
            props.setProgress(100);
        } catch (error) {
            console.error("Error fetching news: ", error);
            setArticles([]);
            setTotalResults(0);
            // Show alert only if it's the first page and there are no articles
            if (page === 1) {
                alert("Error fetching news. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset to first page when search query, category, or search mode changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery, props.category, props.isSearch]);

    // Call updateNews when component mounts or when dependencies change
    useEffect(() => {
        updateNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchQuery, props.category, props.isSearch]);

    const fetchMoreData = async () => {
        if (loading || articles.length >= totalResults) return;
        setPage(prevPage => prevPage + 1);
    };


    return (
        <div className="container my-3">
            <h1 className="text-center" style={{ margin: "60px 0px", marginTop: "70px" }}>
                {searchQuery 
                    ? `Search Results for: ${searchQuery}` 
                    : `Newsly - Top ${capitalizeFirstLetter(props.category || 'News')} Headlines`}
            </h1>
            <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={<h4>Loading...</h4>}>
                <div className="container">
                    <div className="row">
                            {articles.map((element, index) => (
                            <div className="col-md-4 mb-4" key={`${element.url || 'article'}-${index}`}>
                                <NewsItem
                                    title={element.title || 'No title available'}
                                    description={element.description || 'No description available'}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url || '#'}
                                    author={element.author || 'Unknown'}
                                    date={element.publishedAt || new Date().toISOString()}
                                    source={element.source?.name || 'Unknown Source'}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </div>
    )
}

News.defaultProps = {
    country: "us",
    pageSize: 9,
    category: "general",
    isSearch: false,
    setProgress: () => {}
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    isSearch: PropTypes.bool,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func
}
export default News