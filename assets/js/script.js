/*
?===============================================
?                Variables
?===============================================
*/

const APIURL = "https://www.mp3quran.net/api/v3/";

const endPoint = "reciters";
const language = "ar";

/**
 * => How To Use
 * Explain: => let username = eleId('username');
 */
let eleId = id => document.getElementById(id);

// => Element Parent Items For Api
const innerMain = eleId("inner-main");

// => Form For Search
const form = eleId("form");

// => Input Search For Play List
const search = eleId("search ");

/*
?===============================================
?                 Api Url
?===============================================
*/

/*
?===============================================
?                 Start Play Function
?===============================================
*/

getApi();

/*
?===============================================
?               Functions
?===============================================
*/
// https://www.mp3quran.net/api/v3/reciters?language=ar
// ${url}/${endPoint}?language=${language}
async function getApi() {
  const response = await fetch(`${APIURL}${endPoint}?language=${language}`);
  // console.log("response: ", response);
  const data = await response.json();
  // console.log("data: ", data);
  const chooseReciters = document.querySelector("#chooseReciters");
  // console.log("chooseReciters: ", chooseReciters);
  chooseReciters.innerHTML = `<option value="">قائمة بجميع القراء المتاحين</option>`;
  data.reciters.forEach(reciter => {
    // console.log(reciter.name);
    chooseReciters.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
  });
  chooseReciters.addEventListener("change", event => {
    // console.log("event: ", event.target.value);
    getMoshaf(event.target.value);
  });
}

async function getMoshaf(reciter) {
  // console.log("moshaf: ", moshaf);
  const response = await fetch(
    `https://www.mp3quran.net/api/v3/reciters?language=${language}&reciter=${reciter}`
  );
  // console.log("response: ", response);
  const data = await response.json();
  // console.log("data: ", data);
  const moshafs = data.reciters[0].moshaf;
  // console.log("moshafs: ", moshafs);
  const chooseMoshaf = document.querySelector("#chooseMoshaf");
  // console.log("chooseMoshaf: ", chooseMoshaf);
  chooseMoshaf.innerHTML = `<option value="">قائمة بجميع المصاحف</option>`;

  moshafs.forEach(reciter => {
    // console.log(reciter.name);
    chooseMoshaf.innerHTML += `<option value="${reciter.id}" data-server="${reciter.server}" data-surah-list="${reciter.surah_list}">${reciter.name}</option>`;
    chooseMoshaf.addEventListener("change", event => {
      // console.log("event: ", event.target.value);
      const selecteMoshf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
      // console.log("selecteMoshf: ", selecteMoshf);
      const surahServer = selecteMoshf.dataset.server;
      // console.log('surahServer: ', surahServer);
      const surahList = selecteMoshf.dataset.surahList;
      // console.log('surahList: ', surahList);
      getSurah(surahServer, surahList);
    });
  });
}

async function getSurah(surahServer, surahList) {
  const chooseSurah = document.querySelector("#chooseSurah");
  chooseSurah.innerHTML = `<option value="" >قائمة بجميع السور</option>`;
  // console.log("Suhaf: ", Sohf);
  const response = await fetch(`https://mp3quran.net/api/v3/suwar`);
  // console.log("response: ", response);
  const data = await response.json();
  // console.log("data Sohf: ", data);
  const surahNams = data.suwar;
  // console.log("surahNams: ", surahNams);
  surahList = surahList.split(",");
  // console.log('surahList: ', surahList);
  surahList.forEach(surah => {
    // console.log("surah: ", surah);
    const padSurah = surah.padStart(3, "0");
    surahNams.forEach(surahNam => {
      if (surahNam.id == surah) {
        // console.log("surahNam: ", surahNam.name);
        chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3" >${surahNam.name}</option>`;
      }
    });
  });

  //
  chooseSurah.addEventListener("change", event => {
    // console.log("event: ", event.target.value);
    const selecteSurah = chooseSurah.options[chooseSurah.selectedIndex];
    // console.log("selecteSurah: ", selecteSurah);
    playSurah(selecteSurah.value);
    // console.log('selecteSurah.value: ', selecteSurah.value);
  });
}

function playSurah(surahmp3) {
  // console.log('surahmp3: ', surahmp3);
  const audioPlayer = document.querySelector("#audioPlayer");
  // console.log('audioPlayer: ', audioPlayer);
  audioPlayer.src = surahmp3;
  // console.log('audioPlayer.src: ', audioPlayer.src);
  audioPlayer.play();
}
