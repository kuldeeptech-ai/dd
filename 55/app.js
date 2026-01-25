const API="YOUR_TMDB_API_KEY";

function openMovie(id){
 location.href="movie.html?id="+id;
}

function searchMovie(q){
 if(q.length<2)return;
 fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${q}`)
 .then(r=>r.json())
 .then(d=>{
  trending.innerHTML="";
  d.results.slice(0,12).forEach(m=>{
   if(!m.poster_path)return;
   trending.innerHTML+=`<img src="https://image.tmdb.org/t/p/w300${m.poster_path}" onclick="openMovie(${m.id})">`;
  });
 });
}

function loadAuto(type, box){
 fetch(`https://api.themoviedb.org/3/${type}?api_key=${API}`)
 .then(r=>r.json())
 .then(d=>{
  box.innerHTML="";
  d.results.slice(0,12).forEach(m=>{
   if(!m.poster_path)return;
   box.innerHTML+=`<img src="https://image.tmdb.org/t/p/w300${m.poster_path}" onclick="openMovie(${m.id})">`;
  });
 });
}

if(document.getElementById("trending")){
 loadAuto("trending/movie/week", trending);
 loadAuto("movie/now_playing", latest);
}

if(location.pathname.includes("movie.html")){
 const id=new URLSearchParams(location.search).get("id");
 fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API}&append_to_response=credits`)
 .then(r=>r.json())
 .then(m=>{
  banner.style.backgroundImage=`url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;
  poster.src=`https://image.tmdb.org/t/p/w500${m.poster_path}`;
  title.innerText=m.title;
  meta.innerText="⭐ "+m.vote_average+" • "+m.runtime+"m";
  m.credits.cast.slice(0,8).forEach(c=>{
   if(!c.profile_path)return;
   cast.innerHTML+=`<img src="https://image.tmdb.org/t/p/w200${c.profile_path}">`;
  });
  watch.src=`https://vidsrc.vip/embed/movie/${id}`;
 });
}

function goHome(){scrollTo({top:0,behavior:"smooth"})}
function goSearch(){document.querySelector("input").focus()}
function goTrending(){document.getElementById("trending").scrollIntoView({behavior:"smooth"})}
