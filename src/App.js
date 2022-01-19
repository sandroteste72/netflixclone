import { useEffect, useState } from 'react';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie/FeaturedMovie';
import Header from './components/Header/Header';
import MovieRow from './components/MovieRow/MovieRow';
import Tmdb from './Tmdb';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {

    const loadAll = async () => {
      //Lista de Filmes
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //Destaques
      let originals = list.filter(i => i.slug === 'originals');
      let randomPick = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosenMovie = originals[0].items.results[randomPick];
      let chosenMovieInfo = await Tmdb.getMovieInfo(chosenMovie.id, 'tv');
      setFeatureData(chosenMovieInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    }
  }, []);

  return (
    <div className='page'>

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className='lists'>
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Desenvolvido por Sandro Arpi <span role="img" aria-label="metal">🤘</span> na live do Prof. Bonieky<br/>
        Direitos de imagem para a Netflix <br/>
        Dados pegos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 &&
                <div className={"loading"}>
                    <img src={'https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif'} alt={"Carregando"} />
                </div>
            }
    </div>
  );
}
