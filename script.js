console.log("Lets Write JS")
let playBtn = document.querySelector('.timepass')
let currentSong = new Audio();
let songs;
let currfolder;



function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    // Add leading zero if seconds < 10
    if (secs < 10) secs = "0" + secs;
    return `${mins}:${secs}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    // console.log(as)
    songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    // Show all the songs in the Playlist
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
              <img class="invert" src="img/music.svg" alt="">
              <div class="info">
                <div>${decodeURIComponent(song.split('/').pop())}</div>
                <div>Nivesh</div>
              </div>
              <div class="playNow">
                <img class="invert timepass" src="img/newPlay.svg" alt="">
              </div></li>`
    }



    //Attach an event listener to each songs
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', (element) => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML)
        })
    })

    return songs

}


const playMusic = (track, pause = false) => {
    // let audio = new Audio('song/'+track)
    currentSong.src = `${currfolder}/` + decodeURIComponent(track.split('/').pop())
    // console.log(decodeURIComponent(track.split('/').pop()))
    if (!pause) {

        document.getElementById("play").src = "img/pause.svg"
        currentSong.play()
    }
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track.split('/').pop())
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    await getSongs("http://127.0.0.1:5500/song/Sonu nigam")
    // console.log(songs)
    playMusic(songs[0], true)

    //Display all the albums on the page
    async function displayAlbums() {
        let a = await fetch(`song/`)
        let response = await a.text()
        // console.log(response)
        let div = document.createElement('div')
        div.innerHTML = response
        let anchor = div.getElementsByTagName('a')
        let folders = []
        let array = Array.from(anchor)
            for (let i = 0; i < array.length; i++) {
                const e = array[i];
                
            
            if (e.href.includes("http://127.0.0.1:5500/song/")) {
                let folder = e.href.split('/').slice(-2)[1]

                //Get the meta data of the folder
                let a = await fetch(`song/${folder}/info.json`)
                let response = await a.json()
                // console.log(response)
                document.querySelector('.card-container').innerHTML = document.querySelector('.card-container').innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" role="img">
                         <!-- Green circle background -->
                        <circle cx="12" cy="12" r="11.75" fill="#1ed760" />

                        <!-- Black play triangle -->
                         <path
                             d="M10.6804 8.1867L15.8192 10.9394C16.7269 11.4257 16.7269 12.5743 15.8192 13.0606L10.6804 15.8133C9.72723 16.3239 8.5 15.727 8.5 14.7527V9.24729C8.5 8.27305 9.72723 7.6761 10.6804 8.1867Z"
                             fill="black" />
                         </svg>

                        </div>
                        <img src="song/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                    <p>${response.description}</p>
                </div>`
            }
        }
        // console.log(anchor)

        //Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName('card')).forEach((e) => {
            // console.log(e)
            e.addEventListener('click', async (item) => {
                // console.log(item.currentTarget.dataset)
                songs = await getSongs(`song/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
            })
        })
    }
    displayAlbums()
    //Attach an event listener to play, next and previous buttons
    document.getElementById("play").addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            document.getElementById("play").src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            document.getElementById("play").src = "img/play.svg"
        }
    })


    //Listen for time update event
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime , currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // add event listener on seekbar
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let percent = ((e.offsetX) / (e.target.getBoundingClientRect().width)) * 100 - 1
        document.querySelector('.circle').style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listener for hamburger

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = "0"
    })
    //Add an event listener for close button
    document.querySelector('.cls').addEventListener('click', () => {
        document.querySelector('.left').style.left = "-200%"
    })

    //Add an event listener for previous button
    document.querySelector('#previous').addEventListener('click', () => {
        // console.log('previous')
        let index = songs.indexOf(currentSong.src)
        // console.log(index, length)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    //Add an event listener for next button
    document.querySelector('#next').addEventListener('click', () => {
        // console.log('next')
        let index = songs.indexOf(currentSong.src)
        // console.log(index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add event listener for volume 
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        // console.log(e , e.target , e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100

    })

    //Add an event Listener for mute the track
    document.querySelector('.volume > img').addEventListener('click',(e)=>{
        // console.log(e.target)
        if(e.target.src.includes('img/volume.svg'))
        {
            e.target.src = e.target.src.replace('img/volume.svg' , 'img/mute.svg')
            currentSong.volume = 0
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace('img/mute.svg','img/volume.svg')
            currentSong.volume = 0.25
            document.querySelector('.range').getElementsByTagName('input')[0].value = 25
        }
    })
}

main()
