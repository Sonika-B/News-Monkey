import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, settotalResults] = useState(0)
  
  
  const captalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  
  const updateNews = async () => {
    props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=10c485de713f41e39059af980a08b911&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles)
    setLoading(false)
    settotalResults(parsedData.totalResults)
    props.setProgress(100);
  }
  
  useEffect(() => {
    document.title = `${captalize(props.category)}-NewsMonkey`
    updateNews();
}, [])


// handleNextClick = async () => {
//   setPage(page + 1)
//   updateNews();
// };

// handlePrevClick = async () => {
//   setPage(page - 1)
//   updateNews();
// };

const fetchMoreData = async () => {
  const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=10c485de713f41e39059af980a08b911&page=${page+1}&pageSize=${props.pageSize}`;
  setPage(page + 1)
  // setState({ loading: true });
  let data = await fetch(url);
  let parsedData = await data.json();
  setArticles(articles.concat(parsedData.articles))
  settotalResults(parsedData.totalResults)
  setLoading(false)
};


return (
  <>
    <h1 className='text-center' style={{ margin: "35px 0px" ,marginTop:"90px" }}>News Monkey-top {captalize(props.category)} headlines</h1>
    {loading && <Spinner />}
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreData}
      hasMore={articles.length !== totalResults}
      loader={<Spinner />}
    >
      <div className="container">
        <div className="row">
          {articles && articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
              <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
            </div>
          })};
        </div>
      </div>
    </InfiniteScroll>
    {/* <div className="container d-flex justify-content-between">
          <button type="button" disabled={page <= 1} className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
          <button type="button" disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} className="btn btn-dark" onClick={handleNextClick} >Next &rarr;</button>
        </div> */}

  </>
);
}

News.defaultProps = {
  country: 'in',
  number: 8,
  category: "general"
}

News.propTypes = {
  country: PropTypes.string,
  number: PropTypes.number,
  category: PropTypes.string
}


export default News
